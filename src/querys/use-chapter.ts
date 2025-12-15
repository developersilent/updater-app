import { ChaptersType } from "@/db/schema";
import { client } from "@/server/rpc/api.client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllChapters({ subjectId }: { subjectId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["all-chapters", subjectId],
    queryFn: async () => {
      const res = await client.chapter.getAllChaptersBySubject.$post({
        subjectId,
      });
      if (!res.ok) {
        throw new Error("Failed to fetch chapters");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch chapters");
      }
      return data.chapter_data;
    },
    enabled: !!subjectId,
  });
  return { chapters: data, isLoading };
}

export function useAddChapter() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["add-chapter"],
    mutationFn: async ({ input }: { input: ChaptersType }) => {
      const res = await client.chapter.addChapter.$post({
        chapterNumber: input.chapter_number,
        subjectId: input.subject_id,
        status: input.status || "NOT_STARTED",
        chapterTitle: input.chapter_name,
        compeleted_percentage: input.compeleted_percentage,
      });
      if (!res.ok) {
        throw new Error("Failed to add chapter");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to add chapter");
      }
      return data;
    },

    onSuccess: () => {
      // Automatically refetch chapters list
      queryClient.invalidateQueries({ queryKey: ["all-chapters"] });
    },
  });
  return { addChapter: mutateAsync, isAdding: isPending };
}

export function useUpdateChapter() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["update-chapter"],
    mutationFn: async ({ input }: { input: ChaptersType }) => {
      if (!input.id || !input.status || !input.chapter_number) {
        throw new Error("Chapter ID and status are required for update");
      }
      const res = await client.chapter.updateChapter.$post({
        chapterId: input.id || "",
        chapterNumber: input.chapter_number,
        subjectId: input.subject_id,
        status: input.status,
        chapterTitle: input.chapter_name,
        compeleted_percentage: input.compeleted_percentage,
      });
      if (!res.ok) {
        throw new Error("Failed to update chapter");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update chapter");
      }
      return data;
    },
    onSuccess: () => {
      // Automatically refetch chapters list
      queryClient.invalidateQueries({ queryKey: ["all-chapters"] });
    },
  });
  return { updateChapter: mutateAsync, isUpdating: isPending };
}

export function useDeleteChapter() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["delete-chapter"],
    mutationFn: async ({
      chapterId,
      subjectId,
    }: {
      chapterId: string;
      subjectId: string;
    }) => {
      const res = await client.chapter.deleteChapter.$post({
        chapterId,
        subjectId,
      });
      if (!res.ok) {
        throw new Error("Failed to delete chapter");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to delete chapter");
      }
      return data;
    },
    onSuccess: () => {
      // Automatically refetch chapters list
      queryClient.invalidateQueries({ queryKey: ["all-chapters"] });
    },
  });
  return { deleteChapter: mutateAsync, isDeleting: isPending };
}
