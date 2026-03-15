import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '../../../server/routers'

export const trpc = createTRPCReact<AppRouter>()

export function createTRPCClient() {
  // Use relative URL for API calls (proxied by Vite dev server)
  const apiUrl = '/api'
  
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${apiUrl}/trpc`,
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
