import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://cvdbnxeqbirrdyfwrgso.supabase.co';
const supabaseAnonKey = 'sb_publishable_oh-OLBt29AfkWdhg5zIOrg_nf1cva3z';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-client-info': 'kido-dev-mobile',
    },
  },
  db: {
    schema: 'public',
  },
});
