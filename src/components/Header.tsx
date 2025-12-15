import { UserAvatar } from "./auth-ui/User";
import { ActivityIcon } from "lucide-react";

export function Header() {
  return (
    <nav className="flex items-center justify-between px-10 border-b">
      <div className="flex items-center justify-center gap-1">
        <ActivityIcon className="animate-pulse text-purple-500" />
        <span className="text-xs uppercase italic pt-0.5 text-purple-50/50">
          Updater
        </span>
      </div>
      <div>
        <UserAvatar />
      </div>
    </nav>
  );
}
