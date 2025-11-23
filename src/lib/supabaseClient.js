
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kdhqkhqmowywlknmuytf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkaHFraHFtb3d5d2xrbm11eXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjU5MjAsImV4cCI6MjA3OTQ0MTkyMH0.IVasVsHQWHprDwutBSlbG3B7bn5XxFhQHKGqY02Iu9s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
