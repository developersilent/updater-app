import { FileSymlink } from "lucide-react";
import Link from "next/link";

interface SubjectCardProps {
    title: string;
    description: string;
    subjectId: string;
}

export function UserSubjectCard({ title, description, subjectId }: SubjectCardProps) {
    return (
        <div className="p-5 border rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between h-[90px]">
            <div>
                <div className="flex gap-2 w-full">
                    <Link href={`/user/ch/${subjectId}/?name=${title}`} className="text-sm font-semibold mb-2 hover:text-rose-500/50 transition-all underline-offset-4 text-rose-500/90">
                        {title}
                    </Link>
                    <FileSymlink className="size-4 animate-pulse text-slate-400" />
                </div>
                <p className="text-xs text-gray-600 line-clamp-1 -mt-1">{description}</p>
            </div>
        </div>
    )
}