"use client";
import { SubjectCard } from "./Subject-Card";
import { Loader2, Notebook } from "lucide-react";
import { useGetUserSubjects } from "@/querys/use-subjects";
import { SubjectInfo } from "./Subject-Info";

export function Subjects() {
  const { subjects, isLoading } = useGetUserSubjects();
  return (
    <>
      {isLoading ? (
        <div className="w-full flex items-center justify-center h-[90vh]">
          <Loader2 className="size-7 text-blue-400 animate-spin" />
        </div>
      ) : (
        <>
          {subjects && subjects.length > 0 ? (
            <div className="max-w-6xl w-full flex gap-3 flex-wrap md:flex-nowrap">
              <div className="flex-3 flex flex-col gap-3 h-112.5 overflow-auto border-2 py-7 p-7 rounded-xl">
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    description={subject.description ?? "No description"}
                    title={subject.subject_name}
                    subjectId={subject.id}
                  />
                ))}
              </div>
              <div className="flex-[2] rounded-xl border-2 p-5 h-[450px]">
                <SubjectInfo subject_count={subjects.length ?? 0} />
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center h-[500px]">
              <div className="text-sm text-foreground/60 flex items-center gap-2 justify-center">
                <Notebook className="size-10 text-blue-400 animate-pulse" />
                <span className="text-sm">
                  No subjects found. Create your first subject to get started!
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
