"use client"

import { Navbar } from "@/components/Navbar"
import ProductForm from "@/components/ProductForm"


export default function History() {


  return (
    <div className="min-h-screen bg-background tech-background">
      <Navbar />
      <h1>History</h1>
      <ProductForm/>
    </div>
  )
}
