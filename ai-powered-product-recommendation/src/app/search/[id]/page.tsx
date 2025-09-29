"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, RefreshCw, Share2, Sparkles, Send, MessageCircle, X, Plus, Crown, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import AIProcessingIndicator from "@/components/AIProcessingIndicator"
import ExpandableText from "@/components/ExpandableText"


interface ProductWithRanking {
  _id: Id<"products">
  _creationTime: number
  name: string
  category: string
  price: number
  image: string
  url: string
  description: string
  tags: string[]
  // Ranking data
  aiRank: number
  hybridScore: number
  reason: string
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export default function SearchResultsPage() {
  const params = useParams()
  const searchId = params.id as string
    const HybridSearchWorkFlow = useMutation(api.products.mutations.startHybirdSearchWorkflow)

  const status = useQuery(api.search_history.query.checkStatus, { id: searchId })
  const pageData = useQuery(
  api.search_history.query.getPageData,
  status === "done" ? { id: searchId } : "skip"
);
  
  if (status == "pending"){
    HybridSearchWorkFlow({ searchId })
  }
 
  const [products, setProducts] = useState<ProductWithRanking[]>([])
  const [allRankedProducts, setAllRankedProducts] = useState<ProductWithRanking[]>([])
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
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [displayCount, setDisplayCount] = useState(3)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRefining, setIsRefining] = useState(false)

  useEffect(() => {
    if (pageData && status === "done") {
      const rankedProducts: ProductWithRanking[] = pageData.rankings
        .map((ranking) => {
          if(!pageData) return
          const product = pageData.products.find(
              (p): p is NonNullable<typeof p> => p !== null && p._id === ranking.productId
            )
          if (!product) return null

          return {
            ...product,
            aiRank: ranking.aiRank,
            hybridScore: ranking.hybridScore,
            reason: ranking.reason,
          }
        })
        .filter(Boolean) as ProductWithRanking[]

      const sortedProducts = rankedProducts.sort((a, b) => a.aiRank - b.aiRank)

      setAllRankedProducts(sortedProducts)
      setProducts(sortedProducts.slice(0, displayCount))
    }
  }, [pageData, status, displayCount])

  if (status === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full px-4">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">Loading...</h2>
                <p className="text-muted-foreground">Please wait while we fetch your results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              There was an error processing your search. Please try again or contact support if the problem persists.
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (status === "pending" || status === "processing") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full px-4">
            {status === "processing" ? (
              <AIProcessingIndicator status="Running" />
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">Preparing your search...</h2>
                  <p className="text-muted-foreground">This will just take a moment</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const handleRefineResults = () => {
    setIsRefining(true)

    setTimeout(() => {
      let filtered = allRankedProducts

      if (minPrice || maxPrice) {
        filtered = filtered.filter((product) => {
          const price = product.price
          const min = minPrice ? Number.parseInt(minPrice) : 0
          const max = maxPrice ? Number.parseInt(maxPrice) : Number.POSITIVE_INFINITY
          return price >= min && price <= max
        })
      }

      const limitedProducts = filtered.slice(0, displayCount)
      setProducts(limitedProducts.length > 0 ? limitedProducts : allRankedProducts.slice(0, displayCount))
      setIsRefining(false)
    }, 1000)
  }

  const handleShowMoreProducts = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      const currentIds = products.map((p) => p._id)
      const remainingProducts = allRankedProducts.filter((p) => !currentIds.includes(p._id))

      const newProducts = remainingProducts.slice(0, 3)
      setProducts((prev) => [...prev, ...newProducts])
      setIsLoadingMore(false)
    }, 1000)
  }

