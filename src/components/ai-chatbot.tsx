"use client";
import { useRef, useState } from "react";
import { Send, MessageSquare, XCircle } from "lucide-react";

const SUGGESTED_QA = [
  { q: "How do I start an assignment?", a: "Break the assignment into smaller steps and start with what you know." },
  { q: "How can I prepare for a quiz?", a: "Review your notes, practice sample questions, and get enough rest before the quiz." },
  { q: "What if my code isn't working?", a: "Check for typos, review the requirements, and test with sample inputs." },
  { q: "How do I join a team?", a: "Go to KindCollab and send a request to join a team or create your own." },
  { q: "Where can I see deadlines?", a: "All task deadlines are listed in the KindTasks page." },
  { q: "How do I get feedback?", a: "Submit your work on KindCampus to get instant feedback and hints." },
];

function getDemoAnswer(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("assignment") || q.includes("task")) return "Assignments help you practice and learn. Try to break the problem into smaller steps!";
  if (q.includes("quiz")) return "Quizzes test your understanding. Review your notes and try your best!";
  if (q.includes("code") || q.includes("coding")) return "For coding tasks, make sure to read the requirements and test your code with sample inputs.";
  if (q.includes("team") || q.includes("collab")) return "Teamwork is key! Communicate clearly and share responsibilities.";
  if (q.includes("deadline")) return "Check the due date in your task list. Don't wait until the last minute!";
  if (q.includes("ai") || q.includes("gemini")) return "I'm powered by AI to help you with your campus questions!";
  if (q.includes("feedback")) return "You get instant feedback after submitting your work on KindCampus.";
  return "I'm here to help with assignments, quizzes, coding, and campus life!";
}

async function fetchGeminiChat(message: string): Promise<{text: string, isDemo: boolean}> {
  try {
    const res = await fetch("/api/gemini-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    if (data.text) return { text: data.text, isDemo: false };
    return { text: getDemoAnswer(message), isDemo: true };
  } catch {
    return { text: getDemoAnswer(message), isDemo: true };
  }
}

export function AIChatbot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: "user"|"ai", text: string, isDemo?: boolean}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Helper to send a message (used for both input and suggestion click)
  const sendChatMessage = async (userMsg: string, isSuggestion?: boolean) => {
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setChatLoading(true);
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 50);
    // If this is a suggestion and matches SUGGESTED_QA, answer instantly
    if (isSuggestion) {
      const found = SUGGESTED_QA.find(qa => qa.q === userMsg);
      if (found) {
        setTimeout(() => {
          setChatMessages((prev) => [...prev, { role: "ai", text: found.a, isDemo: true }]);
          setChatLoading(false);
          setTimeout(() => {
            if (chatBoxRef.current) {
              chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            }
          }, 50);
        }, 400); // slight delay for realism
        return;
      }
    }
    // Otherwise, call the API
    try {
      const { text: aiResp, isDemo } = await fetchGeminiChat(userMsg);
      setChatMessages((prev) => [...prev, { role: "ai", text: aiResp, isDemo }]);
      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 50);
    } catch {
      setChatMessages((prev) => [...prev, { role: "ai", text: getDemoAnswer(userMsg), isDemo: true }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    await sendChatMessage(chatInput.trim(), false);
  };

  // Show suggestions if chat is empty or last AI message was a demo answer
  const showSuggestions =
    chatMessages.length === 0 ||
    (chatMessages.length > 0 && chatMessages[chatMessages.length-1].role === "ai" && chatMessages[chatMessages.length-1].isDemo);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat box */}
      <div
        className={`transition-all duration-300 ${chatOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'} w-80 max-w-[90vw] mb-2`}
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}
      >
        <div className="bg-background rounded-xl border flex flex-col h-80">
          <div className="flex items-center justify-between px-4 py-2 border-b text-xs font-semibold text-primary bg-muted rounded-t-xl">
            AI Chatbot
            <button
              className="text-muted-foreground hover:text-primary transition p-1"
              onClick={() => setChatOpen(false)}
              aria-label="Minimize chat"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          <div ref={chatBoxRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm">
            {chatMessages.length === 0 && (
              <div className="text-muted-foreground text-xs text-center mt-8">Ask me anything about assignments, quizzes, coding, or campus life!</div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                <span className={msg.role === "user" ? "inline-block bg-primary text-primary-foreground rounded-lg px-2 py-1" : "inline-block bg-muted text-foreground rounded-lg px-2 py-1"}>
                  {msg.text}
                </span>
              </div>
            ))}
            {chatLoading && (
              <div className="text-left text-muted-foreground animate-pulse">AI is typing...</div>
            )}
            {/* SUGGESTIONS: show as clickable buttons */}
            {showSuggestions && !chatLoading && (
              <div className="px-1 pb-2 pt-1">
                <div className="text-xs text-muted-foreground mb-1">Try asking:</div>
                <ul className="flex flex-wrap gap-1">
                  {SUGGESTED_QA.map((qa, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        className="text-xs bg-muted hover:bg-primary/10 border border-muted-foreground/10 rounded px-2 py-1 transition focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{ whiteSpace: 'nowrap' }}
                        onClick={() => sendChatMessage(qa.q, true)}
                        disabled={chatLoading}
                        aria-label={`Ask: ${qa.q}`}
                      >
                        {qa.q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <form
            className="flex items-center border-t px-2 py-1 gap-2"
            onSubmit={e => { e.preventDefault(); handleSendChat(); }}
          >
            <input
              className="flex-1 bg-transparent outline-none text-sm px-2 py-1"
              type="text"
              placeholder="Ask anything"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              disabled={chatLoading}
            />
            <button
              type="submit"
              className="p-1 rounded-full hover:bg-primary/10 transition"
              disabled={chatLoading || !chatInput.trim()}
              aria-label="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-[10px] text-muted-foreground text-center pb-1 pt-0.5">AI can make mistakes. Please double-check responses.</div>
        </div>
      </div>
      {/* Floating chat button */}
      {!chatOpen && (
        <button
          className="bg-primary text-primary-foreground rounded-full shadow-lg w-12 h-12 flex items-center justify-center hover:scale-105 transition"
          aria-label="Open AI Chatbot"
          onClick={() => setChatOpen(true)}
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
} 