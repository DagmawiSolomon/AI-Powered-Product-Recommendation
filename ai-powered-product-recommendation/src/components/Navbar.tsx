"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import Link from "next/link"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import SignInDialog from "@/components/SignInDialog"
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { signOut } from "@/lib/auth-client"
import { useState } from "react"
import { GitHubStarsButton } from "./ui/shadcn-io/github-stars-button"

function ModernLogo() {
  return (
    <div className="flex items-center space-x-3 group">
      <Link href="/" className="flex items-center group">
      <div className="text-xl font-bold text-foreground transition-all duration-300 group-hover:text-primary tracking-[0.5em] uppercase">
        PICK
      </div>
    </Link>
    </div>
  )
}

export function Navbar() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)

  return (
    <nav className="w-screen bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <ModernLogo />

          <Unauthenticated>
            <div className="flex items-center space-x-5">

              <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className=""
                  >
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogTitle className="hidden">Social Signup</DialogTitle>
                  <SignInDialog />
                </DialogContent>
              </Dialog>
              <ThemeToggle />
            </div>
          </Unauthenticated>

          <AuthLoading>
            <div className="flex items-center space-x-5">

              <Button variant="ghost" size="lg" disabled className="font-medium opacity-50">
                Sign In
              </Button>
              <ThemeToggle />
            </div>
          </AuthLoading>

          <Authenticated>
            <div className="flex items-center space-x-5">
              <Button
                variant="outline"
                size="lg"
                
                onClick={async () => {
                  await signOut()
                }}
              >
                Logout
              </Button>
              <ThemeToggle />
            </div>
          </Authenticated>
        </div>
      </div>
    </nav>
  )
}
