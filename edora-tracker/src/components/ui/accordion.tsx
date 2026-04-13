"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const AccordionContext = React.createContext<{
  value?: string | string[]
  onValueChange?: (value: string) => void
  type: "single" | "multiple"
}>({ type: "single" })

const Accordion = ({
  children,
  className,
  type = "single",
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: any) => {
  const [value, setValue] = React.useState(valueProp || defaultValue)

  const handleValueChange = React.useCallback(
    (itemValue: string) => {
      if (type === "single") {
        const newValue = value === itemValue ? "" : itemValue
        setValue(newValue)
        onValueChange?.(newValue)
      } else {
        const prevValue = Array.isArray(value) ? value : []
        const newValue = prevValue.includes(itemValue)
          ? prevValue.filter((v) => v !== itemValue)
          : [...prevValue, itemValue]
        setValue(newValue)
        onValueChange?.(newValue)
      }
    },
    [type, value, onValueChange]
  )

  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange, type }}>
      <div className={cn("space-y-1", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

const AccordionItem = ({ children, className, value, ...props }: any) => {
  return (
    <div className={cn("border-b", className)} {...props} data-item-value={value}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { value })
        }
        return child
      })}
    </div>
  )
}

const AccordionTrigger = ({ children, className, value, ...props }: any) => {
  const { value: selectedValue, onValueChange, type } = React.useContext(AccordionContext)
  const isOpen = type === "single" 
    ? selectedValue === value 
    : Array.isArray(selectedValue) && selectedValue.includes(value)

  return (
    <button
      type="button"
      onClick={() => onValueChange?.(value)}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  )
}

const AccordionContent = ({ children, className, value, ...props }: any) => {
  const { value: selectedValue, type } = React.useContext(AccordionContext)
  const isOpen = type === "single" 
    ? selectedValue === value 
    : Array.isArray(selectedValue) && selectedValue.includes(value)

  if (!isOpen) return null

  return (
    <div
      className={cn("overflow-hidden text-sm transition-all pb-4 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
