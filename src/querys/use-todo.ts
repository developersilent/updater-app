import { client } from "@/server/rpc/api.client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllTodos() {
  const { data: todos, isLoading } = useQuery({
    queryKey: ["all-todos"],
    queryFn: async () => {
      const res = await client.todo.getAllTodos.$get();
      if (!res.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch todos");
      }
      return data.todos;
    },
  });
  return { todos, isLoading };
}

export function useUpdateTodoDetails() {
  const queryClient = useQueryClient();
  const { mutateAsync: updateTodoDetails, isPending } = useMutation({
    mutationKey: ["update-todo-details"],
    mutationFn: async (input: {
      todoId: string;
      title: string;
      description: string;
    }) => {
      const res = await client.todo.updateTodoDetails.$post(input);
      if (!res.ok) {
        throw new Error("Failed to update todo");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update todo");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-todos"] });
    },
  });
  return { updateTodoDetails, isUpdating: isPending };
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteTodo, isPending } = useMutation({
    mutationKey: ["delete-todo"],
    mutationFn: async (todoId: string) => {
      const res = await client.todo.deleteTodo.$post({ todoId });
      if (!res.ok) {
        throw new Error("Failed to delete todo");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to delete todo");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-todos"] });
    },
  });
  return { deleteTodo, isDeleting: isPending };
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  const { mutateAsync: createTodo, isPending } = useMutation({
    mutationKey: ["create-todo"],
    mutationFn: async (input: { title: string; description?: string }) => {
      const res = await client.todo.createTodo.$post(input);
      if (!res.ok) {
        throw new Error("Failed to create todo");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to create todo");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-todos"] });
    },
  });
  return { createTodo, isCreating: isPending };
}

export function useUpdateTodoStatus() {
  const queryClient = useQueryClient();
  const { mutateAsync: updateTodoStatus, isPending } = useMutation({
    mutationKey: ["update-todo-status"],
    mutationFn: async (input: { todoId: string; isCompleted: boolean }) => {
      const res = await client.todo.updateTodoStatus.$post(input);
      if (!res.ok) {
        throw new Error("Failed to update todo status");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update todo status");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-todos"] });
    },
  });
  return { updateTodoStatus, isUpdatingStatus: isPending };
}

export function useGetAllTodosByUserId(userId: string) {
  const { data: todos, isLoading } = useQuery({
    queryKey: ["user-todos", userId],
    queryFn: async () => {
      const res = await client.todo.getAllTodosByUserId.$post({ userId });
      if (!res.ok) {
        throw new Error("Failed to fetch user todos");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch user todos");
      }
      return data.todos;
    },
  });
  return { todos, isLoading };
}
