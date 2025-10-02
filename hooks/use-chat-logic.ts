"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import type { FileUIPart } from 'ai';
import type {
  ChatMessage,
  ChatState,
  ChatAPI,
  DesignFormData,
  APIMessage
} from '@/types/chat';
import { useDesignFormStore } from '@/stores';

interface UseChatLogicProps {
  initialMessages?: ChatMessage[];
  contextData?: Partial<DesignFormData>;
  onDesignGenerated?: (design: any) => void;
}

export function useChatLogic({
  initialMessages = [],
  contextData,
  onDesignGenerated,
}: UseChatLogicProps = {}): ChatState & ChatAPI {
  const { formData } = useDesignFormStore();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const welcomeMessage: ChatMessage = {
      id: nanoid(),
      content: "Hello! I'm your AI interior design assistant. I can help you create beautiful spaces, suggest furniture, analyze room layouts, and provide design inspiration. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    };

    return initialMessages.length > 0 ? initialMessages : [welcomeMessage];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string>();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const sendMessage = useCallback(async (content: string, files?: FileUIPart[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessage: ChatMessage = {
      id: nanoid(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
      attachments: files,
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setError(undefined);

    // Create AI response placeholder
    const aiMessageId = nanoid();
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      // Prepare context data
      const context = {
        ...formData,
        ...contextData,
      };

      // Prepare API payload
      const apiMessages: APIMessage[] = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
        attachments: msg.attachments,
      }));

      // Add current user message
      apiMessages.push({
        role: 'user',
        content: content.trim(),
        attachments: files,
        context,
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          context,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedContent = '';

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // Decode the chunk
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;

                // Update the AI message with streaming content
                setMessages(prev => prev.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, content: accumulatedContent, isLoading: false }
                    : msg
                ));
              }

              // Handle design generation results
              if (parsed.design && onDesignGenerated) {
                onDesignGenerated(parsed.design);
              }
            } catch (e) {
              // Ignore parsing errors for partial chunks
            }
          }
        }
      }

      setIsTyping(false);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request was aborted, don't show error
        return;
      }

      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message');

      // Update AI message with error
      setMessages(prev => prev.map(msg =>
        msg.id === aiMessageId
          ? {
              ...msg,
              content: 'Sorry, I encountered an error. Please try again.',
              isLoading: false,
              error: err.message
            }
          : msg
      ));
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  }, [messages, formData, contextData, onDesignGenerated]);

  const regenerateLastMessage = useCallback(async () => {
    if (messages.length < 2) return;

    const lastUserMessage = [...messages].reverse().find(msg => msg.isUser);
    if (!lastUserMessage) return;

    // Remove the last AI response
    setMessages(prev => {
      const lastAIIndex = [...prev].reverse().findIndex(msg => !msg.isUser);
      if (lastAIIndex === -1) return prev;

      const actualIndex = prev.length - 1 - lastAIIndex;
      return prev.slice(0, actualIndex);
    });

    // Resend the last user message
    await sendMessage(lastUserMessage.content, lastUserMessage.attachments);
  }, [messages, sendMessage]);

  const clearChat = useCallback(() => {
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const welcomeMessage: ChatMessage = {
      id: nanoid(),
      content: "Hello! I'm your AI interior design assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
    setIsLoading(false);
    setIsTyping(false);
    setError(undefined);
  }, []);

  return {
    messages,
    isLoading,
    isTyping,
    error,
    sendMessage,
    regenerateLastMessage,
    clearChat,
  };
}