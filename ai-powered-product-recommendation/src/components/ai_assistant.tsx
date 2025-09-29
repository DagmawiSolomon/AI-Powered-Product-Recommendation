"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Send, MessageCircle, X } from "lucide-react"
import { Id } from "../../convex/_generated/dataModel"
import { api } from "../../convex/_generated/api"
import { useAction } from "convex/react"

export type ProductContext = {
  _id: Id<"products">
  _creationTime: number
  name: string
  category: string
  price: number
  description: string
  tags: string[]
  aiRank: number
  hybridScore: number
  reason: string
}

export type ChatMessage = {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export type AIAssistantPopupProps = {
  context: ProductContext[]
}

export default function AIAssistantPopup({ context }: AIAssistantPopupProps) {
  const getAIResponse = useAction(api.search_history.action.getAIResponseAction);
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi! I'm here to help you understand these product recommendations. Ask me anything about the products, comparisons, or different options!",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    const contextArray = context.map((product) => ({
    product_id: product._id,
    name: product.name,
    price: product.price,
    description: product.description,
    tags: product.tags,
    aiRank: product.aiRank.toString(),
    reasoning: product.reason,
  }))

    try {
        const response = await getAIResponse({
      query: chatInput,
      context: contextArray
    })

      if (response) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: response,
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, aiMessage])
      }
    } catch (err) {
      console.error("Error fetching AI response:", err)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: "ai",
        content: "Oops! Something went wrong. Please try again.",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!showChat ? (
        <Button
          onClick={() => setShowChat(true)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-2xl w-96 max-w-[calc(100vw-3rem)] overflow-hidden">
          {/* Header */}
          <div className="bg-primary/5 border-b border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Ask me about these products</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about these products..."
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              />
              <Button size="sm" onClick={handleSendMessage} disabled={!chatInput.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
                        <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setChatInput("Compare the selected products")}
                className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-1 rounded-full transition-colors"
              >
                Compare
              </button>
              <button
                onClick={() => setChatInput("Which has the best value?")}
                className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-1 rounded-full transition-colors"
              >
                Best value
              </button>
              <button
                onClick={() => setChatInput("Show me alternatives")}
                className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-1 rounded-full transition-colors"
              >
                Alternatives
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
