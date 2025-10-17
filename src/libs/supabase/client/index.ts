import { createBrowserClient } from '@supabase/ssr'

import type { Database } from '../database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAPIKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY as string

const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAPIKey)

export default supabase
