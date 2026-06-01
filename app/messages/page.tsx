"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import CustomerMenu from "@/components/CustomerMenu";
import { supabase } from "@/lib/supabase";
import T from "@/components/T";

type Conversation = {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  title: string | null;
  status: "active" | "closed";
  last_message: string | null;
  last_message_at: string;
  created_at: string;
};

type Message = {
  id: string;
  conversation_id: string | null;
  user_id: string;
  user_email: string;
  sender: "user" | "admin";
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function MessagesPage() {
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [displayName, setDisplayName] = useState("Customer");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [messageText, setMessageText] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newConversationOpen, setNewConversationOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConversation]);

  async function loadInitialData() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user?.email) {
      window.location.href = "/login";
      return;
    }

    setUserId(user.id);
    setUserEmail(user.email);

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, full_name")
      .eq("id", user.id)
      .single();

    const userName =
      profile?.display_name || profile?.full_name || user.email || "Customer";

    setDisplayName(userName);

    await loadConversations(user.id, user.email, userName);
  }

  async function loadConversations(
    currentUserId = userId,
    currentEmail = userEmail,
    currentName = displayName
  ) {
    let { data } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", currentUserId)
      .order("last_message_at", { ascending: false });

    if (!data || data.length === 0) {
      const { data: created, error } = await supabase
        .from("conversations")
        .insert({
          user_id: currentUserId,
          user_email: currentEmail,
          user_name: currentName,
          title: "General Support",
          status: "active",
          last_message: null,
        })
        .select("*")
        .single();

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      data = [created];
    }

    setConversations(data);
    setActiveConversation(data[0]);
    await loadMessages(data[0].id, currentUserId);
    setLoading(false);
  }

  async function loadMessages(conversationId: string, currentUserId = userId) {
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .eq("user_id", currentUserId)
      .eq("sender", "admin")
      .eq("is_read", false);

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  }

  async function createConversation(event: FormEvent) {
    event.preventDefault();

    if (!newTitle.trim()) return;

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        user_email: userEmail,
        user_name: displayName,
        title: newTitle.trim(),
        status: "active",
        last_message: null,
      })
      .select("*")
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setNewTitle("");
    setNewConversationOpen(false);
    setActiveConversation(data);
    setMessages([]);
    await loadConversations();
  }

  async function selectConversation(conversation: Conversation) {
    setActiveConversation(conversation);
    await loadMessages(conversation.id);
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();

    if (!activeConversation || !messageText.trim()) return;

    setSending(true);

    const text = messageText.trim();

    const { error } = await supabase.from("messages").insert({
      conversation_id: activeConversation.id,
      user_id: activeConversation.user_id,
      user_email: activeConversation.user_email,
      sender: "user",
      subject: activeConversation.title || "Customer Support",
      message: text,
      is_read: false,
    });

    if (error) {
      setSending(false);
      alert(error.message);
      return;
    }

    await supabase
      .from("conversations")
      .update({
        status: "active",
        last_message: text,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", activeConversation.id);

    setMessageText("");
    setSending(false);

    await loadConversations();
  }

  async function closeConversation() {
    if (!activeConversation) return;

    await supabase
      .from("conversations")
      .update({ status: "closed" })
      .eq("id", activeConversation.id);

    await loadConversations();
  }

  async function reopenConversation() {
    if (!activeConversation) return;

    await supabase
      .from("conversations")
      .update({ status: "active" })
      .eq("id", activeConversation.id);

    await loadConversations();
  }

  return (
    <main className="min-h-screen bg-[#f4f0eb] text-[#2b211d]">
      <CustomerMenu />

      <section className="mx-auto max-w-[1500px] px-3 py-4 md:px-8 md:py-8">
        <div className="grid h-[78vh] overflow-hidden rounded-[2rem] bg-white shadow-sm md:grid-cols-[360px_1fr]">
          <aside
            className={`border-r border-[#eadccc] bg-[#fbf7f1] ${
              activeConversation ? "hidden md:block" : "block"
            }`}
          >
            <div className="border-b border-[#eadccc] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#b08a5b]">
                    <T text="Messages" />
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold">
                    <T text="Conversations" />
                  </h1>
                </div>

                <button
                  onClick={() => setNewConversationOpen(true)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2b211d] text-2xl text-white"
                >
                  +
                </button>
              </div>
            </div>

            <div className="h-[calc(78vh-93px)] overflow-y-auto p-3">
              {loading && (
                <div className="rounded-2xl bg-white p-5 text-center">
                  <T text="Loading..." />
                </div>
              )}

              {!loading &&
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => selectConversation(conversation)}
                    className={`mb-3 w-full rounded-[1.5rem] border p-4 text-left transition ${
                      activeConversation?.id === conversation.id
                        ? "border-[#2b211d] bg-white"
                        : "border-[#eadccc] bg-white/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {conversation.title || "Customer Support"}
                        </p>

                        <p className="mt-2 line-clamp-2 text-sm text-[#6f625b]">
                          {conversation.last_message ||
                            <T text="No messages yet. Start the conversation." />}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] uppercase ${
                          conversation.status === "closed"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {conversation.status}
                      </span>
                    </div>

                    <p className="mt-3 text-[11px] text-[#8a7b72]">
                      {conversation.last_message_at
                        ? new Date(
                            conversation.last_message_at
                          ).toLocaleString()
                        : ""}
                    </p>
                  </button>
                ))}
            </div>
          </aside>

          <section
            className={`flex h-[78vh] flex-col ${
              activeConversation ? "block" : "hidden md:flex"
            }`}
          >
            {activeConversation ? (
              <>
                <div className="flex items-center justify-between border-b border-[#eadccc] bg-[#fbf7f1] px-4 py-4 md:px-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveConversation(null)}
                      className="text-2xl md:hidden"
                    >
                      ‹
                    </button>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2b211d] text-lg font-bold text-white">
                      R
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold md:text-2xl">
                        {activeConversation.title || "Ressential Support"}
                      </h2>
                      <p className="text-xs text-[#6f625b]">
                        {activeConversation.status === "closed"
                          ? "Conversation closed"
                          : "Ressential Support"}
                      </p>
                    </div>
                  </div>

                  {activeConversation.status === "active" ? (
                    <button
                      onClick={closeConversation}
                      className="rounded-full border border-[#d8c7b4] px-4 py-2 text-xs font-semibold uppercase tracking-widest"
                    >
                      <T text="Close" />
                    </button>
                  ) : (
                    <button
                      onClick={reopenConversation}
                      className="rounded-full bg-[#2b211d] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white"
                    >
                      <T text="Reopen" />
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto bg-[#efe7df] px-3 py-5 md:px-6">
                  {messages.length === 0 && (
                    <div className="mx-auto mt-10 max-w-md rounded-[2rem] bg-white p-7 text-center shadow-sm">
                      <h3 className="text-2xl font-semibold">
                        <T text="Start this conversation" />
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#6f625b]">
                        <T text="Write your question about products, custom orders,
                        delivery or an existing order." />
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {messages.map((item) => {
                      const isUser = item.sender === "user";

                      return (
                        <div
                          key={item.id}
                          className={`flex ${
                            isUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[84%] rounded-[1.5rem] px-5 py-4 shadow-sm md:max-w-[68%] ${
                              isUser
                                ? "rounded-br-sm bg-[#2b211d] text-white"
                                : "rounded-bl-sm bg-white text-[#2b211d]"
                            }`}
                          >
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">
                              {isUser ? displayName : "Administrator"}
                            </p>

                            <p className="whitespace-pre-line text-sm leading-7">
                              {item.message}
                            </p>

                            <p
                              className={`mt-2 text-right text-[10px] ${
                                isUser ? "text-white/60" : "text-[#8a7b72]"
                              }`}
                            >
                              {new Date(item.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                </div>

                {activeConversation.status === "closed" ? (
                  <div className="border-t border-[#eadccc] bg-white p-4 text-center">
                    <p className="text-sm text-[#6f625b]">
                      <T text="This conversation is closed. Reopen it to send a new
                      message." />
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={sendMessage}
                    className="flex items-end gap-3 border-t border-[#eadccc] bg-white p-3 md:p-5"
                  >
                    <textarea
                      required
                      rows={1}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Write your message..."
                      className="max-h-32 flex-1 resize-none rounded-[1.5rem] border border-[#ddd0c0] bg-[#fbf7f1] px-5 py-4 text-sm outline-none"
                    />

                    <button
                      disabled={sending}
                      type="submit"
                      className="rounded-full bg-[#2b211d] px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-60"
                    >
                      {sending ? "..." : <T text="Send" />}
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="hidden h-full items-center justify-center text-center md:flex">
                <div>
                  <h2 className="text-3xl font-semibold">
                    <T text="Select a conversation" />
                  </h2>
                  <p className="mt-3 text-[#6f625b]">
                    <T text="Choose a conversation from the side panel." />
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>

      {newConversationOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
          <form
            onSubmit={createConversation}
            className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold"><T text="New conversation" /></h2>
            <p className="mt-2 text-sm text-[#6f625b]">
              <T text="Give this conversation a clear subject." />
            </p>

            <input
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Example: Custom wedding gift"
              className="mt-5 w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
            />

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNewConversationOpen(false)}
                className="rounded-full border border-[#d8c7b4] px-5 py-4 text-xs font-semibold uppercase tracking-widest"
              >
                <T text="Cancel" />
              </button>

              <button
                type="submit"
                className="rounded-full bg-[#2b211d] px-5 py-4 text-xs font-semibold uppercase tracking-widest text-white"
              >
                <T text="Create" />
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}