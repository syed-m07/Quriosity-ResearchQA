"use client"

import * as React from "react"
import { Recharts, type RechartsProps } from "recharts"

import { cn } from "@/lib/utils"

const Chart = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { data: any[] }
>(({ data, className, ...props }, ref) => {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)

  return (
    <div ref={ref} className={cn("h-[250px] w-full", className)} {...props}>
      <Recharts
        {...({} as RechartsProps)}
        data={data}
        width={container?.offsetWidth}
        height={container?.offsetHeight}
      />
    </div>
  )
})
Chart.displayName = "Chart"

export { Chart }