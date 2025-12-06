import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      dishes: {
        Row: {
          id: string
          category: 'voor' | 'hoofd' | 'na'
          name: string
          subtitle: string
          ingredients: string
          preparation: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          category: 'voor' | 'hoofd' | 'na'
          name: string
          subtitle: string
          ingredients: string
          preparation: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          category?: 'voor' | 'hoofd' | 'na'
          name?: string
          subtitle?: string
          ingredients?: string
          preparation?: string
          image_url?: string
          created_at?: string
        }
      }
    }
  }
}

export type Dish = Database['public']['Tables']['dishes']['Row']
export type DishInsert = Database['public']['Tables']['dishes']['Insert']
export type DishUpdate = Database['public']['Tables']['dishes']['Update']