import * as React from "react"

import { cn } from "@/lib/utils"

const ChatInput = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, rows = 1, value, onChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
      }
    }, [value]);

    return (
      <textarea
        ref={textareaRef}
        rows={rows}
        value={value}
        onChange={onChange}
        className={cn(
          "flex w-full resize-none rounded-md border border-stone-200 bg-transparent px-2 py-1 text-xs shadow-sm transition-colors placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:placeholder:text-stone-400 dark:focus-visible:ring-stone-300 break-all pr-8 scrollbar-hide",
          className
        )}
        {...props}
      />
    )
  }
)
ChatInput.displayName = "ChatInput"

export { ChatInput }
