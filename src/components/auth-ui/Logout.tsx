"use client";
import { ToastError, ToastSuccess } from "@/components/auth-ui/Tost";
import { Button } from "@/components/ui/button";
import { client } from "@/server/rpc/api.client";
import { Home, ListTodo, LogOut } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { SubjectPopupCreate } from "../subject-ui/Subject-popup";
import { TodoPopupCreate } from "../todo-ui/Todo-popup";
import { ChapterPopupCreate } from "../ch-ui/Chapter-popup-create";

export function LogoutButton() {
  const pathname = usePathname();

  const isSubjectPage = pathname.startsWith("/subject/");
  const subjectId = isSubjectPage ? pathname.split("/")[2] : null;
  const handleSubmit = async () => {
    const res = await client.user.logOut.$post();
    if (!res.ok) {
      ToastError("Logout Failed");
      return;
    }
    const data = await res.json();
    if (!data.success) {
      ToastError(data.message || "Logout Failed");
      return;
    }
    ToastSuccess(data.message || "Logout Successful");
    redirect("/login");
  };
  return (
    <div className="w-fit flex items-center justify-center gap-3">
      <Button
        onClick={handleSubmit}
        className="flex cursor-pointer items-center justify-center"
        size={"sm"}
        variant={"outline"}
      >
        <LogOut className="size-4 text-red-400" />
        <span className="text-xs">Logout</span>
      </Button>
      {pathname === "/todos" ? (
        <>
          <Button
            asChild
            className="flex cursor-pointer items-center justify-center"
            size={"sm"}
            variant={"outline"}
          >
            <Link href="/">
              <Home className="size-4 text-indigo-500" />
              <span className="text-xs">Home</span>
            </Link>
          </Button>
          <TodoPopupCreate />
        </>
      ) : isSubjectPage && subjectId ? (
        <>
          <Button
            asChild
            className="flex cursor-pointer items-center justify-center"
            size={"sm"}
            variant={"outline"}
          >
            <Link href="/">
              <Home className="size-4 text-indigo-500" />
              <span className="text-xs">Home</span>
            </Link>
          </Button>
          <ChapterPopupCreate subjectId={subjectId} />
        </>
      ) : (
        <>
          <Button
            asChild
            className="flex cursor-pointer items-center justify-center"
            size={"sm"}
            variant={"outline"}
          >
            <Link href="/todos">
              <ListTodo className="size-4 text-indigo-500" />
              <span className="text-xs">Todos</span>
            </Link>
          </Button>
          <SubjectPopupCreate />
        </>
      )}
    </div>
  );
}
