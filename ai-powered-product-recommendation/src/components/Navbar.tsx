import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import Link from "next/link"

export function Navbar(){
    return(
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <Link href={"/"}>
          <span className="text-xl font-semibold">ProductFinder</span>
          </Link>
          
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="lg" className="">
            Sign In
          </Button>
          <Button variant="outline" size="lg">
            Get Started
          </Button>
          <ThemeToggle/>
          
        </div>
      </nav>
    )
}