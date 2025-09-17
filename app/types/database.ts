/**
 * Supabase database type definitions
 * Auto-generated from Supabase CLI: `supabase gen types typescript`
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string | null
          company: string | null
          role: 'CLIENT' | 'DESIGNER' | 'ADMIN'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          company?: string | null
          role?: 'CLIENT' | 'DESIGNER' | 'ADMIN'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          company?: string | null
          role?: 'CLIENT' | 'DESIGNER' | 'ADMIN'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      designs: {
        Row: {
          id: string
          user_id: string
          input_prompt: string
          uploaded_image_url: string | null
          ai_model_used: string
          status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'ARCHIVED'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          input_prompt: string
          uploaded_image_url?: string | null
          ai_model_used: string
          status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'ARCHIVED'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          input_prompt?: string
          uploaded_image_url?: string | null
          ai_model_used?: string
          status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'ARCHIVED'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "designs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      preferences: {
        Row: {
          id: string
          design_id: string
          room_type: string
          size: string
          style_preference: string
          budget: number | null
          color_scheme: string | null
          material_preferences: string | null
          other_requirements: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          design_id: string
          room_type: string
          size: string
          style_preference: string
          budget?: number | null
          color_scheme?: string | null
          material_preferences?: string | null
          other_requirements?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          design_id?: string
          room_type?: string
          size?: string
          style_preference?: string
          budget?: number | null
          color_scheme?: string | null
          material_preferences?: string | null
          other_requirements?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "preferences_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: true
            referencedRelation: "designs"
            referencedColumns: ["id"]
          }
        ]
      }
      design_outputs: {
        Row: {
          id: string
          design_id: string
          output_image_url: string
          variation_name: string | null
          generation_parameters: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          design_id: string
          output_image_url: string
          variation_name?: string | null
          generation_parameters?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          design_id?: string
          output_image_url?: string
          variation_name?: string | null
          generation_parameters?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_outputs_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          }
        ]
      }
      roi_calculations: {
        Row: {
          id: string
          design_id: string
          estimated_cost: number
          roi_percentage: number
          payback_timeline: string | null
          cost_breakdown: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          design_id: string
          estimated_cost: number
          roi_percentage: number
          payback_timeline?: string | null
          cost_breakdown?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          design_id?: string
          estimated_cost?: number
          roi_percentage?: number
          payback_timeline?: string | null
          cost_breakdown?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roi_calculations_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: true
            referencedRelation: "designs"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback: {
        Row: {
          id: string
          design_id: string
          user_id: string
          rating: number
          comments: string | null
          type: 'GENERAL' | 'QUALITY' | 'ACCURACY' | 'USABILITY' | 'FEATURE_REQUEST' | 'BUG_REPORT'
          helpful: boolean | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          design_id: string
          user_id: string
          rating: number
          comments?: string | null
          type?: 'GENERAL' | 'QUALITY' | 'ACCURACY' | 'USABILITY' | 'FEATURE_REQUEST' | 'BUG_REPORT'
          helpful?: boolean | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          design_id?: string
          user_id?: string
          rating?: number
          comments?: string | null
          type?: 'GENERAL' | 'QUALITY' | 'ACCURACY' | 'USABILITY' | 'FEATURE_REQUEST' | 'BUG_REPORT'
          helpful?: boolean | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      UserRole: 'CLIENT' | 'DESIGNER' | 'ADMIN'
      DesignStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'ARCHIVED'
      FeedbackType: 'GENERAL' | 'QUALITY' | 'ACCURACY' | 'USABILITY' | 'FEATURE_REQUEST' | 'BUG_REPORT'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}