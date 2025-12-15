import { client } from "@/server/rpc/api.client";
import { useQuery } from "@tanstack/react-query";

export function useGetAllUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await client.user.allUser.$get();
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch users");
      }
      return data.users;
    },
  });
  return { users: data, isLoading, error };
}
