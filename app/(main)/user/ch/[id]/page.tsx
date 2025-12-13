import { ToastError } from "@/components/auth-ui/Tost";
import { BackButton } from "@/components/ui/back-button";
import { UserChapterInfo } from "@/components/user-subject-ui/User-Chapter-Info";
import { api } from "@/lib/eden";
import { redirect } from "next/navigation";
import { Activity } from "react";

export default async function Page({ params, searchParams }: { 
    params: Promise<{ id: string }>,
    searchParams: Promise<{ name?: string, from?: string }>
}) {
    const { id } = await params;
    const { name } = await searchParams;
    const res = await api.chapter.all({subjectId: id}).get();
    console.log("User Subject Page - Fetched chapters response:", res);

    if (!res.response.ok || !res.data || res.data.error) {
        ToastError("Failed to fetch chapters. Please try again.");
        redirect("/");
    }

    const chapters = res.data.chapter_data;

    if (chapters.length === 0) {
        return <div className="p-8 w-full min-h-screen overflow-clip flex gap-5 items-center justify-center">
            <p className="font-semibold text-sm">No chapters found for this subject.</p>
        </div>;
    }
    return (
        <div className="flex flex-col gap-3">
            <nav className="w-full h-fit mt-7 p-2 rounded-xl flex items-center justify-between px-10">
              <div className="flex items-center gap-4">
                <BackButton />
                <h2 className="text-xl font-bold">{name}</h2>
              </div>
            </nav>
        <div className="w-full overflow-clip p-3 flex items-center justify-center">
          <Activity mode={chapters.length > 0 ? "visible" : "hidden"}>
            <UserChapterInfo data={chapters} />
          </Activity>
        </div>
        </div>
    );
}
