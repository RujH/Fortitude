import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto';

const supabaseUrl = "https://zhfvlsfnbujsyiouutjp.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoZnZsc2ZuYnVqc3lpb3V1dGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMTIyNzQsImV4cCI6MjA1NDc4ODI3NH0.3PRixolOGmJiiCOWWtyMCzytlV_wHau8t_-JtaNn_ak"


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Ensure it's false for React Native
  },
});