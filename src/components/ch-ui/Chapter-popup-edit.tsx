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
import { AlertCircle, Book, NotebookPen } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastError, ToastSuccess } from "../auth-ui/Tost";
import { useState, useEffect } from "react";
import { useUpdateChapter } from "@/querys/use-chapter";

const chapterSchema = z.object({
  chapter_name: z.string().min(1, "Chapter name is required").max(100),
  chapter_number: z.string().min(1, "Chapter number is required"),
  status: z
    .enum(["COMPLETED", "DOING_IT_CURRENTLY", "NOT_STARTED"] as const)
    .optional()
    .default("NOT_STARTED"),
  compeleted_percentage: z.string().optional().default("0%"),
});

type ChapterInput = z.input<typeof chapterSchema>;

export function ChapterPopupEdit(
  props: ChapterInput & { subjectId: string; chapterId: string },
) {
  const { updateChapter } = useUpdateChapter();
  const {
    subjectId,
    chapter_name,
    chapter_number,
    compeleted_percentage,
    status,
    chapterId,
  } = props;
  const [open, setOpen] = useState(false);
  const rhf = useForm<ChapterInput>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      chapter_name,
      chapter_number,
      compeleted_percentage,
      status,
    },
  });

  useEffect(() => {
    if (open) {
      rhf.reset({
        chapter_name,
        chapter_number,
        compeleted_percentage,
        status,
      });
    }
  }, [open, chapter_name, chapter_number, compeleted_percentage, status, rhf]);

  const handleSubmit = async (data: ChapterInput) => {
    const res = await updateChapter({
      input: {
        id: chapterId,
        subject_id: subjectId,
        chapter_name: data.chapter_name,
        chapter_number: data.chapter_number,
        status: data.status,
        compeleted_percentage: data.compeleted_percentage,
      },
    });
    if (!res.success) {
      ToastError(res.message || "Failed to update chapter. Please try again.");
      return;
    }
    ToastSuccess(res.message || "Chapter updated successfully!");
    setOpen(false);
    rhf.reset();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="border cursor-pointer">
          <NotebookPen className="text-purple-400 size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Book className="size-7 text-purple-400 animate-pulse" />{" "}
            <span className="align-middle ml-2 text-sm">Editing Chapter</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Fill the form below to update the chapter.
          </DialogDescription>
        </DialogHeader>
        <Form {...rhf}>
          <form onSubmit={rhf.handleSubmit(handleSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={rhf.control}
                name="chapter_name"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="chapter_name"
                          type="text"
                          autoFocus
                          autoComplete="off"
                          placeholder="Chapter Name"
                          className={`max-sm:h-10 px-5 py-5 rounded-xl pr-[10%] focus-visible:ring-1 text-xs placeholder:text-xs transition-all duration-300 ${formState.errors.chapter_name ? "pr-9.5 focus-visible:ring-ring/75" : null}`}
                          {...field}
                        />
                        {formState.errors.chapter_name && (
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
                name="chapter_number"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="chapter_number"
                          type="text"
                          autoComplete="off"
                          placeholder="Chapter Number"
                          className={`max-sm:h-10 px-5 py-5 rounded-xl pr-[10%] focus-visible:ring-1 text-xs placeholder:text-xs transition-all duration-300 ${formState.errors.chapter_number ? "pr-9.5 focus-visible:ring-ring/75" : null}`}
                          {...field}
                        />
                        {formState.errors.chapter_number && (
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
                name="compeleted_percentage"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="compeleted_percentage"
                          type="text"
                          autoComplete="off"
                          placeholder="Completed Percentage (e.g., 50%)"
                          className={`max-sm:h-10 px-5 py-5 rounded-xl pr-[10%] focus-visible:ring-1 text-xs placeholder:text-xs transition-all duration-300 ${formState.errors.compeleted_percentage ? "pr-9.5 focus-visible:ring-ring/75" : null}`}
                          {...field}
                        />
                        {formState.errors.compeleted_percentage && (
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="max-sm:h-10 px-5 py-5 rounded-xl focus-visible:ring-1 text-xs transition-all duration-300">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NOT_STARTED">
                            Not Started
                          </SelectItem>
                          <SelectItem value="DOING_IT_CURRENTLY">
                            Doing It Currently
                          </SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>
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
                {rhf.formState.isSubmitting ? "Adding..." : "Add Chapter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
