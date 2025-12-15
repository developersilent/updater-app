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
import { AlertCircle, Book, Edit, FilePlus } from "lucide-react";
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
import { ToastError, ToastSuccess } from "../auth-ui/Tost";
import { useState, useEffect } from "react";
import { useCreateSubject, useUpdateSubject } from "@/querys/use-subjects";

const subjectSchema = z.object({
  subjectId: z.string().optional(),
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
});

type SubjectSchema = z.infer<typeof subjectSchema>;

export function SubjectPopupEdit({
  subjectId,
  name,
  description,
}: SubjectSchema & { subjectId: string }) {
  const [open, setOpen] = useState(false);
  const { updateSubject } = useUpdateSubject();
  const rhf = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      subjectId,
      name,
      description,
    },
  });

  useEffect(() => {
    if (open) {
      rhf.reset({
        subjectId,
        name,
        description,
      });
    }
  }, [open, subjectId, name, description, rhf]);

  const handleSubmit = async (data: SubjectSchema) => {
    const res = await updateSubject({
      subjectId: subjectId!,
      subjectName: data.name,
      description: data.description,
    });
    if (!res.success) {
      ToastError(res.message || "Failed to update subject");
      return;
    }
    ToastSuccess(res.message || "Subject updated successfully");
    rhf.reset();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="lg" className="border cursor-pointer">
          <Edit className="text-purple-400 size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Book className="size-7 text-purple-400 animate-pulse" />{" "}
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
                name="name"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="name"
                          type="text"
                          autoFocus
                          autoComplete="off"
                          placeholder="Subject Name"
                          className={`max-sm:h-10 px-5 py-5 rounded-xl pr-[10%] focus-visible:ring-1 text-xs placeholder:text-xs transition-all duration-300 ${formState.errors.name ? "pr-9.5 focus-visible:ring-ring/75" : null}`}
                          {...field}
                        />
                        {formState.errors.name && (
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

export function SubjectPopupCreate() {
  const [open, setOpen] = useState(false);
  const { createSubject } = useCreateSubject();
  const rhf = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const handleSubmit = async (data: SubjectSchema) => {
    const res = await createSubject({
      subjectName: data.name,
      description: data.description ?? "No description.",
    });
    if (!res.success) {
      ToastError(res.message || "Failed to create subject");
      return;
    }
    ToastSuccess(res.message || "Subject created successfully");
    rhf.reset();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="lg" className="border cursor-pointer">
          <FilePlus className="text-purple-400 size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Book className="size-7 text-purple-400 animate-pulse" />{" "}
            <span className="align-middle ml-2 text-sm">
              Create New Subject
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Fill the form below to create a new subject.
          </DialogDescription>
        </DialogHeader>
        <Form {...rhf}>
          <form onSubmit={rhf.handleSubmit(handleSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={rhf.control}
                name="name"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="name"
                          type="text"
                          autoFocus
                          autoComplete="off"
                          placeholder="Subject Name"
                          className={`max-sm:h-10 px-5 py-5 rounded-xl pr-[10%] focus-visible:ring-1 text-xs placeholder:text-xs transition-all duration-300 ${formState.errors.name ? "pr-9.5 focus-visible:ring-ring/75" : null}`}
                          {...field}
                        />
                        {formState.errors.name && (
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
                {rhf.formState.isSubmitting ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
