"use client";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { api } from "@/lib/eden";
import { ToastError, ToastSuccess } from "../auth-ui/Tost";
import { useRouter } from "next/navigation";

export function ChapterDel({ chapterId, subject_id }: {
    chapterId: string;
    subject_id: string;
}) {
    const router = useRouter();
    const deleteChapter = async () => {
        const res = await api.chapter.del({ chapterId }).delete({ subject_id });
        if (!res.response.ok || res.data?.error) {
            ToastError(res.data?.message || "Failed to delete chapter. Please try again.");
            return;
        }
        ToastSuccess(res.data?.message || "Chapter deleted successfully!");
        router.refresh();
    }
    return (
        <>
            <Button
                onClick={deleteChapter}
                variant="ghost" size="icon" className="border cursor-pointer">
                <Trash className="text-red-400 size-5" />
            </Button>
        </>
    )
}