import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const user = await getUser();
    if (user?.userId && user?.username) {
      redirect("/");
    }
    return <>{children}</>;
}