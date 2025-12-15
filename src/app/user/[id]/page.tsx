import { Button } from "@/components/ui/button";
import { UserSubjects } from "@/components/user-subject-ui/User-Subject";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { id } = await params;
  const { name } = await searchParams;
  return (
    <div className="w-full min-h-screen overflow-clip px-7 py-2">
      <nav className="w-full">
        <div className="flex h-full items-center rounded-md">
          <Link href={`/`}>
            <Button size={"sm"} variant={"outline"} className="cursor-pointer">
              <ChevronLeft />
            </Button>
          </Link>
          <h2 className="text-sm font-bold text-purple-500 border m-3 pr-5 py-1 rounded-xl bg-card/50">
            <span className="text-base px-3 text-blue-200">Username :</span>
            {name ? `${name}` : "User's Subjects"}
          </h2>
        </div>
      </nav>
      <div className="w-full h-auto flex items-center justify-center mt-3">
        <UserSubjects userId={id} />
      </div>
    </div>
  );
}
