"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { supabase } from "@/lib/supabase";

type Conversation = {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  title: string | null;
  status: "active" | "closed";
  last_message: string | null;
  last_message_at: string | null;
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

type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  full_name: string | null;
};

const filters = ["all", "active", "closed", "unread"];

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("all");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversation]);

  async function checkAdminAndLoad() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user?.email) {
      window.location.href = "/login";
      return;
    }

    const { data: adminData } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", userData.user.email)
      .single();

    if (!adminData) {
      window.location.href = "/";
      return;
    }

    await loadData();
  }

  async function loadData(selectConversationId?: string) {
    const [conversationResult, messagesResult, profilesResult] =
      await Promise.all([
        supabase
          .from("conversations")
          .select("*")
          .order("last_message_at", { ascending: false }),

        supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: true }),

        supabase.from("profiles").select("id, email, display_name, full_name"),
      ]);

    const conversationData = (conversationResult.data || []) as Conversation[];
    const allMessageData = (messagesResult.data || []) as Message[];

    setProfiles(profilesResult.data || []);
    setConversations(conversationData);
    setAllMessages(allMessageData);

    const active =
      conversationData.find((item) => item.id === selectConversationId) ||
      (selectedConversation
        ? conversationData.find((item) => item.id === selectedConversation.id)
        : null) ||
      conversationData[0] ||
      null;

    setSelectedConversation(active);

    if (active) {
      setMessages(
        allMessageData.filter((item) => item.conversation_id === active.id)
      );
    } else {
      setMessages([]);
    }

    setLoading(false);
  }

  function getProfile(userId: string) {
    return profiles.find((profile) => profile.id === userId);
  }

  function getCustomerName(conversation: Conversation) {
    const profile = getProfile(conversation.user_id);

    return (
      profile?.display_name ||
      profile?.full_name ||
      conversation.user_name ||
      conversation.user_email ||
      "Customer"
    );
  }

  async function selectConversation(conversation: Conversation) {
    setSelectedConversation(conversation);

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true });

    setMessages(data || []);

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversation.id)
      .eq("sender", "user")
      .eq("is_read", false);

    await loadData(conversation.id);
  }

  async function handleReply(event: FormEvent) {
    event.preventDefault();

    if (!selectedConversation || !replyMessage.trim()) return;

    setSending(true);

    const text = replyMessage.trim();

    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      user_id: selectedConversation.user_id,
      user_email: selectedConversation.user_email,
      sender: "admin",
      subject: selectedConversation.title || "Ressential Support Reply",
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
      .eq("id", selectedConversation.id);

    setReplyMessage("");
    setSending(false);

    await loadData(selectedConversation.id);
  }

  async function closeConversation() {
    if (!selectedConversation) return;

    await supabase
      .from("conversations")
      .update({
        status: "closed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedConversation.id);

    await loadData(selectedConversation.id);
  }

  async function reopenConversation() {
    if (!selectedConversation) return;

    await supabase
      .from("conversations")
      .update({
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedConversation.id);

    await loadData(selectedConversation.id);
  }

  const unreadByConversation = useMemo(() => {
    const counts: Record<string, number> = {};

    conversations.forEach((conversation) => {
      counts[conversation.id] = 0;
    });

    allMessages.forEach((message) => {
      if (
        message.conversation_id &&
        message.sender === "user" &&
        !message.is_read
      ) {
        counts[message.conversation_id] =
          (counts[message.conversation_id] || 0) + 1;
      }
    });

    return counts;
  }, [conversations, allMessages]);

  const filteredConversations = conversations.filter((conversation) => {
    const customerName = getCustomerName(conversation).toLowerCase();
    const query = searchText.toLowerCase();

    const matchesSearch =
      !query ||
      customerName.includes(query) ||
      conversation.user_email?.toLowerCase().includes(query) ||
      conversation.title?.toLowerCase().includes(query) ||
      conversation.last_message?.toLowerCase().includes(query);

    const unreadCount = unreadByConversation[conversation.id] || 0;

    const matchesFilter =
      filter === "all" ||
      conversation.status === filter ||
      (filter === "unread" && unreadCount > 0);

    return matchesSearch && matchesFilter;
  });

  const selectedCustomerName = selectedConversation
    ? getCustomerName(selectedConversation)
    : "";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f0eb] text-[#2b211d]">
      <AdminNavbar />

      <section className="mx-auto w-full max-w-[1700px] px-3 py-4 md:px-6 md:py-6">
        <div className="mb-4 hidden md:block md:pt-2">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold xl:text-4xl">
            Customer Conversations
          </h1>
        </div>

        <div className="grid h-[calc(100dvh-110px)] overflow-hidden rounded-[1.7rem] border border-[#eadccc] bg-white shadow-sm md:h-[calc(100dvh-180px)] md:min-h-[680px] md:grid-cols-[390px_minmax(0,1fr)]">
          <aside
            className={`min-w-0 border-r border-[#eadccc] bg-[#fbf7f1] ${
              selectedConversation ? "hidden md:block" : "block"
            }`}
          >
            <div className="border-b border-[#eadccc] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#b08a5b]">
                    Support Inbox
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    Conversations
                  </h2>
                </div>

                <span className="rounded-full bg-[#2b211d] px-3 py-1 text-xs font-semibold text-white">
                  {filteredConversations.length}
                </span>
              </div>

              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search customer or subject..."
                className="mt-4 w-full rounded-2xl border border-[#ddd0c0] bg-white px-4 py-3 text-sm outline-none"
              />

              <div className="mt-4 grid grid-cols-4 gap-2">
                {filters.map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`rounded-full px-2 py-2 text-[10px] font-semibold uppercase tracking-widest ${
                      filter === item
                        ? "bg-[#2b211d] text-white"
                        : "border border-[#d8c7b4] bg-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[calc(100dvh-310px)] overflow-y-auto overscroll-contain p-3 md:h-[calc(100%-154px)]">
              {loading && (
                <div className="rounded-2xl bg-white p-6 text-center">
                  Loading conversations...
                </div>
              )}

              {!loading && filteredConversations.length === 0 && (
                <div className="rounded-2xl bg-white p-6 text-center">
                  <h3 className="text-xl font-semibold">No conversations</h3>
                  <p className="mt-2 text-sm text-[#6f625b]">
                    New customer messages will appear here.
                  </p>
                </div>
              )}

              {!loading &&
                filteredConversations.map((conversation) => {
                  const unreadCount = unreadByConversation[conversation.id] || 0;
                  const isSelected =
                    selectedConversation?.id === conversation.id;
                  const customerName = getCustomerName(conversation);

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => selectConversation(conversation)}
                      className={`mb-3 w-full rounded-[1.3rem] border p-4 text-left transition ${
                        isSelected
                          ? "border-[#2b211d] bg-white"
                          : "border-[#eadccc] bg-white/80 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2b211d] text-sm font-bold text-white">
                          {customerName.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-base font-semibold">
                                {customerName}
                              </p>

                              <p className="mt-1 truncate text-xs text-[#8a7b72]">
                                {conversation.title || "Customer Support"}
                              </p>
                            </div>

                            {unreadCount > 0 && (
                              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#d56c8c] px-2 text-xs font-bold text-white">
                                {unreadCount}
                              </span>
                            )}
                          </div>

                          <p className="mt-2 line-clamp-2 break-words text-sm leading-5 text-[#6f625b]">
                            {conversation.last_message || "No messages yet."}
                          </p>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span
                              className={`rounded-full px-2 py-1 text-[10px] uppercase ${
                                conversation.status === "closed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {conversation.status}
                            </span>

                            <span className="shrink-0 text-[10px] text-[#8a7b72]">
                              {conversation.last_message_at
                                ? new Date(
                                    conversation.last_message_at
                                  ).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </aside>

          <section
            className={`min-w-0 ${
              selectedConversation ? "flex" : "hidden md:flex"
            } h-full flex-col`}
          >
            {selectedConversation ? (
              <>
                <div className="flex min-h-[76px] items-center justify-between border-b border-[#eadccc] bg-[#fbf7f1] px-4 py-3 md:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="shrink-0 text-3xl md:hidden"
                      aria-label="Back to conversations"
                    >
                      ‹
                    </button>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2b211d] text-base font-bold text-white">
                      {selectedCustomerName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold md:text-2xl">
                        {selectedCustomerName}
                      </h2>

                      <p className="truncate text-xs text-[#6f625b]">
                        {selectedConversation.title || "Customer Support"} •{" "}
                        {selectedConversation.user_email}
                      </p>
                    </div>
                  </div>

                  {selectedConversation.status === "active" ? (
                    <button
                      onClick={closeConversation}
                      className="ml-2 shrink-0 rounded-full border border-[#d8c7b4] px-4 py-2 text-xs font-semibold uppercase tracking-widest"
                    >
                      Close
                    </button>
                  ) : (
                    <button
                      onClick={reopenConversation}
                      className="ml-2 shrink-0 rounded-full bg-[#2b211d] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white"
                    >
                      Reopen
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto bg-[#efe7df] px-3 py-5 md:px-6">
                  {messages.length === 0 && (
                    <div className="mx-auto mt-10 max-w-md rounded-[2rem] bg-white p-7 text-center shadow-sm">
                      <h3 className="text-2xl font-semibold">
                        No messages yet
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#6f625b]">
                        Reply once the customer sends a message.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {messages.map((item) => {
                      const isAdmin = item.sender === "admin";

                      return (
                        <div
                          key={item.id}
                          className={`flex ${
                            isAdmin ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[86%] rounded-[1.35rem] px-4 py-3 shadow-sm md:max-w-[70%] md:px-5 md:py-4 ${
                              isAdmin
                                ? "rounded-br-sm bg-[#2b211d] text-white"
                                : "rounded-bl-sm bg-white text-[#2b211d]"
                            }`}
                          >
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">
                              {isAdmin ? "Administrator" : selectedCustomerName}
                            </p>

                            <p className="whitespace-pre-line break-words text-sm leading-7">
                              {item.message}
                            </p>

                            <p
                              className={`mt-2 text-right text-[10px] ${
                                isAdmin ? "text-white/60" : "text-[#8a7b72]"
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

                {selectedConversation.status === "closed" ? (
                  <div className="border-t border-[#eadccc] bg-white p-4 text-center">
                    <p className="text-sm text-[#6f625b]">
                      This conversation is closed. Reopen it to reply.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleReply}
                    className="flex items-end gap-3 border-t border-[#eadccc] bg-white p-3 md:p-4"
                  >
                    <textarea
                      required
                      rows={1}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Write a reply..."
                      className="max-h-32 flex-1 resize-none rounded-[1.5rem] border border-[#ddd0c0] bg-[#fbf7f1] px-5 py-4 text-sm outline-none"
                    />

                    <button
                      disabled={sending}
                      type="submit"
                      className="shrink-0 rounded-full bg-[#2b211d] px-5 py-4 text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-60 md:px-6"
                    >
                      {sending ? "..." : "Send"}
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="hidden h-full items-center justify-center text-center md:flex">
                <div>
                  <h2 className="text-3xl font-semibold">
                    Select a conversation
                  </h2>
                  <p className="mt-3 text-[#6f625b]">
                    Choose a customer conversation from the side panel.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
