"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "./Logout";
import { useAuth } from "@/querys/use-auth";

export function UserAvatar() {
  const { data: user } = useAuth();

  const username =
    user?.success && user.user?.username ? String(user.user.username) : "User";

  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="flex flex-row flex-wrap items-center gap-1 p-2 px-5">
      <Avatar>
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
      <span className="text-xs pr-3 text-purple-300">{username}</span>
      <LogoutButton />
    </div>
  );
}
