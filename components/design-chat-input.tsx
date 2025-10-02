"use client"

import React from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowRight,
  Image,
  Home,
  Ruler,
  Palette,
  DollarSign,
  ChevronDown,
  X
} from "lucide-react"

// Import ui components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Import ai-elements components
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputSubmit,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input"

// Import store and utilities
import { useDesignFormStore } from "@/stores/design-form-store"
import { useClickOutside } from "@/components/smoothui/hooks/use-click-outside"
import { useChatWidth } from "@/hooks/use-chat-width"
import { cn } from "@/lib/utils"
import { COLOR_PALETTES } from "@/constants/color-palettes"
import SiriOrb from "@/components/smoothui/ui/SiriOrb"

const SPEED = 1

interface ChatContext {
  showChat: boolean
  success: boolean
  openChat: () => void
  closeChat: () => void
  alwaysOpen: boolean
}

const ChatContext = React.createContext({} as ChatContext)
const useChat = () => React.useContext(ChatContext)

interface DesignChatInputProps {
  onSubmit?: (message: PromptInputMessage) => void
  className?: string
  alwaysOpen?: boolean
}

export function DesignChatInput({ onSubmit, className, alwaysOpen = false }: DesignChatInputProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const [showChat, setShowChat] = React.useState(alwaysOpen)
  const [success, setSuccess] = React.useState(false)
  const chatWidth = useChatWidth()

  const closeChat = React.useCallback(() => {
    if (!alwaysOpen) {
      setShowChat(false)
      textareaRef.current?.blur()
    }
  }, [alwaysOpen])

  const openChat = React.useCallback(() => {
    setShowChat(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    })
  }, [])

  const onChatSuccess = React.useCallback(() => {
    if (!alwaysOpen) {
      closeChat()
    }
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
    }, 1500)
  }, [closeChat, alwaysOpen])

  useClickOutside(rootRef, alwaysOpen ? () => {} : closeChat)

  // Auto-open and focus when alwaysOpen is true
  React.useEffect(() => {
    if (alwaysOpen && !showChat) {
      setShowChat(true)
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [alwaysOpen, showChat])

  const context = React.useMemo(
    () => ({
      showChat,
      success,
      openChat,
      closeChat,
      alwaysOpen,
    }),
    [showChat, success, openChat, closeChat, alwaysOpen]
  )

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        className
      )}
      style={{
        width: chatWidth,
        height: CHAT_HEIGHT,
      }}
    >
      <motion.div
        data-chat
        ref={rootRef}
        className={cn(
          "bg-white relative bottom-8 z-30 flex flex-col items-center overflow-hidden border border-stone-200 max-sm:bottom-5"
        )}
        initial={false}
        animate={{
          width: showChat ? chatWidth : "auto",
          height: showChat ? CHAT_HEIGHT : 44,
          borderRadius: showChat ? 14 : 20,
        }}
        transition={{
          type: "spring",
          stiffness: 550 / SPEED,
          damping: 45,
          mass: 0.7,
          delay: showChat ? 0 : 0.08,
        }}
      >
        <ChatContext.Provider value={context}>
          {!alwaysOpen && <CompactDock />}
          <ExpandedChat ref={textareaRef} onSuccess={onChatSuccess} onSubmit={onSubmit} chatWidth={chatWidth} />
        </ChatContext.Provider>
      </motion.div>
    </div>
  )
}

