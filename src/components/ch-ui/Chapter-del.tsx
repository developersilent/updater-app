"use client";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { ToastError, ToastSuccess } from "../auth-ui/Tost";
import { useDeleteChapter } from "@/querys/use-chapter";

export function ChapterDel({
  chapterId,
  subject_id,
}: {
  chapterId: string;
  subject_id: string;
}) {
  const { deleteChapter, isDeleting } = useDeleteChapter();
  const handleDelete = async () => {
    const res = await deleteChapter({ chapterId, subjectId: subject_id });
    if (!res.success) {
      ToastError(res.message || "Failed to delete chapter");
      return;
    }
    ToastSuccess(res.message || "Chapter deleted successfully");
  };
  return (
    <>
      <Button
        disabled={isDeleting}
        onClick={handleDelete}
        variant="ghost"
        size="sm"
        className="border cursor-pointer"
      >
        <Trash className="text-red-400 size-4" />
      </Button>
    </>
  );
}
