import { AiErrorCode, AI_ERROR_CODES } from './config';

export interface AiError {
  code: AiErrorCode;
  message: string;
  details?: any;
  retryable: boolean;
  userMessage: string;
}

export class AiErrorHandler {
  static createError(
    code: AiErrorCode,
    message: string,
    details?: any,
    userMessage?: string
  ): AiError {
    const retryable = this.isRetryable(code);
    const defaultUserMessage = this.getDefaultUserMessage(code);

    return {
      code,
      message,
      details,
      retryable,
      userMessage: userMessage || defaultUserMessage,
    };
  }

  static isRetryable(code: AiErrorCode): boolean {
    const retryableCodes = [
      AI_ERROR_CODES.PROVIDER_UNAVAILABLE,
      AI_ERROR_CODES.RATE_LIMIT_EXCEEDED,
      AI_ERROR_CODES.GENERATION_FAILED,
      AI_ERROR_CODES.STORAGE_FAILED,
      AI_ERROR_CODES.UNKNOWN_ERROR,
    ];

    return retryableCodes.includes(code);
  }

  static getDefaultUserMessage(code: AiErrorCode): string {
    switch (code) {
      case AI_ERROR_CODES.PROVIDER_UNAVAILABLE:
        return 'The AI service is temporarily unavailable. Please try again in a few moments.';

      case AI_ERROR_CODES.API_KEY_INVALID:
        return 'There\'s a configuration issue with our AI service. Please contact support.';

      case AI_ERROR_CODES.RATE_LIMIT_EXCEEDED:
        return 'You\'re generating images too quickly. Please wait a moment before trying again.';

      case AI_ERROR_CODES.COST_LIMIT_EXCEEDED:
        return 'You\'ve reached your daily generation limit. Please try again tomorrow or upgrade your plan.';

      case AI_ERROR_CODES.INVALID_PROMPT:
        return 'Your design description couldn\'t be processed. Please try a different description.';

      case AI_ERROR_CODES.GENERATION_FAILED:
        return 'Image generation failed. Please try again with different settings.';

      case AI_ERROR_CODES.STORAGE_FAILED:
        return 'There was an issue saving your generated images. Please try again.';

      case AI_ERROR_CODES.UNKNOWN_ERROR:
      default:
        return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
    }
  }

  static handleProviderError(provider: string, error: any): AiError {
    console.error(`${provider} provider error:`, error);

    if (provider === 'openai') {
      return this.handleOpenAIError(error);
    } else if (provider === 'replicate') {
      return this.handleReplicateError(error);
    }

    return this.createError(
      AI_ERROR_CODES.UNKNOWN_ERROR,
      `Unknown provider error: ${error.message}`,
      error
    );
  }

  private static handleOpenAIError(error: any): AiError {
    if (error.error?.code) {
      switch (error.error.code) {
        case 'invalid_api_key':
        case 'unauthorized':
          return this.createError(
            AI_ERROR_CODES.API_KEY_INVALID,
            'OpenAI API key is invalid',
            error
          );

        case 'rate_limit_exceeded':
          return this.createError(
            AI_ERROR_CODES.RATE_LIMIT_EXCEEDED,
            'OpenAI rate limit exceeded',
            error,
            'Too many requests. Please wait a few minutes before trying again.'
          );

        case 'insufficient_quota':
          return this.createError(
            AI_ERROR_CODES.COST_LIMIT_EXCEEDED,
            'OpenAI quota exceeded',
            error,
            'OpenAI quota exceeded. Please check your OpenAI account.'
          );

        case 'content_policy_violation':
          return this.createError(
            AI_ERROR_CODES.INVALID_PROMPT,
            'Content policy violation',
            error,
            'Your design description violates content policy. Please try a different description.'
          );

        case 'billing_not_active':
          return this.createError(
            AI_ERROR_CODES.API_KEY_INVALID,
            'OpenAI billing not active',
            error,
            'OpenAI billing setup required. Please check your OpenAI account.'
          );

        default:
          return this.createError(
            AI_ERROR_CODES.GENERATION_FAILED,
            `OpenAI error: ${error.error.code}`,
            error
          );
      }
    }

    if (error.message) {
      return this.createError(
        AI_ERROR_CODES.GENERATION_FAILED,
        `OpenAI error: ${error.message}`,
        error
      );
    }

    return this.createError(
      AI_ERROR_CODES.UNKNOWN_ERROR,
      'Unknown OpenAI error',
      error
    );
  }