function CompactDock() {
  const { showChat, openChat } = useChat()
  return (
    <footer className="mt-auto flex h-[44px] items-center justify-center whitespace-nowrap select-none">
      <div className="flex items-center justify-center gap-2 px-3 max-sm:h-10 max-sm:px-2">
        <div className="flex w-fit items-center gap-2">
          <AnimatePresence mode="wait">
            {showChat ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                className="h-5 w-5"
              />
            ) : (
              <motion.div
                key="siri-orb"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SiriOrb
                  size="24px"
                  colors={{
                    bg: "oklch(64.7% 0.196 254.1)", // pink color for white theme
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          type="button"
          className="flex h-fit flex-1 justify-end rounded-full px-2 !py-0.5 bg-transparent hover:bg-stone-50 text-stone-700 hover:text-stone-900"
          variant="ghost"
          onClick={openChat}
        >
          <span className="truncate">Start Designing</span>
        </Button>
      </div>
    </footer>
  )
}

const CHAT_HEIGHT = 200

interface ExpandedChatProps {
  ref: React.Ref<HTMLTextAreaElement>
  onSuccess: () => void
  onSubmit?: (message: PromptInputMessage) => void
  chatWidth: number
}

function ExpandedChat({
  ref,
  onSuccess,
  onSubmit,
  chatWidth,
}: ExpandedChatProps) {
  const { closeChat, showChat, alwaysOpen } = useChat()
  const { formData, updateField } = useDesignFormStore()
  const [isColorPaletteOpen, setIsColorPaletteOpen] = React.useState(false)
  const colorPaletteRef = React.useRef<HTMLDivElement>(null)

  // Close color palette dropdown when clicking outside or when other interactions happen
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPaletteRef.current && !colorPaletteRef.current.contains(event.target as Node)) {
        setIsColorPaletteOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsColorPaletteOpen(false)
      }
    }

    if (isColorPaletteOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isColorPaletteOpen])

  const selectedPalette = COLOR_PALETTES.find(palette => palette.id === formData.colorPalette) || COLOR_PALETTES[0]

  const handleSubmit = (message: PromptInputMessage) => {
    // Update the prompt in the form data
    updateField("prompt", message.text || "")

    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit(message)
    }

    // Clear the prompt after submission and trigger success
    setTimeout(() => {
      updateField("prompt", "")
      onSuccess()
    }, 100)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      closeChat()
    }
  }

  return (
    <div
      className="absolute bottom-0"
      style={{
        width: chatWidth,
        height: CHAT_HEIGHT,
        pointerEvents: showChat ? "all" : "none",
      }}
    >
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 550 / SPEED,
              damping: 45,
              mass: 0.7,
            }}
            className="flex h-full flex-col p-1"
          >
            <PromptInput
              className="bg-white border-stone-200  divide-stone-200 h-full"
              onSubmit={handleSubmit}
              accept="image/*"
              multiple
              maxFiles={5}
              maxFileSize={10 * 1024 * 1024} // 10MB
            >
              <PromptInputBody className="space-y-0 h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center py-2 px-3">
                  <div className="flex items-center gap-2">
                    <SiriOrb
                      size="20px"
                      colors={{
                        bg: "oklch(64.7% 0.196 254.1)",
                      }}
                    />
                    <p className="text-stone-900 text-sm font-medium">Design Chat</p>
                  </div>
                  {!alwaysOpen && (
                    <Button
                      type="button"
                      onClick={closeChat}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-stone-100 text-stone-500 hover:text-stone-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* File Attachments */}
                <PromptInputAttachments>
                  {(attachment) => (
                    <PromptInputAttachment
                      key={attachment.id}
                      data={attachment}
                      className=""
                    />
                  )}
                </PromptInputAttachments>

                {/* Main Textarea */}
                <div className="flex-1 p-3 min-h-0">
                  <PromptInputTextarea
                    ref={ref}
                    placeholder="Describe your design vision..."
                    value={formData.prompt}
                    onChange={(e) => updateField("prompt", e.target.value)}
                    onFocus={() => setIsColorPaletteOpen(false)}
                    className={cn(
                      "text-stone-900 placeholder:text-stone-500 bg-transparent",
                      "text-sm border-none shadow-none",
                      "focus-visible:ring-0 focus-visible:ring-offset-0",
                      "resize-none w-full h-full max-h-[80px]"
                    )}
                    onKeyDown={onKeyDown}
                  />
                </div>

                {/* Design Form Toolbar */}
                <PromptInputToolbar className="p-3 pt-2">
                  <PromptInputTools className="flex-wrap gap-2 mb-3">
                    {/* File Upload Button */}
                    <PromptInputActionMenu>
                      <PromptInputActionMenuTrigger
                        className={cn(
                          "h-8 px-3 text-xs rounded-md",
                          "bg-white border-stone-200 text-stone-700",
                          "hover:bg-stone-50 hover:text-stone-900",
                          "transition-colors"
                        )}
                      >
                        <Image className="w-4 h-4" />
                      </PromptInputActionMenuTrigger>
                      <PromptInputActionMenuContent className="bg-white border-stone-200">
                        <PromptInputActionAddAttachments className="text-stone-700 hover:bg-stone-50 hover:text-stone-900" />
                      </PromptInputActionMenuContent>
                    </PromptInputActionMenu>
                    <Select
                      value={formData.roomType}
                      onValueChange={(value) => updateField("roomType", value)}
                      onOpenChange={(open) => open && setIsColorPaletteOpen(false)}
                    >
                      <SelectTrigger className={cn(
                        "flex items-center gap-2 h-8 w-auto px-3 text-xs",
                        "rounded-md bg-white border-stone-200",
                        "hover:bg-stone-50 transition-colors",
                        "focus:ring-2 focus:ring-pink-500 text-stone-900"
                      )}>
                        <Home className="w-4 h-4 text-stone-500" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-stone-200">
                        <SelectItem value="living_room">Living</SelectItem>
                        <SelectItem value="bedroom">Bedroom</SelectItem>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="bathroom">Bath</SelectItem>
                        <SelectItem value="dining_room">Dining</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Style Preference Select */}
                    <Select
                      value={formData.stylePreference}
                      onValueChange={(value) => updateField("stylePreference", value)}
                      onOpenChange={(open) => open && setIsColorPaletteOpen(false)}
                    >
                      <SelectTrigger className={cn(
                        "flex items-center gap-2 h-8 w-auto px-3 text-xs",
                        "rounded-md bg-white border-stone-200",
                        "hover:bg-stone-50 transition-colors",
                        "focus:ring-2 focus:ring-pink-500 text-stone-900"
                      )}>
                        <Palette className="w-4 h-4 text-stone-500" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-stone-200">
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="scandinavian">Scandinavian</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="bohemian">Bohemian</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Budget Range Select */}
                    <Select
                      value={formData.budgetRange}
                      onValueChange={(value) => updateField("budgetRange", value)}
                      onOpenChange={(open) => open && setIsColorPaletteOpen(false)}
                    >
                      <SelectTrigger className={cn(
                        "flex items-center gap-2 h-8 w-auto px-3 text-xs",
                        "rounded-md bg-white border-stone-200",
                        "hover:bg-stone-50 transition-colors",
                        "focus:ring-2 focus:ring-pink-500 text-stone-900"
                      )}>
                        <DollarSign className="w-4 h-4 text-stone-500" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-stone-200">
                        <SelectItem value="$500 - $1,000">$500-1K</SelectItem>
                        <SelectItem value="$1,000 - $5,000">$1K-5K</SelectItem>
                        <SelectItem value="$5,000 - $15,000">$5K-15K</SelectItem>
                        <SelectItem value="$15,000 - $30,000">$15K-30K</SelectItem>
                        <SelectItem value="$30,000+">$30K+</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Color Palette Selector */}
                    <div className="relative" ref={colorPaletteRef}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsColorPaletteOpen(!isColorPaletteOpen)
                        }}
                        className={cn(
                          "flex items-center gap-2 h-8 px-3 text-xs",
                          "rounded-md bg-white border border-stone-200",
                          "hover:bg-stone-50 transition-colors",
                          "focus:ring-2 focus:ring-pink-500 text-stone-900"
                        )}
                      >
                        <div className="flex gap-1">
                          {selectedPalette.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full border border-stone-200"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <ChevronDown className={cn(
                          "w-3 h-3 text-stone-500 transition-transform",
                          isColorPaletteOpen && "rotate-180"
                        )} />
                      </button>

                      {isColorPaletteOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-stone-200 rounded-md shadow-lg z-[100] min-w-[200px]">
                          <div className="p-2">
                            <div className="text-xs text-stone-500 mb-2 px-2">Color Palette</div>
                            {COLOR_PALETTES.map((palette) => (
                              <button
                                key={palette.id}
                                onClick={() => {
                                  updateField("colorPalette", palette.id);
                                  setIsColorPaletteOpen(false);
                                }}
                                className={cn(
                                  "w-full flex items-center gap-3 p-2 rounded-md text-xs hover:bg-stone-50 transition-colors",
                                  formData.colorPalette === palette.id && "bg-stone-50"
                                )}
                              >
                                <div className="flex gap-1">
                                  {palette.colors.map((color, index) => (
                                    <div
                                      key={index}
                                      className="w-4 h-4 rounded-full border border-stone-200"
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                                <span className="text-stone-900">{palette.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Room Size Input */}
                    <div className={cn(
                      "flex items-center gap-2 h-8 px-3 text-xs",
                      "rounded-md bg-white border border-stone-200",
                      "hover:bg-stone-50 transition-colors"
                    )}>
                      <Ruler className="w-4 h-4 text-stone-500" />
                      <Input
                        type="number"
                        placeholder="Room size"
                        value={formData.roomSize}
                        onChange={(e) => updateField("roomSize", e.target.value)}
                        onFocus={() => setIsColorPaletteOpen(false)}
                        className="h-6 w-16 text-xs border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-center text-stone-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-xs text-stone-500">sq ft</span>
                    </div>
                  </PromptInputTools>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <PromptInputSubmit
                      className={cn(
                        "h-8 w-8 rounded-md",
                        "bg-pink-600 border-pink-600 hover:bg-pink-700",
                        "transition-colors",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      disabled={!formData.prompt.trim()}
                    >
                      <ArrowRight className="w-4 h-4 text-white" />
                    </PromptInputSubmit>
                  </div>
                </PromptInputToolbar>
              </PromptInputBody>
            </PromptInput>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Add default export for lazy loading
export default DesignChatInput