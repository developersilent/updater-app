"use client";
import { ToastError, ToastSuccess } from "@/components/auth-ui/Tost";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/eden";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";


export function LogoutButton() {
  const handleSubmit = async () => {
    const res = await api.auth.logout.post();
    if (!res.response.ok) {
      ToastError(res.data?.message || "Logout failed. Please try again.");
      return;
    }
    if (res.data?.error) {
      ToastError(res.data?.message || "Logout failed. Please try again.");
      return;
    }
    ToastSuccess(res.data?.message || "Logout successful!");
    redirect("/login");
  }
  return (
    <div>
      <Button onClick={handleSubmit} className="flex cursor-pointer items-center justify-center" size={"sm"} variant={"outline"}>
        <LogOut className="size-4 text-red-400" />
        <span className="text-xs">Logout</span>
      </Button>
    </div>
  );
}
