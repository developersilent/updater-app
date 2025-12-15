"use client";
import { LibraryBig, Notebook } from "lucide-react";
import { SubjectInfo } from "../subject-ui/Subject-Info";
import { UserSubjectCard } from "./User-Subject-Card";
import { useGetSubjectById } from "@/querys/use-subjects";

export function UserSubjects({ userId }: { userId: string }) {
  const cleanUserId = userId;
  const { subjects, isLoading } = useGetSubjectById(cleanUserId);
  const total_subjects = subjects?.length;
  return (
    <>
      {isLoading ? (
        <>
          <div className="flex items-center justify-center gap-2 w-full h-[70vh]">
            <LibraryBig className="size-6 text-green-500 animate-pulse" />
            <p className="text-sm text-slate-200/50">Loading subjects...</p>
          </div>
        </>
      ) : (
        <>
          {subjects && subjects.length > 0 ? (
            <div className="w-full h-full flex gap-3 flex-wrap md:flex-nowrap">
              <div className="w-[60%] flex flex-col gap-3 h-[450px] overflow-auto border-2 py-7 p-7 rounded-xl">
                {subjects.map((sub) => (
                  <UserSubjectCard
                    key={sub.id}
                    description={sub.description ?? "No description"}
                    title={sub.subject_name}
                    subjectId={sub.id}
                  />
                ))}
              </div>
              <div className="w-[40%] rounded-xl border-2 h-[450px] p-5">
                <SubjectInfo subject_count={total_subjects ?? 0} />
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center h-[500px]">
              <div className="text-sm text-foreground/60 flex items-center gap-2 justify-center">
                <Notebook className="size-10 text-blue-400 animate-pulse" />
                <span className="text-sm">No subjects found.</span>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
