"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertCircle, Book, Edit, ListCheck, ListPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useCreateTodo, useUpdateTodoDetails } from "@/querys/use-todo";
import { ToastError, ToastSuccess } from "../auth-ui/Tost";

const todoSchema = z.object({
  todoId: z.string().optional(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

type TodoSchema = z.infer<typeof todoSchema>;

export function TodoPopupEdit({
  todoId,
  title,
  description,
}: TodoSchema & { todoId: string }) {
  const [open, setOpen] = useState(false);
  const { updateTodoDetails } = useUpdateTodoDetails();
  const rhf = useForm<TodoSchema>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      todoId,
      title,
      description,
    },
  });

  useEffect(() => {
    if (open) {
      rhf.reset({
        todoId,
        title,
        description,
      });
    }
  }, [open, todoId, title, description, rhf]);
  const handleSubmit = async (data: TodoSchema) => {
    const res = await updateTodoDetails({
      todoId: data.todoId!,
      title: data.title,
      description: data.description?.trim() || "No description.",
    });
    if (!res.success) {
      ToastError(res.message || "Failed to update todo");
      return;
    }
    ToastSuccess(res.message || "Todo updated successfully");
    rhf.reset();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="border cursor-pointer">
          <Edit className="text-purple-400 size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Book className="size-5 text-purple-400 animate-pulse" />{" "}
            <span className="align-middle ml-2 text-sm">Editing Subject</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Fill the form below to update the subject.
          </DialogDescription>
        </DialogHeader>
        <Form {...rhf}>
          <form onSubmit={rhf.handleSubmit(handleSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={rhf.control}
                name="title"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="name"
                          type="text"
                          autoFocus
                          autoComplete="off"
                          placeholder="Todo Title"
                          className={`max-sm:h-10 px-5 py-5 rounded-xl pr-[10%] focus-visible:ring-1 text-xs placeholder:text-xs transition-all duration-300 ${formState.errors.title ? "pr-9.5 focus-visible:ring-ring/75" : null}`}
                          {...field}
                        />
                        {formState.errors.title && (
                          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 grid h-full w-[10%] place-content-center rounded-full">
                            <AlertCircle size={15} className="text-rose-600" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="px-2 text-[10.6px] text-rose-500 transition-opacity duration-200 ease-in-out" />
                  </FormItem>
                )}
              />

              <FormField
                control={rhf.control}
                name="description"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="description"
                          type="text"
                          autoFocus
                          autoComplete="off"
                          placeholder="Subject Description"
                          className={`max-sm:h-10 px-5 py-5 rounded-xl pr-[10%] focus-visible:ring-1 text-xs placeholder:text-xs transition-all duration-300 ${formState.errors.description ? "pr-9.5 focus-visible:ring-ring/75" : null}`}
                          {...field}
                        />
                        {formState.errors.description && (
                          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 grid h-full w-[10%] place-content-center rounded-full">
                            <AlertCircle size={15} className="text-rose-600" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="px-2 text-[10.6px] text-rose-500 transition-opacity duration-200 ease-in-out" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-7 flex gap-2">
              <DialogClose
                onClick={() => {
                  rhf.reset();
                }}
                asChild
                className="px-7 rounded-xl"
              >
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="px-10 rounded-xl cursor-pointer">
                {rhf.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function TodoPopupCreate() {
  const [open, setOpen] = useState(false);
  const { createTodo } = useCreateTodo();
  const rhf = useForm<TodoSchema>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const handleSubmit = async (data: TodoSchema) => {
    const res = await createTodo({
      title: data.title,
      description: data.description?.trim() || "No description.",
    });
    if (!res.success) {
      ToastError(res.message || "Failed to create todo");
      return;
    }
    ToastSuccess(res.message || "Todo created successfully");
    rhf.reset();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="lg" className="border cursor-pointer">
          <ListPlus className="text-purple-400 size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ListCheck className="size-7 text-purple-400 animate-pulse" />{" "}
            <span className="align-middle ml-2 text-sm">Create New Todo</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Fill the form below to create a new todo.
          </DialogDescription>
        </DialogHeader>
        <Form {...rhf}>
          <form onSubmit={rhf.handleSubmit(handleSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={rhf.control}
                name="title"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="name"
                          type="text"
                          autoFocus
                          autoComplete="off"
                          placeholder="Todo Title"
                          className={`max-sm:h-10 px-5 py-5 rounded-xl pr-[10%] focus-visible:ring-1 text-xs placeholder:text-xs transition-all duration-300 ${formState.errors.title ? "pr-9.5 focus-visible:ring-ring/75" : null}`}
                          {...field}
                        />
                        {formState.errors.title && (
                          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 grid h-full w-[10%] place-content-center rounded-full">
                            <AlertCircle size={15} className="text-rose-600" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="px-2 text-[10.6px] text-rose-500 transition-opacity duration-200 ease-in-out" />
                  </FormItem>
                )}
              />

              <FormField
                control={rhf.control}
                name="description"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="description"
                          type="text"
                          autoFocus
                          autoComplete="off"
                          placeholder="Todo Description"
                          className={`max-sm:h-10 px-5 py-5 rounded-xl pr-[10%] focus-visible:ring-1 text-xs placeholder:text-xs transition-all duration-300 ${formState.errors.description ? "pr-9.5 focus-visible:ring-ring/75" : null}`}
                          {...field}
                        />
                        {formState.errors.description && (
                          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 grid h-full w-[10%] place-content-center rounded-full">
                            <AlertCircle size={15} className="text-rose-600" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="px-2 text-[10.6px] text-rose-500 transition-opacity duration-200 ease-in-out" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-7 flex gap-2">
              <DialogClose
                onClick={() => {
                  rhf.reset();
                }}
                asChild
                className="px-7 rounded-xl"
              >
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="px-10 rounded-xl cursor-pointer">
                {rhf.formState.isSubmitting ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
