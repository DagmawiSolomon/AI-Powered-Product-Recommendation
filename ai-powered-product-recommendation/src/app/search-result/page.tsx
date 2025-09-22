"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Share2, BookOpen, Sparkles, ChevronDown, Send, MessageCircle, X } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"


interface AIProductCard {
  id: string
  name: string
  price: string
  image: string
  description: string
  aiExplanation: string
  category: string
  rating: number
  inStock: boolean
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

const mockProducts: AIProductCard[] = [
  {
    id: "1",
    name: "Sony WH-1000XM5 Headphones",
    price: "$399.99",
    image: "/sony-wh-1000xm5.png",
    description: "Industry-leading noise canceling with exceptional sound quality and 30-hour battery life.",
    aiExplanation:
      "Perfect for your commute needs with superior noise cancellation and long battery life. The adaptive sound control automatically adjusts to your environment.",
    category: "Audio",
    rating: 4.8,
    inStock: true,
  },
  {
    id: "2",
    name: "Apple AirPods Pro (2nd Gen)",
    price: "$249.99",
    image: "/images/products/airpods-pro.png",
    description: "Advanced Active Noise Cancellation with Adaptive Transparency and spatial audio.",
    aiExplanation:
      "Ideal for seamless Apple ecosystem integration. The H2 chip delivers improved noise cancellation and better battery efficiency for daily use.",
    category: "Audio",
    rating: 4.7,
    inStock: true,
  },
  {
    id: "3",
    name: "Bose QuietComfort 45",
    price: "$329.99",
    image: "/bose-quietcomfort-45-headphones.jpg",
    description: "Legendary noise cancellation with premium comfort for all-day listening.",
    aiExplanation:
      "Best choice for comfort during long listening sessions. Bose's renowned noise cancellation technology makes it perfect for focus work and travel.",
    category: "Audio",
    rating: 4.6,
    inStock: false,
  },
]

export default function SearchResultsPage() {
  const [products, setProducts] = useState(mockProducts)
  const [isRefining, setIsRefining] = useState(false)
  const [showRefinement, setShowRefinement] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi! I'm here to help you understand these product recommendations. Feel free to ask me anything about the products, comparisons, or if you need different options!",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || "noise cancelling headphones for commuting"

  const handleSwapProduct = (productId: string) => {
    // Simulate swapping with alternative product
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              name: "Alternative " + product.name,
              price: "$" + (Number.parseInt(product.price.slice(1)) - 50) + ".99",
            }
          : product,
      ),
    )
  }

  const handleRefineResults = () => {
    setIsRefining(true)
    // Simulate AI refinement
    setTimeout(() => {
      setIsRefining(false)
      setShowRefinement(false)
    }, 2000)
  }

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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(chatInput),
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("compare") || lowerInput.includes("difference")) {
      return "Great question! The Sony WH-1000XM5 has the best noise cancellation and 30-hour battery, while AirPods Pro excel in portability and Apple integration. The Bose QuietComfort 45 offers superior comfort for long sessions. Which aspect matters most to you?"
    } else if (lowerInput.includes("budget") || lowerInput.includes("cheap") || lowerInput.includes("price")) {
      return "For budget-conscious buyers, I'd recommend the AirPods Pro at $249.99 as the best value. However, if you can stretch to $329.99, the Bose offers excellent comfort. Would you like me to find more budget-friendly alternatives?"
    } else if (lowerInput.includes("battery") || lowerInput.includes("life")) {
      return "The Sony WH-1000XM5 leads with 30 hours of battery life, followed by Bose at 24 hours, and AirPods Pro at 6 hours (30 with case). For long commutes, Sony is your best bet!"
    } else if (lowerInput.includes("comfort") || lowerInput.includes("wear")) {
      return "The Bose QuietComfort 45 is renowned for all-day comfort with plush ear cushions. Sony WH-1000XM5 is also very comfortable, while AirPods Pro are great for active use but may not suit everyone's ears for extended periods."
    } else {
      return "That's an interesting question! Based on your search for commuting headphones, all three options excel in different ways. The Sony offers the best overall package, AirPods Pro are perfect for Apple users, and Bose prioritizes comfort. What specific aspect would you like me to elaborate on?"
    }
  }

  return (
    <div className="min-h-screen bg-background tech-background">
      <Navbar />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Search
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-foreground">AI Product Recommendations</h1>
                <p className="text-sm text-muted-foreground">Based on your search: "{query}"</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowRefinement(!showRefinement)}>
                <Sparkles className="w-4 h-4 mr-2" />
                Refine Results
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showRefinement ? "rotate-180" : ""}`} />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Refinement Panel */}
        {showRefinement && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
              Refine Your Search
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Budget Range</label>
                <select className="w-full p-2 bg-background border border-border rounded-lg text-sm">
                  <option>$200 - $400</option>
                  <option>$100 - $300</option>
                  <option>$300 - $500</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Primary Use</label>
                <select className="w-full p-2 bg-background border border-border rounded-lg text-sm">
                  <option>Commuting</option>
                  <option>Work from Home</option>
                  <option>Travel</option>
                  <option>Gaming</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Brand Preference</label>
                <select className="w-full p-2 bg-background border border-border rounded-lg text-sm">
                  <option>No preference</option>
                  <option>Sony</option>
                  <option>Apple</option>
                  <option>Bose</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleRefineResults} disabled={isRefining}>
                {isRefining ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Refining...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Apply Refinements
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* AI Summary */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Why these products?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Based on your search for noise-cancelling headphones for commuting, I've selected these three options
                that excel in different areas. The Sony WH-1000XM5 offers the best overall noise cancellation and
                battery life, perfect for long commutes. The AirPods Pro provide seamless integration if you're in the
                Apple ecosystem with excellent portability. The Bose QuietComfort 45 delivers superior comfort for
                extended wear with reliable performance.
              </p>
            </div>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card border border-border rounded-xl overflow-hidden glow-effect hover:border-border/80 transition-all duration-200 flex flex-col"
            >
              {/* Product Image */}
              <div className="relative flex-shrink-0">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {!product.inStock && (
                  <div className="absolute top-3 right-3 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full">
                    Out of Stock
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground text-lg leading-tight flex-1">{product.name}</h3>
                    <span className="text-lg font-bold text-primary flex-shrink-0">{product.price}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </div>
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">({product.rating})</span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                </div>

                {/* AI Explanation */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">AI Recommendation</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{product.aiExplanation}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto">
                  <Button variant="outline" size="sm" onClick={() => handleSwapProduct(product.id)} className="text-xs">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Swap
                  </Button>
                  <Button size="sm" className="text-xs" disabled={!product.inStock}>
                    {product.inStock ? "View Product" : "Notify When Available"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Love these recommendations?</h3>
            <p className="text-muted-foreground">
              Turn this curated list into a comprehensive buying guide to help others make informed decisions.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Publish as Guide
          </Button>
        </div>
      </div>

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
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                  onClick={() => setChatInput("Compare all three products")}
                  className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-1 rounded-full transition-colors"
                >
                  Compare all
                </button>
                <button
                  onClick={() => setChatInput("Which has the best battery life?")}
                  className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-1 rounded-full transition-colors"
                >
                  Battery life
                </button>
                <button
                  onClick={() => setChatInput("Show me cheaper alternatives")}
                  className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-1 rounded-full transition-colors"
                >
                  Cheaper options
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
