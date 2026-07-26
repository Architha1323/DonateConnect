import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
