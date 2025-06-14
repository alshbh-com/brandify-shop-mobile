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
      categories: {
        Row: {
          created_at: string | null
          id: string
          image: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      coupon_usages: {
        Row: {
          coupon_id: string
          id: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          id?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          id?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          discount_percent: number
          end_date: string
          id: string
          is_active: boolean
          max_usage: number
          start_date: string
          usage_count: number
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_percent: number
          end_date: string
          id?: string
          is_active?: boolean
          max_usage?: number
          start_date?: string
          usage_count?: number
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_percent?: number
          end_date?: string
          id?: string
          is_active?: boolean
          max_usage?: number
          start_date?: string
          usage_count?: number
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          is_featured: boolean
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_featured?: boolean
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_featured?: boolean
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          discount_percentage: number
          end_date: string
          id: string
          merchant_id: string
          note: string | null
          product_id: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          discount_percentage: number
          end_date: string
          id?: string
          merchant_id: string
          note?: string | null
          product_id?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          discount_percentage?: number
          end_date?: string
          id?: string
          merchant_id?: string
          note?: string | null
          product_id?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offer_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          created_at: string
          discount_percentage: number
          end_date: string
          id: string
          is_active: boolean
          product_id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_percentage: number
          end_date: string
          id?: string
          is_active?: boolean
          product_id: string
          start_date?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_percentage?: number
          end_date?: string
          id?: string
          is_active?: boolean
          product_id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_approval_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          merchant_id: string
          product_category_id: string | null
          product_description: string | null
          product_image: string | null
          product_name: string
          product_price: number
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          merchant_id: string
          product_category_id?: string | null
          product_description?: string | null
          product_image?: string | null
          product_name: string
          product_price: number
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          merchant_id?: string
          product_category_id?: string | null
          product_description?: string | null
          product_image?: string | null
          product_name?: string
          product_price?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_approval_requests_product_category_id_fkey"
            columns: ["product_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          merchant_id: string | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          merchant_id?: string | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          merchant_id?: string | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birth_date: string
          created_at: string | null
          id: string
          merchant_status: string | null
          name: string
          profile_image: string | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          birth_date: string
          created_at?: string | null
          id: string
          merchant_status?: string | null
          name: string
          profile_image?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          birth_date?: string
          created_at?: string | null
          id?: string
          merchant_status?: string | null
          name?: string
          profile_image?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          admin_comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          updated_at: string
        }
        Insert: {
          admin_comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          updated_at?: string
        }
        Update: {
          admin_comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          admin_password: string
          created_at: string | null
          id: string
          merchant_password: string | null
          store_name: string
          theme_id: number | null
          updated_at: string | null
          welcome_image: string | null
        }
        Insert: {
          admin_password?: string
          created_at?: string | null
          id?: string
          merchant_password?: string | null
          store_name?: string
          theme_id?: number | null
          updated_at?: string | null
          welcome_image?: string | null
        }
        Update: {
          admin_password?: string
          created_at?: string | null
          id?: string
          merchant_password?: string | null
          store_name?: string
          theme_id?: number | null
          updated_at?: string | null
          welcome_image?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "merchant" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "merchant", "user"],
    },
  },
} as const
