"use client";

import * as React from "react";
import { X, Send, ImageIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "@zoomoff/api-client";
import { useAuthStore } from "@zoomoff/auth";
import { cn, Modal } from "@zoomoff/ui";

interface Props { taskId: string; onClose: () => void; }

export function TaskChat({ taskId, onClose }: Props) {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [input, setInput] = React.useState("");
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["chat", taskId],
    queryFn: () => tasksApi.getChat(taskId),
    refetchInterval: 3000,
  });

  const messages = data?.data ?? [];

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const { mutate: send, isPending } = useMutation({
    mutationFn: (content: string) => tasksApi.sendMessage(taskId, { content, type: "text" }),
    onSuccess: () => {
      setInput("");
      qc.invalidateQueries({ queryKey: ["chat", taskId] });
    },
  });

  return (
    <Modal open onOpenChange={onClose} title="Chat with Runner" size="md">
      <div className="flex flex-col h-96">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.length === 0 && (
            <p className="text-center text-xs text-zo-muted py-8">No messages yet. Say hello!</p>
          )}
          {messages.map((msg) => {
            const isOwn = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                  isOwn
                    ? "bg-brand-charcoal text-white rounded-br-sm"
                    : "bg-zo-bg-light text-brand-charcoal rounded-bl-sm"
                )}>
                  {msg.type === "image" ? (
                    <img src={msg.content} alt="Sent image" className="rounded-xl max-w-full" />
                  ) : (
                    <p>{msg.content}</p>
                  )}
                  <p className={cn("text-2xs mt-1", isOwn ? "text-white/60 text-right" : "text-zo-muted")}>
                    {new Date(msg.sentAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: true })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form
          className="flex items-center gap-2 pt-3 border-t border-zo-border mt-3"
          onSubmit={(e) => { e.preventDefault(); if (input.trim()) send(input.trim()); }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 h-10 rounded-xl border border-zo-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={!input.trim() || isPending}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold text-brand-charcoal hover:bg-brand-gold-dark disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </Modal>
  );
}
