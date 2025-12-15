"use client";

import { CheckCheck, ListTodo, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface TodoCardProps {
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  todoId: string;
}

export function UserTodoCard({
  title,
  description,
  isCompleted,
  createdAt,
}: TodoCardProps) {
  return (
    <div
      className={cn(
        "p-5 border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-card/301",
        "flex items-center justify-between min-h-[110px]",
        isCompleted ? "bg-muted/30 opacity-75" : "bg-card/40",
      )}
    >
      <div className="flex-1">
        <div className="flex gap-2 items-center mb-2">
          <p
            className={cn(
              "text-sm font-semibold transition-all",
              isCompleted
                ? "line-through text-muted-foreground"
                : "text-foreground",
            )}
          >
            {title}
          </p>
          <ListTodo className="size-4 text-slate-400/50 animate-pulse" />
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {description}
        </p>
        <p className="text-xs text-muted-foreground/50">
          {createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-2 ml-4">
        {isCompleted ? (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-green-500/50 text-green-600"
            >
              <CheckCheck className="size-3 mr-1" />
              Completed
            </Badge>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-red-300/50 text-red-400 animate-pulse"
            >
              <X className="size-3 mr-1" />
              Incomplete Task
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
