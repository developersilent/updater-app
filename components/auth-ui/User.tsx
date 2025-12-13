import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { LogoutButton } from "./Logout"

export function UserAvatar({userName}: {userName: string}) {
  return (
    <div className="flex flex-row flex-wrap items-center gap-1 p-2 px-5">
      <Avatar>
        <AvatarFallback>{userName.split(" ").map(name => name[0]).join("")}</AvatarFallback>
      </Avatar>
        <span className="text-xs pr-3 text-purple-300">{userName}</span>
      <LogoutButton/>
    </div>
  )
}
