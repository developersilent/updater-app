import { client } from "@/server/rpc/api.client";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const response = await client.user.verifyAuth.$get();
        if (!response.ok) {
          return { success: false, user: null };
        }

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Expected JSON but got:", contentType);
          return { success: false, user: null };
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Auth query error:", error);
        // If error (e.g., network or JSON parse), return unauthenticated
        return { success: false, user: null };
      }
    },
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: false,
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
  return { data, isLoading, error };
}
