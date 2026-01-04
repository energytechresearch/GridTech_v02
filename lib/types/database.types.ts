export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      technologies: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          tech_id: string
          title: string
          description: string
          category: string
          type: string
          status: 'active' | 'archived' | 'in-review'
          tags: string[]
          owner: string
          grid_layer: string | null
          benefits: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          tech_id: string
          title: string
          description: string
          category: string
          type: string
          status?: 'active' | 'archived' | 'in-review'
          tags?: string[]
          owner: string
          grid_layer?: string | null
          benefits?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          tech_id?: string
          title?: string
          description?: string
          category?: string
          type?: string
          status?: 'active' | 'archived' | 'in-review'
          tags?: string[]
          owner?: string
          grid_layer?: string | null
          benefits?: string | null
        }
      }
      intake_submissions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          submission_id: string
          title: string
          description: string
          category: string
          type: string
          status: 'pending' | 'in-review' | 'approved' | 'rejected'
          submitter_name: string
          submitter_email: string
          submitter_department: string
          grid_layer: string | null
          benefits: string | null
          vendors: string | null
          feasibility_score: number | null
          reviewer_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          submission_id: string
          title: string
          description: string
          category: string
          type: string
          status?: 'pending' | 'in-review' | 'approved' | 'rejected'
          submitter_name: string
          submitter_email: string
          submitter_department: string
          grid_layer?: string | null
          benefits?: string | null
          vendors?: string | null
          feasibility_score?: number | null
          reviewer_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          submission_id?: string
          title?: string
          description?: string
          category?: string
          type?: string
          status?: 'pending' | 'in-review' | 'approved' | 'rejected'
          submitter_name?: string
          submitter_email?: string
          submitter_department?: string
          grid_layer?: string | null
          benefits?: string | null
          vendors?: string | null
          feasibility_score?: number | null
          reviewer_notes?: string | null
        }
      }
      pilots: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          pilot_id: string
          title: string
          technology_id: string | null
          phase: 'initiation' | 'planning' | 'execution' | 'completed' | 'pipeline'
          status: string
          sponsor: string
          location: string
          start_date: string | null
          end_date: string | null
          objectives: string
          progress: number
          lessons_learned: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          pilot_id: string
          title: string
          technology_id?: string | null
          phase?: 'initiation' | 'planning' | 'execution' | 'completed' | 'pipeline'
          status: string
          sponsor: string
          location: string
          start_date?: string | null
          end_date?: string | null
          objectives: string
          progress?: number
          lessons_learned?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          pilot_id?: string
          title?: string
          technology_id?: string | null
          phase?: 'initiation' | 'planning' | 'execution' | 'completed' | 'pipeline'
          status?: string
          sponsor?: string
          location?: string
          start_date?: string | null
          end_date?: string | null
          objectives?: string
          progress?: number
          lessons_learned?: string | null
        }
      }
      market_watchlist: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          watchlist_id: string
          technology: string
          vendor: string | null
          signal: 'emerging' | 'monitoring' | 'mature'
          priority: 'low' | 'medium' | 'high'
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          watchlist_id: string
          technology: string
          vendor?: string | null
          signal?: 'emerging' | 'monitoring' | 'mature'
          priority?: 'low' | 'medium' | 'high'
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          watchlist_id?: string
          technology?: string
          vendor?: string | null
          signal?: 'emerging' | 'monitoring' | 'mature'
          priority?: 'low' | 'medium' | 'high'
          notes?: string | null
        }
      }
      vendors: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          vendor_id: string
          name: string
          focus: string
          maturity: 'early' | 'growth' | 'mature'
          region: string
          active_pilots: number
          related_technologies: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          vendor_id: string
          name: string
          focus: string
          maturity?: 'early' | 'growth' | 'mature'
          region: string
          active_pilots?: number
          related_technologies?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          vendor_id?: string
          name?: string
          focus?: string
          maturity?: 'early' | 'growth' | 'mature'
          region?: string
          active_pilots?: number
          related_technologies?: string[]
        }
      }
      industry_insights: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          insight_id: string
          title: string
          source: string
          date: string
          summary: string
          url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          insight_id: string
          title: string
          source: string
          date: string
          summary: string
          url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          insight_id?: string
          title?: string
          source?: string
          date?: string
          summary?: string
          url?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          department: string | null
          role: 'admin' | 'reviewer' | 'submitter' | 'viewer'
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          department?: string | null
          role?: 'admin' | 'reviewer' | 'submitter' | 'viewer'
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          department?: string | null
          role?: 'admin' | 'reviewer' | 'submitter' | 'viewer'
          avatar_url?: string | null
        }
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
  }
}
