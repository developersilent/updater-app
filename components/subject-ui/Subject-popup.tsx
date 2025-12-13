"use client";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/eden"
import { AlertCircle, Book, Edit, FilePlus } from "lucide-react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastError, ToastSuccess } from "../auth-ui/Tost";
import { useState } from "react";
import { useRouter } from "next/navigation";

const subjectSchema = z.object({
    subjectId: z.string().optional(),
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().max(500).optional(),
})

type SubjectSchema = z.infer<typeof subjectSchema>;

export function SubjectPopupEdit({ subjectId, name, description }: SubjectSchema & { subjectId: string }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const rhf = useForm<SubjectSchema>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            subjectId,
            name,
            description,
        },
    });
    const handleSubmit = async (data: SubjectSchema) => {
        const res = await api.subject.update({subjectId: data.subjectId!}).put({ subject_name: data.name, description: data.description });
        if (!res.response.ok || res.data?.error) {
            ToastError(res.data?.message || "Failed to update subject. Please try again.");
            return;
        }
        ToastSuccess(res.data?.message || "Subject updated successfully!");
        setOpen(false);
        rhf.reset();
        router.refresh();
    }
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
                        <Book className="size-7 text-purple-400 animate-pulse" /> <span className="align-middle ml-2 text-sm">Editing Subject</span>
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
                            <DialogClose onClick={() => {
                                rhf.reset();
                            }} asChild className="px-7 rounded-xl">
                                <Button variant="outline" className="cursor-pointer">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" className="px-10 rounded-xl cursor-pointer">{
                                rhf.formState.isSubmitting ? "Saving..." : "Save Changes"
                            }</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}



export function SubjectPopupCreate() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const rhf = useForm<SubjectSchema>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });
    const handleSubmit = async (data: SubjectSchema) => {
        const res = await api.subject.create.post({ subject_name: data.name, description: data.description?.length == 0 ? "No Description." : data.description });
        if (!res.response.ok || res.data?.error) {
            ToastError(res.data?.message || "Failed to create subject. Please try again.");
            return;
        }
        ToastSuccess(res.data?.message || "Subject created successfully!");
        setOpen(false);
        rhf.reset();
        router.refresh();
    }
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
                        <Book className="size-7 text-purple-400 animate-pulse" /> <span className="align-middle ml-2 text-sm">Create New Subject</span>
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
                            <DialogClose onClick={() => {
                                rhf.reset();
                            }} asChild className="px-7 rounded-xl">
                                <Button variant="outline" className="cursor-pointer">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" className="px-10 rounded-xl cursor-pointer">{
                                rhf.formState.isSubmitting ? "Adding..." : "Add"
                            }</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}