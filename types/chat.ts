import type { FileUIPart } from "ai";

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  attachments?: FileUIPart[];
  isLoading?: boolean;
  error?: string;
}

export interface DesignFormData {
  prompt: string;
  roomType: string;
  roomSize: string;
  stylePreference: string;
  budgetRange: string;
  colorPalette: string;
}

export interface DesignResult {
  imageUrl?: string;
  suggestions?: string[];
  description?: string;
  metadata?: Record<string, any>;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  error?: string;
}

export interface AIDesignChatProps {
  className?: string;
  placeholder?: string;
  showWelcomeMessage?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  onDesignGenerated?: (design: DesignResult) => void;
  initialMessages?: ChatMessage[];
  contextData?: Partial<DesignFormData>;
  height?: string;
}

export interface ChatAPI {
  sendMessage: (content: string, files?: FileUIPart[]) => Promise<void>;
  regenerateLastMessage: () => Promise<void>;
  clearChat: () => void;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface APIMessage {
  role: MessageRole;
  content: string;
  attachments?: FileUIPart[];
  context?: Partial<DesignFormData>;
}