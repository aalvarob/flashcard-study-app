import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '../../../server/routers'

export const trpc = createTRPCReact<AppRouter>()

export function createTRPCClient() {
  const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000'
  
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${apiUrl}/api/trpc`,
        transformer: superjson,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          })
        },
      }),
    ],
  })
}
