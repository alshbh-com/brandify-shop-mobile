// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hrnxwvjggvvvqfgsnags.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhybnh3dmpnZ3Z2dnFmZ3NuYWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3OTEwNDEsImV4cCI6MjA2NDM2NzA0MX0.00egB4ARvhPup_ON6u0_6TkC7mzMQDx-WGdOmeIMLsA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);