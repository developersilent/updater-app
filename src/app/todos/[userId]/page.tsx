import { BackButton } from "@/components/ui/back-button";
import { UserTodos } from "@/components/user-todo-ui/User-Todo";
import { ListCheck } from "lucide-react";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { userId } = await params;
  const { name } = await searchParams;

  return (
    <div className="">
      <div className="w-full p-4 flex items-center border-b pl-10">
        <BackButton />
        <ListCheck className="inline size-5 text-blue-500 animate-pulse ml-5 mr-2" />
        <span className="align-middle">{name || "User"}</span>
      </div>
      <UserTodos userId={userId} />
    </div>
  );
}
