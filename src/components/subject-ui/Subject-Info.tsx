"use client";
import { useAuth } from "@/querys/use-auth";
import { useGetAllUsers } from "@/querys/use-user";
import { ListTodo, User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface SubjectInfoProps {
  subject_count: number;
}

export function SubjectInfo({ subject_count }: SubjectInfoProps) {
  const { users } = useGetAllUsers();
  const { data: user } = useAuth();
  const currentUserId =
    user?.success && user.user?.id ? String(user.user.id) : "";
  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="w-full flex items-center gap-3 border rounded-2xl px-5 py-3 bg-card/30">
        <h3 className="text-sm font-semibold text-gray-200/90">
          TOTAL SUBJECTS :{" "}
        </h3>
        <span className="px-1 text-orange-500 text-sm font-bold">
          {subject_count}
        </span>
      </div>
      <div className="w-full text-foreground/70 flex flex-col gap-3 rounded-2xl p-3 font-bold h-[90%] overflow-auto">
        {users && users.length > 0 ? (
          <>
            {users
              .sort((a, b) => {
                if (a.id === currentUserId) return -1;
                if (b.id === currentUserId) return 1;
                return 0;
              })
              .map((user) => (
                <>
                  <div
                    style={{
                      pointerEvents:
                        user.id === currentUserId ? "none" : "auto",
                      backgroundColor:
                        user.id === currentUserId ? "transparent" : "#0f0f0f",
                    }}
                    key={user.id}
                    className="flex items-center px-5 border py-1 rounded-xl"
                  >
                    <Link
                      href={`/user/${user.id}/?name=${user.username}`}
                      className="flex-1 flex items-center gap-2 py-2"
                    >
                      <User className="size-7 p-1 inline-block mr-2 text-foreground/70 bg-card rounded-full border-2" />
                      <p key={user.id} className="text-sm">
                        {user.username}
                        {user.id === currentUserId && " (You)"}
                      </p>
                    </Link>

                    {currentUserId !== user.id && (
                      <Button asChild variant={"outline"} size={"sm"}>
                        <Link href={`/todos/${user.id}/?name=${user.username}`}>
                          <ListTodo className="size-4 text-blue-500 animate-pulse" />
                          <p key={user.id} className="text-xs">
                            Todos
                          </p>
                        </Link>
                      </Button>
                    )}
                  </div>
                </>
              ))}
          </>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}
