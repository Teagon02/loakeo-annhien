import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// Server-side client for write operations
// This should only be used in API routes or server components
export const serverWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Must be false for write operations
  token: process.env.SANITY_API_WRITE_TOKEN, // Server-side token (not exposed to client)
})

