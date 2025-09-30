"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, RefreshCw, Share2, Sparkles, MessageCircle, X, Plus, Crown, AlertCircle, CircleStar, Trophy, Medal, DivideCircleIcon } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import AIProcessingIndicator from "@/components/AIProcessingIndicator"
import ExpandableText from "@/components/ExpandableText"
import Loading from "./loading"
import AIAssistantPopup from "@/components/ai_assistant"
import { Checkbox } from "@/components/ui/checkbox"
import {WorkflowProgress} from "@/components/WorkflowProgress"

export interface ProductWithRanking {
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
  const step = useQuery(api.search_history.query.getSearchHistoryStep, { id: searchId })
  const pageData = useQuery(api.search_history.query.getPageData, status === "done" ? { id: searchId } : "skip")

  if (status == "pending") {
    HybridSearchWorkFlow({ searchId })
  }

  const [products, setProducts] = useState<ProductWithRanking[]>([])
  const [allRankedProducts, setAllRankedProducts] = useState<ProductWithRanking[]>([])
  const [selectedProductIds, setSelectedProductIds] = useState<Set<Id<"products">>>(new Set())
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
          if (!pageData) return
          const product = pageData.products.find(
            (p): p is NonNullable<typeof p> => p !== null && p._id === ranking.productId,
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

  const toggleProductSelection = (productId: Id<"products">) => {
    setSelectedProductIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const clearSelection = () => {
    setSelectedProductIds(new Set())
  }

  const productsForAI =
    selectedProductIds.size > 0
      ? allRankedProducts.filter((product) => selectedProductIds.has(product._id))
      : allRankedProducts

  if (status === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full px-4">
            <div className="text-center space-y-6">
              <Loading />
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
                step ? (<WorkflowProgress currentStep={step} />) : (<Loading />)   
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
              {selectedProductIds.size > 0 && (
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Selection ({selectedProductIds.size})
                </Button>
              )}
              
            </div>
          </div>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {(pageData?.comparison && products.length > 0) && (
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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card/30  rounded-lg p-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Product Recommendations</h2>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> 
               <span>Ranked by AI score</span>
              </div>
               
             
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Showing {products.length} of {allRankedProducts.length} products</p>
          </div>

   
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center col-span-full">
              <p>No products found</p>
            </div>
          ) : (
            products.map((product, index) => (
              <div
                key={product._id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-border/80 transition-all duration-200 flex flex-col group relative shadow-sm hover:shadow-md"
              >
                <div className="absolute top-3 left-3 z-20">
                  
                    <Checkbox
                      checked={selectedProductIds.has(product._id)}
                      onCheckedChange={() => toggleProductSelection(product._id)}
                      className="w-4 h-4"
                    />
                 
                </div>

                {product.aiRank === 1 && (
                  <div className="absolute top-3 right-3 bg-gradient-to-l from-primary to-accent-foreground text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 z-10 shadow-lg">
                    <Trophy className="w-3 h-3" />
                    <span className="font-medium">1</span>
                  </div>
                )}



                <div className="relative flex-shrink-0">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  {product.aiRank !== 1 && (
                    <div
                      className="absolute top-3 right-3 bg-chart-2 text-white text-xs px-2 py-1 rounded-full"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Medal className="w-3 h-3" />
                      <span>{product.aiRank}</span>
                      </div>
                      
                    </div>
                  )}

                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                    <ExpandableText text={product.name} maxLength={100} className="font-sans font-semibold text-foreground text-md leading-tight flex-1" />
                      
                      <span className="text-xl font-bold text-primary flex-shrink-0">${product.price}</span>
                    </div>

                  
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
                    <Button variant="outline" size="sm" className="text-sm p-6" asChild>
                      <a href={product.url} target="_blank" rel="noopener noreferrer">
                        View Product
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
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
                  <Loading />
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
          <AIAssistantPopup
            context={productsForAI.map((product) => ({
              _id: product._id,
              _creationTime: product._creationTime,
              name: product.name,
              category: product.category,
              description: product.description,
              price: product.price,
              tags: product.tags,
              aiRank: product.aiRank,
              hybridScore: product.hybridScore,
              reason: product.reason,
            }))}
          />
        )}
      </div>
    </div>
  )
}
