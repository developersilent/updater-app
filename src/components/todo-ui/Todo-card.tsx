"use client";

import { Check, CheckCheck, ListTodo, Undo, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { useDeleteTodo, useUpdateTodoStatus } from "@/querys/use-todo";
import { ToastError, ToastSuccess } from "../auth-ui/Tost";
import { TodoPopupEdit } from "./Todo-popup";

interface TodoCardProps {
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  todoId: string;
}

export function TodoCard({
  title,
  description,
  todoId,
  isCompleted,
  createdAt,
}: TodoCardProps) {
  const { deleteTodo, isDeleting } = useDeleteTodo();
  const { updateTodoStatus, isUpdatingStatus } = useUpdateTodoStatus();

  const handleDelete = async () => {
    const res = await deleteTodo(todoId);
    if (!res.success) {
      ToastError(res.message || "Failed to delete todo");
      return;
    }
    ToastSuccess(res.message || "Todo deleted successfully");
  };

  const handleMarkComplete = async () => {
    const res = await updateTodoStatus({ todoId, isCompleted: true });
    if (!res.success) {
      ToastError(res.message || "Failed to update todo status");
      return;
    }
    ToastSuccess(res.message || "Todo marked as completed");
  };

  const handleTodoUndo = async () => {
    const res = await updateTodoStatus({ todoId, isCompleted: false });
    if (!res.success) {
      ToastError(res.message || "Failed to update todo status");
      return;
    }
    ToastSuccess(res.message || "Todo marked as completed");
  };
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
            <Button
              onClick={handleTodoUndo}
              disabled={isDeleting || isUpdatingStatus}
              variant="ghost"
              size="icon"
              className="border hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <Undo className="text-blue-400 size-4" />
            </Button>
          </div>
        ) : (
          <>
            <Button
              onClick={handleDelete}
              disabled={isDeleting || isUpdatingStatus}
              variant="ghost"
              size="icon"
              className="border hover:border-red-400 hover:bg-red-50 transition-colors"
            >
              <X className="text-red-400 size-4" />
            </Button>
            <TodoPopupEdit
              todoId={todoId}
              title={title}
              description={description}
            />
            <Button
              disabled={isDeleting || isUpdatingStatus}
              onClick={handleMarkComplete}
              variant="ghost"
              size="icon"
              className="border hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              <Check className="text-green-400 size-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
