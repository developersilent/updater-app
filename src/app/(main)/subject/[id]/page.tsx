import { ChapterInfo } from "@/components/ch-ui/Chapter-info";
import { BookOpenCheck } from "lucide-react";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { id } = await params;
  const { name } = await searchParams;
  return (
    <div className="w-full overflow-clip p-3 flex flex-col px-7">
      <p className="text-base font-semibold px-5">
        <BookOpenCheck className="inline size-4 text-rose-500 mr-2" />
        <span className="align-middle">{name || "Subject"}</span>
      </p>
      <ChapterInfo subjectId={id} />
    </div>
  );
}
