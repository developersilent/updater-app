"use client";
import {
  AlertCircle,
  ChartNoAxesGantt,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import z from "zod";
import { api } from "@/lib/eden";
import { ToastError, ToastSuccess } from "./Tost";

const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be atleast 3 characters!"),
  password: z.string().min(3, "Password must be atleast 3 characters!"),
});

type LoginDataSchema = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const rhf = useForm<LoginDataSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submitForm = async (data: LoginDataSchema) => {
    const res = await api.auth.login.post(data);
    if (!res.response.ok) {
      ToastError(res.data?.message || "Login failed. Please try again.");
      return;
    }
    if (res.data?.error) {
      ToastError(res.data?.message || "Login failed. Please try again.");
      return;
    }
    ToastSuccess(res.data?.message || "Login successful!");
    redirect("/");
  };
  return (
    <div className={cn("flex flex-col gap-6 mb-7", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <ChartNoAxesGantt className="size-14" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-foreground/80">
            Login to continue.
          </h1>
        </div>
        <Form {...rhf}>
          <form
            onSubmit={rhf.handleSubmit(submitForm)}
            className="flex flex-col gap-2.5"
          >
            <div className="space-y-3">
              {/* Username Input */}
              <FormField
                control={rhf.control}
                name="username"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="username"
                          type="text"
                          autoFocus
                          autoComplete="off"
                          placeholder="Username"
                          className={`max-sm:h-10 px-5 py-5 rounded-xl pr-[10%] focus-visible:ring-1 text-xs placeholder:text-xs transition-all duration-300 ${formState.errors.username ? "pr-9.5 focus-visible:ring-ring/75" : null}`}
                          {...field}
                        />
                        {formState.errors.username && (
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

              {/* Password Input */}
              <FormField
                control={rhf.control}
                name="password"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          autoComplete="off"
                          autoFocus
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className={`max-sm:h-10 px-5 py-5 pr-[10%] rounded-xl text-xs placeholder:text-xs transition-all duration-300 focus-visible:ring-1  ${formState.errors.password ? "pr-9.5 focus-visible:ring-ring/75" : null}`}
                          {...field}
                        />
                        {formState.errors.password ? (
                          <div className="absolute right-0.5 top-1/2 transform -translate-y-1/2 grid h-full w-[10%] place-content-center rounded-full px-0.5">
                            <AlertCircle size={15} className="text-rose-600" />
                          </div>
                        ) : (
                          formState.dirtyFields.password && (
                            <div
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-0.5 top-1/2 transform -translate-y-1/2 grid h-full w-[10%] cursor-pointer place-content-center rounded-full px-0.5"
                            >
                              {showPassword ? (
                                <Eye size={15} className="text-foreground/70" />
                              ) : (
                                <EyeOff
                                  size={15}
                                  className="text-foreground/70"
                                />
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="px-2 text-[10.6px] text-rose-500 transition-opacity duration-300 ease-in-out" />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="my-4">
              <Button className="text-xs w-full rounded-xl" type="submit">
                {rhf.formState.isSubmitting ? (
                  <Loader2
                    size={30}
                    className="animate-spin duration-370"
                  />
                ) : (
                  <span className="text-sm text-primary-foreground">
                    Log in
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="underline underline-offset-4 hover:text-primary text-primary/80"
        >
          Sign up
        </Link>
      </div>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}