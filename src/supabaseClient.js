import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oyxzajcawnadddsfohez.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eHphamNhd25hZGRkc2ZvaGV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMzk3MTMsImV4cCI6MjA2MTgxNTcxM30.keNEyYQ4q-fF4V9BgsBkGGLtJEGMbmGe2ZPSUTUubAk';

export const supabase = createClient(supabaseUrl, supabaseKey);
