import { api } from "@/lib/eden";
import { getUser } from "@/lib/auth";
import { User } from "lucide-react";
import Link from "next/link";


interface SubjectInfoProps {
    subject_count: number;
    userId: string;
}

export async function SubjectInfo({ subject_count }: SubjectInfoProps) {
    const users = await api.auth.all.get();
    const currentUser = await getUser();
    const currentUserId = currentUser?.userId;
    return (
        <div className="w-full h-full flex flex-col gap-3">
            <div className="w-full flex items-center gap-3 border rounded-2xl px-5 py-3 bg-card/30">
                <h3 className="text-sm font-semibold text-gray-200/90">
                    TOTAL SUBJECTS : </h3>
                <span className="px-1 text-orange-500 text-sm font-bold">{subject_count}</span>
            </div>
            <div className="w-full text-foreground/70 flex flex-col gap-3 rounded-2xl p-3 font-bold h-[90%] overflow-auto">
                {users.data && users.data.users.length > 0 ? (
                    <>
                    {users.data.users
                        .sort((a, b) => {
                            if (a.id === currentUserId) return -1;
                            if (b.id === currentUserId) return 1;
                            return 0;
                        })
                        .map((user) => (
                        <Link 
                        style={{
                            pointerEvents: user.id === currentUserId ? "none" : "auto",
                            backgroundColor: user.id === currentUserId ? "transparent" : "#0f0f0f",
                        }}
                        href={`/user/${user.id}/?name=${user.username}`} key={user.id} className="text-sm border h-fit px-5 py-3 w-full rounded-xl bg-card/80 underline hover:text-blue-400 flex items-center">
                            <User className="size-7 p-1 inline-block mr-2 text-foreground/70 bg-card rounded-full border-2" />
                            <p key={user.id} className="text-sm">
                                {user.username}
                                {user.id === currentUserId && " (You)"}
                            </p>
                        </Link>
                    ))}
                    </>
                ): (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    )
}