  const handleDisplayCountChange = (count: number) => {
    setDisplayCount(count)
    let filtered = allRankedProducts

    if (minPrice || maxPrice) {
      filtered = filtered.filter((product) => {
        const price = product.price
        const min = minPrice ? Number.parseInt(minPrice) : 0
        const max = maxPrice ? Number.parseInt(maxPrice) : Number.POSITIVE_INFINITY
        return price >= min && price <= max
      })
    }

    const limitedProducts = filtered.slice(0, count)
    setProducts(limitedProducts.length > 0 ? limitedProducts : allRankedProducts.slice(0, count))
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
      return "Great question! I can help you compare these products based on their AI scores and features. Each product has been ranked based on how well it matches your specific search criteria."
    } else if (lowerInput.includes("budget") || lowerInput.includes("cheap") || lowerInput.includes("price")) {
      return "I can help you find products within your budget range. Use the price filter above to narrow down options, or let me know your specific budget and I'll recommend the best value options."
    } else {
      return "That's an interesting question! I'm here to help you understand these AI-ranked recommendations. Each product has been scored based on how well it matches your search criteria. What specific aspect would you like me to elaborate on?"
    }
  }

  const itemsPerPageOptions = [
    { value: 3, label: "3 items per page" },
    { value: 6, label: "6 items per page" },
    { value: 9, label: "9 items per page" },
    { value: 12, label: "12 items per page" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              
              <div>
                <h1 className="text-xl font-semibold text-foreground">AI Product Recommendations</h1>
                <p className="text-sm text-muted-foreground">
                  {`Based on your search: "${pageData?.prompt || "Loading..."}"`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {pageData?.comparison && (
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-semibold text-foreground">AI Product Comparison</h3>
                <ExpandableText
                  text={pageData.comparison.text}
                  maxLength={1000}
                  className="text-muted-foreground"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card/30 border border-border/50 rounded-lg p-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Product Recommendations</h2>
            <p className="text-sm text-muted-foreground">
              Showing {products.length} of {allRankedProducts.length} products • Ranked by AI score
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Price:</span>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-20 px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-colors"
                />
                <span className="text-muted-foreground text-sm">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-20 px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-colors"
                />
                <Button
                  onClick={handleRefineResults}
                  disabled={isRefining}
                  size="sm"
                  variant="outline"
                  className="px-3 py-1 h-8 text-xs bg-transparent"
                >
                  {isRefining ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Apply"}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Items per page:</span>
              <select
                value={displayCount}
                onChange={(e) => handleDisplayCountChange(Number(e.target.value))}
                className="px-3 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 min-w-[120px] transition-colors"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product._id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-border/80 transition-all duration-200 flex flex-col group relative shadow-sm hover:shadow-md"
            >
              {product.aiRank === 1 && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 z-10 shadow-lg">
                  <Crown className="w-3 h-3" />
                  <span className="font-medium">#1 Recommendation</span>
                </div>
              )}

              <div
                className={`absolute top-3 ${product.aiRank === 1 ? "right-3" : "left-3"} bg-primary/90 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1`}
              >
                <Sparkles className="w-3 h-3" />
                <span className="font-medium">{Math.round(product.hybridScore * 100)}% match</span>
              </div>

              <div className="relative flex-shrink-0">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />
                <div
                  className={`absolute top-3 ${product.aiRank === 1 ? "left-3" : "right-3"} bg-secondary/90 text-secondary-foreground text-xs px-2 py-1 rounded-full`}
                >
                  #{product.aiRank}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-foreground text-lg leading-tight flex-1">{product.name}</h3>
                    <span className="text-xl font-bold text-primary flex-shrink-0">${product.price}</span>
                  </div>

                  <ExpandableText
                    text={product.description}
                    maxLength={100}
                    className="text-muted-foreground text-sm"
                  />
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-1">AI Analysis</p>
          {product.reason}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-border/50 mt-auto">
                  <Button size="sm" className="text-xs px-6" asChild>
                    <a href={product.url} target="_blank" rel="noopener noreferrer">
                      View Product
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length < allRankedProducts.length && (
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleShowMoreProducts}
              disabled={isLoadingMore}
              variant="outline"
              size="lg"
              className="px-8 bg-transparent"
            >
              {isLoadingMore ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Loading More...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Show More Products
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Existing chat component code */}
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
                  onClick={() => setChatInput("Compare all products")}
                  className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-1 rounded-full transition-colors"
                >
                  Compare all
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
    </div>
  )
}
