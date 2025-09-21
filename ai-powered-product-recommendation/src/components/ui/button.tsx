import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl":
              variant === "default",
            "bg-gray-800 text-gray-100 hover:bg-gray-700 active:bg-gray-600": variant === "secondary",
            "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900": variant === "outline",
            "hover:bg-gray-100 text-gray-900": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 active:bg-red-800": variant === "destructive",
          },
          {
            "h-9 px-4 py-2": size === "default",
            "h-8 px-3 text-xs": size === "sm",
            "h-11 px-8": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }
