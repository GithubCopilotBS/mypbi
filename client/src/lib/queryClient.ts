import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Modified for pure client-side operation (GitHub Pages compatible)
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // For GitHub Pages: Mock API responses since we have a client-only app
  console.log(`API Request: ${method} ${url}`, data);
  
  // Create a mock successful response
  const mockResponse = new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
  
  return mockResponse;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn = <T,>(options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T> => 
  async ({ queryKey }) => {
    // For GitHub Pages: Instead of making server requests, we'll return mock data
    console.log(`Query request for: ${queryKey[0]}`);
    
    // Return empty data since our app doesn't actually use server data
    return {} as unknown as T;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Using a dummy query function that doesn't make actual network requests
      queryFn: () => Promise.resolve({}) as any,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