  private static handleReplicateError(error: any): AiError {
    if (error.message) {
      // Check for common Replicate error patterns
      if (error.message.includes('authentication')) {
        return this.createError(
          AI_ERROR_CODES.API_KEY_INVALID,
          'Replicate authentication failed',
          error
        );
      }

      if (error.message.includes('rate limit')) {
        return this.createError(
          AI_ERROR_CODES.RATE_LIMIT_EXCEEDED,
          'Replicate rate limit exceeded',
          error
        );
      }

      if (error.message.includes('timeout')) {
        return this.createError(
          AI_ERROR_CODES.PROVIDER_UNAVAILABLE,
          'Replicate request timeout',
          error,
          'The generation is taking longer than expected. Please try again.'
        );
      }

      if (error.message.includes('insufficient funds')) {
        return this.createError(
          AI_ERROR_CODES.COST_LIMIT_EXCEEDED,
          'Replicate insufficient funds',
          error,
          'Replicate account needs funding. Please check your Replicate account.'
        );
      }

      if (error.message.includes('model not found')) {
        return this.createError(
          AI_ERROR_CODES.GENERATION_FAILED,
          'Replicate model not found',
          error,
          'The selected AI model is not available. Please try a different model.'
        );
      }
    }

    if (error.status) {
      switch (error.status) {
        case 401:
          return this.createError(
            AI_ERROR_CODES.API_KEY_INVALID,
            'Replicate unauthorized',
            error
          );

        case 429:
          return this.createError(
            AI_ERROR_CODES.RATE_LIMIT_EXCEEDED,
            'Replicate rate limited',
            error
          );

        case 500:
        case 502:
        case 503:
        case 504:
          return this.createError(
            AI_ERROR_CODES.PROVIDER_UNAVAILABLE,
            'Replicate server error',
            error
          );

        default:
          return this.createError(
            AI_ERROR_CODES.GENERATION_FAILED,
            `Replicate HTTP ${error.status}`,
            error
          );
      }
    }

    return this.createError(
      AI_ERROR_CODES.UNKNOWN_ERROR,
      'Unknown Replicate error',
      error
    );
  }

  static handleStorageError(error: any): AiError {
    console.error('Storage error:', error);

    if (error.message) {
      if (error.message.includes('not found')) {
        return this.createError(
          AI_ERROR_CODES.STORAGE_FAILED,
          'Storage bucket not found',
          error,
          'Storage configuration issue. Please contact support.'
        );
      }

      if (error.message.includes('unauthorized')) {
        return this.createError(
          AI_ERROR_CODES.STORAGE_FAILED,
          'Storage unauthorized',
          error,
          'Storage access denied. Please contact support.'
        );
      }

      if (error.message.includes('quota')) {
        return this.createError(
          AI_ERROR_CODES.STORAGE_FAILED,
          'Storage quota exceeded',
          error,
          'Storage quota exceeded. Please contact support.'
        );
      }
    }

    return this.createError(
      AI_ERROR_CODES.STORAGE_FAILED,
      'Storage operation failed',
      error
    );
  }

  static formatErrorForApi(error: AiError) {
    return {
      success: false,
      error: error.userMessage,
      code: error.code,
      retryable: error.retryable,
      details: process.env.NODE_ENV === 'development' ? error.details : undefined,
    };
  }

  static formatErrorForLogging(error: AiError, context?: any) {
    return {
      timestamp: new Date().toISOString(),
      error: {
        code: error.code,
        message: error.message,
        userMessage: error.userMessage,
        retryable: error.retryable,
        details: error.details,
      },
      context,
    };
  }
}

// Utility function to wrap async operations with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<{ success: true; data: T } | { success: false; error: AiError }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error: any) {
    console.error(`Error in ${context || 'operation'}:`, error);

    let aiError: AiError;

    if (error instanceof Error) {
      // Try to categorize the error based on its properties
      if (error.message.includes('fetch')) {
        aiError = AiErrorHandler.createError(
          AI_ERROR_CODES.PROVIDER_UNAVAILABLE,
          `Network error in ${context}`,
          error
        );
      } else if (error.message.includes('timeout')) {
        aiError = AiErrorHandler.createError(
          AI_ERROR_CODES.PROVIDER_UNAVAILABLE,
          `Timeout error in ${context}`,
          error
        );
      } else {
        aiError = AiErrorHandler.createError(
          AI_ERROR_CODES.UNKNOWN_ERROR,
          `Unknown error in ${context}: ${error.message}`,
          error
        );
      }
    } else {
      aiError = AiErrorHandler.createError(
        AI_ERROR_CODES.UNKNOWN_ERROR,
        `Unknown error in ${context}`,
        error
      );
    }

    return { success: false, error: aiError };
  }
}