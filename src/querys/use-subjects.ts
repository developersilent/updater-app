import { client } from "@/server/rpc/api.client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetUserSubjects() {
  const { data, isLoading } = useQuery({
    queryKey: ["user-subjects"],
    queryFn: async () => {
      const res = await client.subject.getUserSubjects.$get();
      if (!res.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch subjects");
      }
      return data.subjects;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
  return { subjects: data, isLoading };
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["delete-subject"],
    mutationFn: async (subjectId: string) => {
      const res = await client.subject.deleteSubject.$post({ subjectId });
      if (!res.ok) {
        throw new Error("Failed to delete subject");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to delete subject");
      }
      return data;
    },
    onSuccess: () => {
      // Automatically refetch subjects list
      queryClient.invalidateQueries({ queryKey: ["user-subjects"] });
    },
  });
  return { deleteSubject: mutateAsync, isDeleting: isPending };
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["update-subject"],
    mutationFn: async (input: {
      subjectId: string;
      subjectName: string;
      description?: string;
    }) => {
      const res = await client.subject.updateSubjectData.$post(input);
      if (!res.ok) {
        throw new Error("Failed to update subject");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update subject");
      }
      return data;
    },
    onSuccess: () => {
      // Automatically refetch subjects list
      queryClient.invalidateQueries({ queryKey: ["user-subjects"] });
    },
  });
  return { updateSubject: mutateAsync, isUpdating: isPending };
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-subject"],
    mutationFn: async (input: {
      subjectName: string;
      description?: string;
    }) => {
      const res = await client.subject.addNewSubject.$post(input);
      if (!res.ok) {
        throw new Error("Failed to create subject");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to create subject");
      }
      return data;
    },
    onSuccess: () => {
      // Automatically refetch subjects list
      queryClient.invalidateQueries({ queryKey: ["user-subjects"] });
    },
  });
  return { createSubject: mutateAsync, isCreating: isPending };
}

export function useGetSubjectById(userId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["subject-by-id", userId],
    queryFn: async () => {
      const res = await client.subject.getSubjectsByUserId.$post({
        userId: userId,
      });
      if (!res.ok) {
        throw new Error("Failed to fetch subject");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch subject");
      }
      return data.subjects;
    },
  });
  return { subjects: data, isLoading };
}
