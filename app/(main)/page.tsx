import { UserAvatar } from "@/components/auth-ui/User";
import { SubjectPopupCreate } from "@/components/subject-ui/Subject-popup";
import { Subjects } from "@/components/subject-ui/Subjects";
import { getUser } from "@/lib/auth";
import { Activity } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getUser();
  if (!user?.userId || !user?.username) {
    redirect("/login");
  }
  return (
    <div className="w-full min-h-screen overflow-clip p-3">
      <nav className="w-full h-fit rounded-xl flex items-center justify-between px-10">
        <div className="flex h-full items-center justify-center rounded-md">
          <Activity className="size-6 text-purple-400 animate-pulse" />
        </div>
        <UserAvatar userName={user.username} />
      </nav>
      <div className="w-full h-auto p-4">
        <Subjects userId={user.userId} />
      </div>
       <div className="absolute bottom-6 right-10">
            <SubjectPopupCreate />
        </div>
    </div>
  )
}