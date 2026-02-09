export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blogs: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          image: string | null
          is_published: boolean
          published_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          image?: string | null
          is_published?: boolean
          published_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          image?: string | null
          is_published?: boolean
          published_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_economicus_articles: {
        Row: {
          id: string
          original_title: string
          original_url: string
          original_source: string | null
          original_published_at: string | null
          api_source: string
          url_hash: string
          roman_title: string
          roman_summary: string
          roman_category: string
          roman_characters: string[]
          sentiment: string | null
          ticker_symbols: string[]
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          original_title: string
          original_url: string
          original_source?: string | null
          original_published_at?: string | null
          api_source: string
          url_hash: string
          roman_title: string
          roman_summary: string
          roman_category: string
          roman_characters?: string[]
          sentiment?: string | null
          ticker_symbols?: string[]
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          original_title?: string
          original_url?: string
          original_source?: string | null
          original_published_at?: string | null
          api_source?: string
          url_hash?: string
          roman_title?: string
          roman_summary?: string
          roman_category?: string
          roman_characters?: string[]
          sentiment?: string | null
          ticker_symbols?: string[]
          is_published?: boolean
          created_at?: string
        }
        Relationships: []
      }
      forum_economicus_fetch_log: {
        Row: {
          id: string
          api_source: string
          fetched_at: string
          articles_fetched: number
          articles_new: number
          error: string | null
        }
        Insert: {
          id?: string
          api_source: string
          fetched_at?: string
          articles_fetched?: number
          articles_new?: number
          error?: string | null
        }
        Update: {
          id?: string
          api_source?: string
          fetched_at?: string
          articles_fetched?: number
          articles_new?: number
          error?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          nickname: string | null
          subscribed_at: string
          unsubscribed_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          nickname?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          nickname?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          is_active?: boolean
        }
        Relationships: []
      }
      digital_orders: {
        Row: {
          amount_paid: number
          created_at: string
          delivered_at: string | null
          email: string
          id: string
          nickname: string
          payment_method: string
          payment_provider: string
          paypal_order_id: string | null
          product_id: string
          product_name: string
          status: string
          user_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          delivered_at?: string | null
          email: string
          id?: string
          nickname: string
          payment_method: string
          payment_provider?: string
          paypal_order_id?: string | null
          product_id: string
          product_name: string
          status?: string
          user_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          delivered_at?: string | null
          email?: string
          id?: string
          nickname?: string
          payment_method?: string
          payment_provider?: string
          paypal_order_id?: string | null
          product_id?: string
          product_name?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "digital_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      physical_orders: {
        Row: {
          address: string
          amount_paid: number
          created_at: string
          delivered_at: string | null
          delivery_date: string
          email: string
          id: string
          items: Json
          nickname: string
          payment_method: string
          payment_provider: string
          paypal_order_id: string | null
          phone: string
          status: string
          user_id: string
        }
        Insert: {
          address: string
          amount_paid: number
          created_at?: string
          delivered_at?: string | null
          delivery_date: string
          email: string
          id?: string
          items: Json
          nickname: string
          payment_method: string
          payment_provider?: string
          paypal_order_id?: string | null
          phone: string
          status?: string
          user_id: string
        }
        Update: {
          address?: string
          amount_paid?: number
          created_at?: string
          delivered_at?: string | null
          delivery_date?: string
          email?: string
          id?: string
          items?: Json
          nickname?: string
          payment_method?: string
          payment_provider?: string
          paypal_order_id?: string | null
          phone?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          digital_content: string | null
          id: string
          image: string | null
          name: string
          price: number
          subscription_options: Json | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          digital_content?: string | null
          id?: string
          image?: string | null
          name: string
          price: number
          subscription_options?: Json | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          digital_content?: string | null
          id?: string
          image?: string | null
          name?: string
          price?: number
          subscription_options?: Json | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          nickname: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          nickname: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nickname?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      subscription_orders: {
        Row: {
          amount_paid: number
          buyer_email: string
          buyer_name: string
          created_at: string
          delivered_at: string | null
          delivery_date: string
          id: string
          payment_method: string
          payment_provider: string
          paypal_order_id: string | null
          product_id: string
          product_name: string
          recipient_address: string
          recipient_address_line1: string | null
          recipient_address_line2: string | null
          recipient_city: string | null
          recipient_company: string | null
          recipient_country: string | null
          recipient_email: string | null
          recipient_name: string
          recipient_phone: string
          recipient_state: string | null
          recipient_title: string | null
          recipient_zipcode: string | null
          status: string
          subscription_name: string
          subscription_price: number
          user_id: string
        }
        Insert: {
          amount_paid: number
          buyer_email: string
          buyer_name: string
          created_at?: string
          delivered_at?: string | null
          delivery_date: string
          id?: string
          payment_method: string
          payment_provider?: string
          paypal_order_id?: string | null
          product_id: string
          product_name: string
          recipient_address: string
          recipient_address_line1?: string | null
          recipient_address_line2?: string | null
          recipient_city?: string | null
          recipient_company?: string | null
          recipient_country?: string | null
          recipient_email?: string | null
          recipient_name: string
          recipient_phone: string
          recipient_state?: string | null
          recipient_title?: string | null
          recipient_zipcode?: string | null
          status?: string
          subscription_name: string
          subscription_price: number
          user_id: string
        }
        Update: {
          amount_paid?: number
          buyer_email?: string
          buyer_name?: string
          created_at?: string
          delivered_at?: string | null
          delivery_date?: string
          id?: string
          payment_method?: string
          payment_provider?: string
          paypal_order_id?: string | null
          product_id?: string
          product_name?: string
          recipient_address?: string
          recipient_address_line1?: string | null
          recipient_address_line2?: string | null
          recipient_city?: string | null
          recipient_company?: string | null
          recipient_country?: string | null
          recipient_email?: string | null
          recipient_name?: string
          recipient_phone?: string
          recipient_state?: string | null
          recipient_title?: string | null
          recipient_zipcode?: string | null
          status?: string
          subscription_name?: string
          subscription_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_comments: {
        Row: {
          id: string
          platform: string
          post_id: string
          post_url: string | null
          post_text: string | null
          post_author: string | null
          post_likes: number
          comment_text: string
          search_query: string | null
          status: string
          reviewed_at: string | null
          posted_at: string | null
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          platform: string
          post_id: string
          post_url?: string | null
          post_text?: string | null
          post_author?: string | null
          post_likes?: number
          comment_text: string
          search_query?: string | null
          status?: string
          reviewed_at?: string | null
          posted_at?: string | null
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          platform?: string
          post_id?: string
          post_url?: string | null
          post_text?: string | null
          post_author?: string | null
          post_likes?: number
          comment_text?: string
          search_query?: string | null
          status?: string
          reviewed_at?: string | null
          posted_at?: string | null
          error_message?: string | null
          created_at?: string
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
