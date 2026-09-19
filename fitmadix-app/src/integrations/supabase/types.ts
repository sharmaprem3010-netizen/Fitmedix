export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      encyclopedia_entries: {
        Row: { id: string; slug: string; title: string; category: string; subcategory: string | null; description: string | null; image_url: string | null; content: string | null; benefits_uses: string | null; risks_limitations: string | null; warnings: string | null; status: string; language: string; last_reviewed_at: string | null; created_at: string; updated_at: string; };
        Insert: { id?: string; slug: string; title: string; category: string; subcategory?: string | null; description?: string | null; image_url?: string | null; content?: string | null; benefits_uses?: string | null; risks_limitations?: string | null; warnings?: string | null; status?: string; language?: string; last_reviewed_at?: string | null; created_at?: string; updated_at?: string; };
        Update: { id?: string; slug?: string; title?: string; category?: string; subcategory?: string | null; description?: string | null; image_url?: string | null; content?: string | null; benefits_uses?: string | null; risks_limitations?: string | null; warnings?: string | null; status?: string; language?: string; last_reviewed_at?: string | null; created_at?: string; updated_at?: string; };
        Relationships: [];
      };
      medicine_details: {
        Row: { entry_id: string; generic_name: string | null; brand_names: string[] | null; drug_class: string | null; available_forms: string[] | null; prescription_status: string | null; common_strengths: string[] | null; possible_interactions: string | null; storage_info: string | null; };
        Insert: { entry_id: string; generic_name?: string | null; brand_names?: string[] | null; drug_class?: string | null; available_forms?: string[] | null; prescription_status?: string | null; common_strengths?: string[] | null; possible_interactions?: string | null; storage_info?: string | null; };
        Update: { entry_id?: string; generic_name?: string | null; brand_names?: string[] | null; drug_class?: string | null; available_forms?: string[] | null; prescription_status?: string | null; common_strengths?: string[] | null; possible_interactions?: string | null; storage_info?: string | null; };
        Relationships: [{ foreignKeyName: 'medicine_details_entry_id_fkey', columns: ['entry_id'], isOneToOne: true, referencedRelation: 'encyclopedia_entries', referencedColumns: ['id'] }];
      };
      food_details: {
        Row: { entry_id: string; calories_per_100g: number | null; protein_per_100g: number | null; carbs_per_100g: number | null; fat_per_100g: number | null; fiber_per_100g: number | null; serving_size_info: string | null; allergy_info: string | null; };
        Insert: { entry_id: string; calories_per_100g?: number | null; protein_per_100g?: number | null; carbs_per_100g?: number | null; fat_per_100g?: number | null; fiber_per_100g?: number | null; serving_size_info?: string | null; allergy_info?: string | null; };
        Update: { entry_id?: string; calories_per_100g?: number | null; protein_per_100g?: number | null; carbs_per_100g?: number | null; fat_per_100g?: number | null; fiber_per_100g?: number | null; serving_size_info?: string | null; allergy_info?: string | null; };
        Relationships: [{ foreignKeyName: 'food_details_entry_id_fkey', columns: ['entry_id'], isOneToOne: true, referencedRelation: 'encyclopedia_entries', referencedColumns: ['id'] }];
      };
      exercise_details: {
        Row: { entry_id: string; difficulty: string | null; primary_muscles: string[] | null; secondary_muscles: string[] | null; equipment: string[] | null; instructions: string[] | null; common_mistakes: string[] | null; safety_considerations: string | null; beginner_modification: string | null; advanced_modification: string | null; };
        Insert: { entry_id: string; difficulty?: string | null; primary_muscles?: string[] | null; secondary_muscles?: string[] | null; equipment?: string[] | null; instructions?: string[] | null; common_mistakes?: string[] | null; safety_considerations?: string | null; beginner_modification?: string | null; advanced_modification?: string | null; };
        Update: { entry_id?: string; difficulty?: string | null; primary_muscles?: string[] | null; secondary_muscles?: string[] | null; equipment?: string[] | null; instructions?: string[] | null; common_mistakes?: string[] | null; safety_considerations?: string | null; beginner_modification?: string | null; advanced_modification?: string | null; };
        Relationships: [{ foreignKeyName: 'exercise_details_entry_id_fkey', columns: ['entry_id'], isOneToOne: true, referencedRelation: 'encyclopedia_entries', referencedColumns: ['id'] }];
      };
      condition_details: {
        Row: { entry_id: string; common_symptoms: string[] | null; common_causes: string[] | null; evaluation_methods: string | null; management_approaches: string | null; emergency_warning_signs: string | null; };
        Insert: { entry_id: string; common_symptoms?: string[] | null; common_causes?: string[] | null; evaluation_methods?: string | null; management_approaches?: string | null; emergency_warning_signs?: string | null; };
        Update: { entry_id?: string; common_symptoms?: string[] | null; common_causes?: string[] | null; evaluation_methods?: string | null; management_approaches?: string | null; emergency_warning_signs?: string | null; };
        Relationships: [{ foreignKeyName: 'condition_details_entry_id_fkey', columns: ['entry_id'], isOneToOne: true, referencedRelation: 'encyclopedia_entries', referencedColumns: ['id'] }];
      };
      nutrient_details: {
        Row: { entry_id: string; food_sources: string[] | null; deficiency_info: string | null; toxicity_info: string | null; supplement_info: string | null; recommended_intake: string | null; };
        Insert: { entry_id: string; food_sources?: string[] | null; deficiency_info?: string | null; toxicity_info?: string | null; supplement_info?: string | null; recommended_intake?: string | null; };
        Update: { entry_id?: string; food_sources?: string[] | null; deficiency_info?: string | null; toxicity_info?: string | null; supplement_info?: string | null; recommended_intake?: string | null; };
        Relationships: [{ foreignKeyName: 'nutrient_details_entry_id_fkey', columns: ['entry_id'], isOneToOne: true, referencedRelation: 'encyclopedia_entries', referencedColumns: ['id'] }];
      };
      test_details: {
        Row: { entry_id: string; why_ordered: string | null; what_it_measures: string | null; preparation: string | null; results_meaning: string | null; limitations: string | null; };
        Insert: { entry_id: string; why_ordered?: string | null; what_it_measures?: string | null; preparation?: string | null; results_meaning?: string | null; limitations?: string | null; };
        Update: { entry_id?: string; why_ordered?: string | null; what_it_measures?: string | null; preparation?: string | null; results_meaning?: string | null; limitations?: string | null; };
        Relationships: [{ foreignKeyName: 'test_details_entry_id_fkey', columns: ['entry_id'], isOneToOne: true, referencedRelation: 'encyclopedia_entries', referencedColumns: ['id'] }];
      };
      health_products: {
        Row: { entry_id: string; product_type: string | null; specifications: Json | null; advantages: string[] | null; limitations: string[] | null; suitable_use_cases: string[] | null; };
        Insert: { entry_id: string; product_type?: string | null; specifications?: Json | null; advantages?: string[] | null; limitations?: string[] | null; suitable_use_cases?: string[] | null; };
        Update: { entry_id?: string; product_type?: string | null; specifications?: Json | null; advantages?: string[] | null; limitations?: string[] | null; suitable_use_cases?: string[] | null; };
        Relationships: [{ foreignKeyName: 'health_products_entry_id_fkey', columns: ['entry_id'], isOneToOne: true, referencedRelation: 'encyclopedia_entries', referencedColumns: ['id'] }];
      };
      product_sellers: {
        Row: { id: string; entry_id: string | null; seller_name: string; price: number | null; currency: string | null; availability: string | null; purchase_url: string | null; last_updated: string; };
        Insert: { id?: string; entry_id?: string | null; seller_name: string; price?: number | null; currency?: string | null; availability?: string | null; purchase_url?: string | null; last_updated?: string; };
        Update: { id?: string; entry_id?: string | null; seller_name?: string; price?: number | null; currency?: string | null; availability?: string | null; purchase_url?: string | null; last_updated?: string; };
        Relationships: [{ foreignKeyName: 'product_sellers_entry_id_fkey', columns: ['entry_id'], isOneToOne: false, referencedRelation: 'encyclopedia_entries', referencedColumns: ['id'] }];
      };
      encyclopedia_sources: {
        Row: { id: string; entry_id: string | null; source_name: string; source_url: string | null; accessed_at: string; };
        Insert: { id?: string; entry_id?: string | null; source_name: string; source_url?: string | null; accessed_at?: string; };
        Update: { id?: string; entry_id?: string | null; source_name?: string; source_url?: string | null; accessed_at?: string; };
        Relationships: [{ foreignKeyName: 'encyclopedia_sources_entry_id_fkey', columns: ['entry_id'], isOneToOne: false, referencedRelation: 'encyclopedia_entries', referencedColumns: ['id'] }];
      };
      encyclopedia_relations: {
        Row: { id: string; source_id: string | null; target_id: string | null; relation_type: string | null; };
        Insert: { id?: string; source_id?: string | null; target_id?: string | null; relation_type?: string | null; };
        Update: { id?: string; source_id?: string | null; target_id?: string | null; relation_type?: string | null; };
        Relationships: [
          { foreignKeyName: 'encyclopedia_relations_source_id_fkey', columns: ['source_id'], isOneToOne: false, referencedRelation: 'encyclopedia_entries', referencedColumns: ['id'] },
          { foreignKeyName: 'encyclopedia_relations_target_id_fkey', columns: ['target_id'], isOneToOne: false, referencedRelation: 'encyclopedia_entries', referencedColumns: ['id'] }
        ];
      };

      activity_logs: {
        Row: {
          activity_type: string;
          calories_burned: number | null;
          created_at: string;
          date: string;
          duration_minutes: number | null;
          id: string;
          user_id: string;
        };
        Insert: {
          activity_type: string;
          calories_burned?: number | null;
          created_at?: string;
          date?: string;
          duration_minutes?: number | null;
          id?: string;
          user_id: string;
        };
        Update: {
          activity_type?: string;
          calories_burned?: number | null;
          created_at?: string;
          date?: string;
          duration_minutes?: number | null;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      devices: {
        Row: {
          created_at: string;
          device_name: string;
          id: string;
          last_synced: string | null;
          status: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          device_name: string;
          id?: string;
          last_synced?: string | null;
          status: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          device_name?: string;
          id?: string;
          last_synced?: string | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      exercise_sets: {
        Row: {
          completed: boolean | null;
          created_at: string;
          exercise_id: string;
          id: string;
          reps: number | null;
          session_id: string;
          set_number: number;
          weight_kg: number | null;
        };
        Insert: {
          completed?: boolean | null;
          created_at?: string;
          exercise_id: string;
          id?: string;
          reps?: number | null;
          session_id: string;
          set_number: number;
          weight_kg?: number | null;
        };
        Update: {
          completed?: boolean | null;
          created_at?: string;
          exercise_id?: string;
          id?: string;
          reps?: number | null;
          session_id?: string;
          set_number?: number;
          weight_kg?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "exercise_sets_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exercise_sets_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "workout_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      exercises: {
        Row: {
          category: string | null;
          created_at: string;
          description: string | null;
          difficulty: string | null;
          equipment: string | null;
          id: string;
          instructions: string[] | null;
          name: string;
          primary_muscle: string | null;
          secondary_muscles: string[] | null;
          video_url: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          difficulty?: string | null;
          equipment?: string | null;
          id?: string;
          instructions?: string[] | null;
          name: string;
          primary_muscle?: string | null;
          secondary_muscles?: string[] | null;
          video_url?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          difficulty?: string | null;
          equipment?: string | null;
          id?: string;
          instructions?: string[] | null;
          name?: string;
          primary_muscle?: string | null;
          secondary_muscles?: string[] | null;
          video_url?: string | null;
        };
        Relationships: [];
      };
      food_log: {
        Row: {
          calories: number;
          carbs: number | null;
          created_at: string;
          date: string;
          fat: number | null;
          food_name: string;
          id: string;
          meal_type: string | null;
          protein: number | null;
          quantity: number;
          serving_size: string | null;
          user_id: string;
        };
        Insert: {
          calories: number;
          carbs?: number | null;
          created_at?: string;
          date?: string;
          fat?: number | null;
          food_name: string;
          id?: string;
          meal_type?: string | null;
          protein?: number | null;
          quantity?: number;
          serving_size?: string | null;
          user_id: string;
        };
        Update: {
          calories?: number;
          carbs?: number | null;
          created_at?: string;
          date?: string;
          fat?: number | null;
          food_name?: string;
          id?: string;
          meal_type?: string | null;
          protein?: number | null;
          quantity?: number;
          serving_size?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          role: string;
          thread_id: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          role: string;
          thread_id: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          role?: string;
          thread_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_thread_id_fkey";
            columns: ["thread_id"];
            isOneToOne: false;
            referencedRelation: "threads";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          age: number | null;
          allergies: string | null;
          created_at: string;
          dietary_preference: string | null;
          display_name: string | null;
          fitness_goal: string | null;
          fitness_level: string | null;
          height_cm: number | null;
          id: string;
          medical_history: string | null;
          sex: string | null;
          target_calories: number | null;
          target_carbs: number | null;
          target_fats: number | null;
          target_protein: number | null;
          training_preference: string | null;
          updated_at: string;
          weight_kg: number | null;
        };
        Insert: {
          age?: number | null;
          allergies?: string | null;
          created_at?: string;
          dietary_preference?: string | null;
          display_name?: string | null;
          fitness_goal?: string | null;
          fitness_level?: string | null;
          height_cm?: number | null;
          id: string;
          medical_history?: string | null;
          sex?: string | null;
          target_calories?: number | null;
          target_carbs?: number | null;
          target_fats?: number | null;
          target_protein?: number | null;
          training_preference?: string | null;
          updated_at?: string;
          weight_kg?: number | null;
        };
        Update: {
          age?: number | null;
          allergies?: string | null;
          created_at?: string;
          dietary_preference?: string | null;
          display_name?: string | null;
          fitness_goal?: string | null;
          fitness_level?: string | null;
          height_cm?: number | null;
          id?: string;
          medical_history?: string | null;
          sex?: string | null;
          target_calories?: number | null;
          target_carbs?: number | null;
          target_fats?: number | null;
          target_protein?: number | null;
          training_preference?: string | null;
          updated_at?: string;
          weight_kg?: number | null;
        };
        Relationships: [];
      };
      routine_exercises: {
        Row: {
          created_at: string;
          exercise_id: string;
          id: string;
          order_index: number;
          reps: string | null;
          rest_seconds: number | null;
          routine_id: string;
          sets: number | null;
          target_weight_kg: number | null;
        };
        Insert: {
          created_at?: string;
          exercise_id: string;
          id?: string;
          order_index: number;
          reps?: string | null;
          rest_seconds?: number | null;
          routine_id: string;
          sets?: number | null;
          target_weight_kg?: number | null;
        };
        Update: {
          created_at?: string;
          exercise_id?: string;
          id?: string;
          order_index?: number;
          reps?: string | null;
          rest_seconds?: number | null;
          routine_id?: string;
          sets?: number | null;
          target_weight_kg?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "routine_exercises_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "routine_exercises_routine_id_fkey";
            columns: ["routine_id"];
            isOneToOne: false;
            referencedRelation: "routines";
            referencedColumns: ["id"];
          },
        ];
      };
      routines: {
        Row: {
          category: string | null;
          created_at: string;
          difficulty: string | null;
          duration_minutes: number | null;
          id: string;
          is_public: boolean | null;
          subtitle: string | null;
          target_muscles: string[] | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          difficulty?: string | null;
          duration_minutes?: number | null;
          id?: string;
          is_public?: boolean | null;
          subtitle?: string | null;
          target_muscles?: string[] | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          difficulty?: string | null;
          duration_minutes?: number | null;
          id?: string;
          is_public?: boolean | null;
          subtitle?: string | null;
          target_muscles?: string[] | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      threads: {
        Row: {
          created_at: string;
          id: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          title?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      vitals_logs: {
        Row: {
          created_at: string;
          date: string;
          id: string;
          type: string;
          unit: string | null;
          user_id: string;
          value: number;
        };
        Insert: {
          created_at?: string;
          date?: string;
          id?: string;
          type: string;
          unit?: string | null;
          user_id: string;
          value: number;
        };
        Update: {
          created_at?: string;
          date?: string;
          id?: string;
          type?: string;
          unit?: string | null;
          user_id?: string;
          value?: number;
        };
        Relationships: [];
      };
      workout_sessions: {
        Row: {
          calories_burned: number | null;
          created_at: string;
          end_time: string | null;
          id: string;
          notes: string | null;
          routine_id: string | null;
          start_time: string;
          total_volume_kg: number | null;
          user_id: string;
        };
        Insert: {
          calories_burned?: number | null;
          created_at?: string;
          end_time?: string | null;
          id?: string;
          notes?: string | null;
          routine_id?: string | null;
          start_time: string;
          total_volume_kg?: number | null;
          user_id: string;
        };
        Update: {
          calories_burned?: number | null;
          created_at?: string;
          end_time?: string | null;
          id?: string;
          notes?: string | null;
          routine_id?: string | null;
          start_time?: string;
          total_volume_kg?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workout_sessions_routine_id_fkey";
            columns: ["routine_id"];
            isOneToOne: false;
            referencedRelation: "routines";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      encyclopedia_category: "medicine" | "food" | "exercise" | "condition" | "nutrient" | "test" | "term" | "product";
      content_status: "draft" | "in_review" | "published" | "archived";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
