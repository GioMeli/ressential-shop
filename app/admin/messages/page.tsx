"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminNavbar from "@/components/AdminNavbar";

type Message = {
  id: string;
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

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

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

  async function loadData() {
    const { data: messagesData } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, email, display_name, full_name");

    if (messagesData) setMessages(messagesData);
    if (profilesData) setProfiles(profilesData);
  }

  function getProfile(userId: string) {
    return profiles.find((profile) => profile.id === userId);
  }

  function getCustomerName(message: Message) {
    const profile = getProfile(message.user_id);

    return (
      profile?.display_name ||
      profile?.full_name ||
      message.user_email ||
      "Customer"
    );
  }

  const conversations = Array.from(
    new Map(messages.map((message) => [message.user_id, message])).values()
  );

  const currentConversation = messages.filter(
    (message) => message.user_id === selectedUserId
  );

  const selectedFirstMessage = currentConversation[0];
  const selectedProfile = selectedFirstMessage
    ? getProfile(selectedFirstMessage.user_id)
    : null;

  async function handleSelectConversation(userId: string) {
    setSelectedUserId(userId);

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("sender", "user")
      .eq("is_read", false);

    await loadData();
  }

  async function handleReply(event: FormEvent) {
    event.preventDefault();

    if (!selectedUserId || !replyMessage.trim()) return;

    const userMessage = currentConversation[0];

    if (!userMessage) return;

    setSending(true);

    const { error } = await supabase.from("messages").insert({
      user_id: userMessage.user_id,
      user_email: userMessage.user_email,
      sender: "admin",
      subject: "Ressential Support Reply",
      message: replyMessage,
      is_read: false,
    });

    setSending(false);

    if (error) {
      alert(error.message);
      return;
    }

    setReplyMessage("");
    await loadData();
  }

  return (
    <main className="min-h-screen bg-[#f8f3ed]  p-6 text-[#2b211d]">
      <AdminNavbar />
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b08a5b]">
          Admin Dashboard
        </p>

        <h1 className="mt-3 text-5xl font-semibold">Customer Messages</h1>

        <div className="mt-10 grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="rounded-[2rem] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Conversations</h2>

            <div className="mt-5 space-y-3">
              {conversations.map((conversation) => {
                const unreadCount = messages.filter(
                  (message) =>
                    message.user_id === conversation.user_id &&
                    message.sender === "user" &&
                    !message.is_read
                ).length;

                return (
                  <button
                    key={conversation.user_id}
                    onClick={() =>
                      handleSelectConversation(conversation.user_id)
                    }
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selectedUserId === conversation.user_id
                        ? "border-[#2b211d] bg-[#f3ebe3]"
                        : "border-[#eadccc] bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {getCustomerName(conversation)}
                        </p>

                        <p className="mt-1 text-xs text-[#6f625b]">
                          {conversation.user_email}
                        </p>
                      </div>

                      {unreadCount > 0 && (
                        <span className="rounded-full bg-[#d56c8c] px-2 py-1 text-xs font-semibold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm text-[#6f625b]">
                      {conversation.message}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            {!selectedUserId && (
              <div className="flex h-full min-h-[520px] items-center justify-center text-center">
                <div>
                  <h2 className="text-3xl font-semibold">
                    Select a conversation
                  </h2>

                  <p className="mt-3 text-[#6f625b]">
                    Choose a customer message from the left panel.
                  </p>
                </div>
              </div>
            )}

            {selectedUserId && selectedFirstMessage && (
              <>
                <div className="border-b border-[#eadccc] pb-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#b08a5b]">
                    Conversation
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold">
                    {selectedProfile?.display_name ||
                      selectedProfile?.full_name ||
                      selectedFirstMessage.user_email}
                  </h2>

                  <p className="mt-2 text-sm text-[#6f625b]">
                    {selectedFirstMessage.user_email}
                  </p>
                </div>

                <div className="mt-6 max-h-[520px] space-y-5 overflow-y-auto pr-2">
                  {currentConversation.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[85%] rounded-[2rem] p-5 ${
                        message.sender === "admin"
                          ? "ml-auto bg-[#2b211d] text-white"
                          : "bg-[#f5eee7] text-[#2b211d]"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                        {message.sender === "admin"
                          ? "Administrator"
                          : getCustomerName(message)}
                      </p>

                      {message.subject && (
                        <p className="mt-3 font-semibold">
                          {message.subject}
                        </p>
                      )}

                      <p className="mt-3 whitespace-pre-line leading-7">
                        {message.message}
                      </p>

                      <p className="mt-4 text-xs opacity-70">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleReply}
                  className="mt-6 border-t border-[#eadccc] pt-6"
                >
                  <textarea
                    required
                    rows={5}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                  />

                  <button
                    disabled={sending}
                    type="submit"
                    className="mt-4 rounded-full bg-[#2b211d] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-60"
                  >
                    {sending ? "Sending..." : "Send Reply"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}