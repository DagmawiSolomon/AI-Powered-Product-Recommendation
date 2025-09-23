import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import Link from "next/link"
import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
  useQuery,
} from "convex/react";

import { api } from "../../convex/_generated/api"

export function Navbar(){
    return(
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <Link href={"/"}>
          <span className="text-xl font-semibold">ick</span>
          </Link>
          
        </div>
        <Unauthenticated>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="lg">
              Github
            </Button>
            <Link href={"/signin"}>
            <Button variant="ghost" size="lg" className="">
              Sign In
            </Button>
            </Link>
            
            <ThemeToggle/>
            
          </div>
        </Unauthenticated>
         <AuthLoading>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="lg">
              Github
            </Button>
            <Link href={"/signin"}>
            <Button variant="ghost" size="lg" className="">
              Sign In
            </Button>
            </Link>
            
            <ThemeToggle/>
            
          </div>
        </AuthLoading>
        <Authenticated>
           <div className="flex items-center space-x-4">
            <Link href={"/signin"}>
            <Button variant="ghost" size="lg" className="">
              Github
            </Button>
            </Link>
            <Button variant="outline" size="lg">
              Logout
            </Button>
            <ThemeToggle/>
            
          </div>
        </Authenticated>          

        
      </nav>
    )
}