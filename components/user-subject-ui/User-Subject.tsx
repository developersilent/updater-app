import { api } from "@/lib/eden";
import { Notebook } from "lucide-react";
import { SubjectInfo } from "../subject-ui/Subject-Info";
import { UserSubjectCard } from "./User-Subject-Card";


export async function UserSubjects({ userId }: { userId: string }) {
    const cleanUserId = userId.trim();
    const allSubjects = await api.subject.all({ userId: cleanUserId }).get();
    const total_subjects = allSubjects.data?.subjects?.length;
    return <>
        {allSubjects.data?.subjects && allSubjects.data.subjects.length > 0 ? (
            <div className="w-full h-full flex gap-3 flex-wrap md:flex-nowrap">
                <div className="w-[60%] flex flex-col gap-3 mt-3 h-[500px] overflow-auto border-2 py-7 p-7 rounded-xl">
                    {allSubjects.data.subjects.map((subject) => (
                        <UserSubjectCard
                            key={subject.id}
                            description={subject.description ?? "No description"}
                            title={subject.subject_name}
                            subjectId={subject.id}
                        />
                    ))}
                </div>
                <div className="w-[40%] rounded-xl border-2 mt-3 p-5">
                    <SubjectInfo subject_count={total_subjects ?? 0} userId={userId} />
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
    </>;
}