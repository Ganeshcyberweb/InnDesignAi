"use client";

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useChatLogic } from '@/hooks/use-chat-logic';
import { ChatMessage } from '@/components/chat-message';
import { ImageIcon, RotateCcw, Loader2 } from 'lucide-react';
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
  PromptInputButton,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import type { AIDesignChatProps } from '@/types/chat';

export default function AIDesignChat({
  className,
  placeholder = "Describe your design ideas...",
  showWelcomeMessage = true,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  onDesignGenerated,
  initialMessages,
  contextData,
  height = "h-full",
}: AIDesignChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isTyping,
    error,
    sendMessage,
    regenerateLastMessage,
    clearChat,
  } = useChatLogic({
    initialMessages: showWelcomeMessage ? undefined : initialMessages,
    contextData,
    onDesignGenerated,
  });

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text?.trim() && (!message.files || message.files.length === 0)) {
      return;
    }

    await sendMessage(message.text || '', message.files);
  };

  const handleRegenerate = async () => {
    if (isLoading) return;
    await regenerateLastMessage();
  };

  const hasMessages = messages.length > (showWelcomeMessage ? 1 : 0);
  const canRegenerate = hasMessages && !isLoading && messages[messages.length - 1]?.isUser === false;

  return (
    <div className={cn("flex flex-col", height, className)}>
      {/* Chat Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} isUser={message.isUser}>
            <div className="space-y-2">
              {/* Message Content */}
              <div className={cn(
                message.isUser
                  ? "text-foreground"
                  : "text-muted-foreground prose prose-sm max-w-none"
              )}>
                {message.isLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>

              {/* Message Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {message.attachments.map((attachment, index) => (
                    <div key={index} className="relative">
                      {attachment.mediaType?.startsWith('image/') && attachment.url ? (
                        <img
                          src={attachment.url}
                          alt={attachment.filename || `Attachment ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-muted rounded-md border flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Error Display */}
              {message.error && (
                <div className="text-destructive text-sm">
                  Error: {message.error}
                </div>
              )}
            </div>
          </ChatMessage>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <ChatMessage isUser={false}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating response...</span>
            </div>
          </ChatMessage>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
            {error}
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/50 backdrop-blur-sm">
        <div className="p-4">
          <PromptInput
            onSubmit={handleSubmit}
            accept="image/*"
            multiple
            maxFiles={maxFiles}
            maxFileSize={maxFileSize}
            className="bg-background border-border shadow-sm"
            onError={(error) => {
              console.error('File upload error:', error);
            }}
          >
            <PromptInputBody>
              {/* File Attachments */}
              <PromptInputAttachments>
                {(attachment) => (
                  <PromptInputAttachment
                    key={attachment.id}
                    data={attachment}
                    className="border-border"
                  />
                )}
              </PromptInputAttachments>

              {/* Main Textarea */}
              <PromptInputTextarea
                placeholder={placeholder}
                className="min-h-[60px] text-base placeholder:text-muted-foreground resize-none"
                disabled={isLoading}
              />

              {/* Toolbar */}
              <PromptInputToolbar>
                <PromptInputTools>
                  {/* Upload Button */}
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger disabled={isLoading}>
                      <ImageIcon className="w-4 h-4" />
                    </PromptInputActionMenuTrigger>
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>

                  {/* Regenerate Button */}
                  {canRegenerate && (
                    <PromptInputButton
                      onClick={handleRegenerate}
                      disabled={isLoading}
                      variant="ghost"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </PromptInputButton>
                  )}
                </PromptInputTools>

                {/* Submit Button */}
                <PromptInputSubmit disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : undefined}
                </PromptInputSubmit>
              </PromptInputToolbar>
            </PromptInputBody>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}