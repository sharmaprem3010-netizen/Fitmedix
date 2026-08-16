export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: string
          calories_burned: number | null
          created_at: string
          date: string
          duration_minutes: number | null
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          calories_burned?: number | null
          created_at?: string
          date?: string
          duration_minutes?: number | null
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          calories_burned?: number | null
          created_at?: string
          date?: string
          duration_minutes?: number | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      devices: {
        Row: {
          created_at: string
          device_name: string
          id: string
          last_synced: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_name: string
          id?: string
          last_synced?: string | null
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_name?: string
          id?: string
          last_synced?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      exercise_sets: {
        Row: {
          completed: boolean | null
          created_at: string
          exercise_id: string
          id: string
          reps: number | null
          session_id: string
          set_number: number
          weight_kg: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          exercise_id: string
          id?: string
          reps?: number | null
          session_id: string
          set_number: number
          weight_kg?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          exercise_id?: string
          id?: string
          reps?: number | null
          session_id?: string
          set_number?: number
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_sets_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_sets_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          equipment: string | null
          id: string
          instructions: string[] | null
          name: string
          primary_muscle: string | null
          secondary_muscles: string[] | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          equipment?: string | null
          id?: string
          instructions?: string[] | null
          name: string
          primary_muscle?: string | null
          secondary_muscles?: string[] | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          equipment?: string | null
          id?: string
          instructions?: string[] | null
          name?: string
          primary_muscle?: string | null
          secondary_muscles?: string[] | null
          video_url?: string | null
        }
        Relationships: []
      }
      food_log: {
        Row: {
          calories: number
          carbs: number | null
          created_at: string
          date: string
          fat: number | null
          food_name: string
          id: string
          meal_type: string | null
          protein: number | null
          quantity: number
          serving_size: string | null
          user_id: string
        }
        Insert: {
          calories: number
          carbs?: number | null
          created_at?: string
          date?: string
          fat?: number | null
          food_name: string
          id?: string
          meal_type?: string | null
          protein?: number | null
          quantity?: number
          serving_size?: string | null
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number | null
          created_at?: string
          date?: string
          fat?: number | null
          food_name?: string
          id?: string
          meal_type?: string | null
          protein?: number | null
          quantity?: number
          serving_size?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          thread_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          thread_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          allergies: string | null
          created_at: string
          dietary_preference: string | null
          display_name: string | null
          fitness_goal: string | null
          fitness_level: string | null
          height_cm: number | null
          id: string
          medical_history: string | null
          sex: string | null
          target_calories: number | null
          target_carbs: number | null
          target_fats: number | null
          target_protein: number | null
          training_preference: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          allergies?: string | null
          created_at?: string
          dietary_preference?: string | null
          display_name?: string | null
          fitness_goal?: string | null
          fitness_level?: string | null
          height_cm?: number | null
          id: string
          medical_history?: string | null
          sex?: string | null
          target_calories?: number | null
          target_carbs?: number | null
          target_fats?: number | null
          target_protein?: number | null
          training_preference?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          allergies?: string | null
          created_at?: string
          dietary_preference?: string | null
          display_name?: string | null
          fitness_goal?: string | null
          fitness_level?: string | null
          height_cm?: number | null
          id?: string
          medical_history?: string | null
          sex?: string | null
          target_calories?: number | null
          target_carbs?: number | null
          target_fats?: number | null
          target_protein?: number | null
          training_preference?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      routine_exercises: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          order_index: number
          reps: string | null
          rest_seconds: number | null
          routine_id: string
          sets: number | null
          target_weight_kg: number | null
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          order_index: number
          reps?: string | null
          rest_seconds?: number | null
          routine_id: string
          sets?: number | null
          target_weight_kg?: number | null
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          order_index?: number
          reps?: string | null
          rest_seconds?: number | null
          routine_id?: string
          sets?: number | null
          target_weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "routine_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_exercises_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
      routines: {
        Row: {
          category: string | null
          created_at: string
          difficulty: string | null
          duration_minutes: number | null
          id: string
          is_public: boolean | null
          subtitle: string | null
          target_muscles: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          difficulty?: string | null
          duration_minutes?: number | null
          id?: string
          is_public?: boolean | null
          subtitle?: string | null
          target_muscles?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          difficulty?: string | null
          duration_minutes?: number | null
          id?: string
          is_public?: boolean | null
          subtitle?: string | null
          target_muscles?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      threads: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vitals_logs: {
        Row: {
          created_at: string
          date: string
          id: string
          type: string
          unit: string | null
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          type: string
          unit?: string | null
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          type?: string
          unit?: string | null
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          calories_burned: number | null
          created_at: string
          end_time: string | null
          id: string
          notes: string | null
          routine_id: string | null
          start_time: string
          total_volume_kg: number | null
          user_id: string
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string
          end_time?: string | null
          id?: string
          notes?: string | null
          routine_id?: string | null
          start_time: string
          total_volume_kg?: number | null
          user_id: string
        }
        Update: {
          calories_burned?: number | null
          created_at?: string
          end_time?: string | null
          id?: string
          notes?: string | null
          routine_id?: string | null
          start_time?: string
          total_volume_kg?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
