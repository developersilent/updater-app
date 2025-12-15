"use client";

import { FileSymlink, Trash } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { SubjectPopupEdit } from "./Subject-popup";
import { ToastError, ToastSuccess } from "../auth-ui/Tost";
import { useDeleteSubject } from "@/querys/use-subjects";

interface SubjectCardProps {
  title: string;
  description: string;
  subjectId: string;
}

export function SubjectCard({
  title,
  description,
  subjectId,
}: SubjectCardProps) {
  const { deleteSubject } = useDeleteSubject();
  const handleDeleteSubject = async () => {
    const res = await deleteSubject(subjectId);
    if (res.success) {
      ToastSuccess(res.message);
    } else {
      ToastError(res.message);
    }
  };
  return (
    <div className="p-5 border rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between h-[110px]">
      <div>
        <div className="flex gap-2 w-full">
          <Link
            href={`/subject/${subjectId}/?name=${title}`}
            className="text-sm font-semibold mb-2 hover:text-rose-500/50 transition-all underline-offset-4 text-rose-500/90"
          >
            {title}
          </Link>
          <FileSymlink className="size-4 animate-pulse text-slate-400" />
        </div>

        <p className="text-xs text-gray-600 line-clamp-1 -mt-1">
          {description}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <SubjectPopupEdit
          name={title}
          description={description}
          subjectId={subjectId}
        />
        <Button
          variant="ghost"
          size="icon"
          className="border cursor-pointer"
          onClick={handleDeleteSubject}
        >
          <Trash className="text-red-400 size-5" />
        </Button>
      </div>
    </div>
  );
}
