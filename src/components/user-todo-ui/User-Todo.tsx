"use client";
import { Loader2, ListCheck } from "lucide-react";
import { Badge } from "../ui/badge";
import { useGetAllTodosByUserId } from "@/querys/use-todo";
import { UserTodoCard } from "./User-Todo-card";

export function UserTodos({ userId }: { userId: string }) {
  const { todos, isLoading } = useGetAllTodosByUserId(userId.trim());

  const activeTodos = todos?.filter((todo) => !todo.isCompleted) ?? [];
  const completedTodos = todos?.filter((todo) => todo.isCompleted) ?? [];

  return (
    <>
      {isLoading ? (
        <div className="w-full flex items-center justify-center h-[85vh]">
          <Loader2 className="size-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <div className="flex justify-center w-full h-[85vh] p-5 gap-5">
          <>
            {todos && todos.length > 0 ? (
              <>
                {/* Active Todos */}
                {todos && todos.length > 0 && (
                  <div className="w-full flex-1 border-2 rounded-xl p-7 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 shrink-0">
                      <h3 className="text-lg font-semibold">Today's Tasks</h3>
                      <Badge variant="secondary">{activeTodos.length}</Badge>
                    </div>
                    <div className="space-y-3 overflow-auto flex-1 pr-2">
                      {activeTodos.length === 0 ? (
                        <div className="w-full h-full grid place-content-center">
                          {completedTodos.length === 0 ? (
                            <div>
                              <p>
                                No tasks found. Create your first task to get
                                started!
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <ListCheck className="size-6 text-green-500 animate-pulse" />
                              <p className="text-sm text-slate-200/50">
                                All tasks completed for today! Great job!
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          {activeTodos.length > 0 &&
                            activeTodos.map((todo) => (
                              <UserTodoCard
                                todoId={todo.id}
                                key={todo.id}
                                title={todo.title}
                                description={
                                  todo.description ?? "No description"
                                }
                                isCompleted={todo.isCompleted}
                                createdAt={
                                  todo.createdAt
                                    ? new Date(todo.createdAt)
                                    : new Date()
                                }
                              />
                            ))}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Completed Todos */}
                <div className="w-full flex-1 border-2 rounded-xl p-7 flex flex-col">
                  <div className="flex items-center gap-2 mb-4 shrink-0">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      Completed
                    </h3>
                    <Badge variant="outline" className="border-green-500/50">
                      {completedTodos.length}
                    </Badge>
                  </div>
                  <div className="space-y-3 overflow-auto flex-1 pr-2">
                    {completedTodos.length === 0 ? (
                      <div className="w-full h-full grid place-content-center">
                        {activeTodos.length === 0 ? (
                          <div className="flex items-center justify-center gap-2">
                            <ListCheck className="size-6 text-orange-400 animate-pulse" />
                            <p className="text-sm text-slate-200/50">Hmmm</p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <ListCheck className="size-6 text-orange-400 animate-pulse" />
                            <p className="text-sm text-slate-200/50">
                              No tasks completed yet. Keep going!
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {completedTodos.map((todo) => (
                          <UserTodoCard
                            todoId={todo.id}
                            key={todo.id}
                            title={todo.title}
                            description={todo.description ?? "No description"}
                            isCompleted={todo.isCompleted}
                            createdAt={
                              todo.createdAt
                                ? new Date(todo.createdAt)
                                : new Date()
                            }
                          />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Empty State */}
                <div className="text-center py-12 text-muted-foreground flex items-center justify-center w-full">
                  <ListCheck className="size-8 mr-2 text-purple-500 animate-pulse" />
                  <p className="text-sm">
                    No todos yet. Create your first one to get started!
                  </p>
                </div>
              </>
            )}
          </>
        </div>
      )}
    </>
  );
}
