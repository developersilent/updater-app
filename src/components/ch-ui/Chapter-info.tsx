"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ChapterPopupEdit } from "./Chapter-popup-edit";
import { ChapterDel } from "./Chapter-del";
import { useGetAllChapters } from "@/querys/use-chapter";
import { LibraryBig } from "lucide-react";

export function ChapterInfo({ subjectId }: { subjectId: string }) {
  const { chapters, isLoading } = useGetAllChapters({ subjectId });
  return (
    <>
      {isLoading ? (
        <>
          <div className="flex items-center justify-center gap-2 w-full h-[70vh]">
            <LibraryBig className="size-6 text-green-500 animate-pulse" />
            <p className="text-sm text-slate-200/50">Loading chapters...</p>
          </div>
        </>
      ) : (
        <>
          {chapters && chapters.length === 0 ? (
            <>
              <div className="flex items-center justify-center gap-2 w-full h-[70vh]">
                <LibraryBig className="size-6 text-green-500 animate-pulse" />
                <p className="text-sm text-slate-200/50">
                  No chapters found. Create your first chapter to get started!
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="m-3 border-2 rounded-2xl h-[450px] p-5 overflow-auto">
                <Table
                  className="border-separate relative"
                  style={{ borderSpacing: "0 0.75rem" }}
                >
                  <TableHeader className="bg-primary-foreground/80 sticky top-0">
                    <TableRow>
                      <TableHead className="text-center">Ch_No</TableHead>
                      <TableHead className="text-center">Ch_Name</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Completed_%</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {chapters?.map((d, i) => (
                      <TableRow key={`${d.id}-${i}`} className="bg-card/50">
                        <TableCell className="text-center text-cyan-100">
                          {d.chapter_number}
                        </TableCell>
                        <TableCell className="text-center text-purple-400 text-sm">
                          {d.chapter_name}
                        </TableCell>
                        <TableCell
                          className={`text-center text-xs
                ${d.status === "COMPLETED" ? "text-green-400" : d.status === "DOING_IT_CURRENTLY" ? "text-yellow-400" : "text-orange-400 animate-pulse"}
                `}
                        >
                          {d.status}
                        </TableCell>
                        <TableCell
                          className={`
                text-center
                ${d.compeleted_percentage === "100%" ? "text-green-400" : parseInt(d.compeleted_percentage || "0") >= 40 ? "text-indigo-400" : "text-red-400 animate-pulse"}
                
                `}
                        >
                          {d.compeleted_percentage || "0"}
                        </TableCell>
                        <TableCell className="flex items-center justify-center py-2 gap-2">
                          <ChapterPopupEdit
                            subjectId={subjectId}
                            chapterId={d.id}
                            chapter_name={d.chapter_name}
                            chapter_number={d.chapter_number}
                            compeleted_percentage={d.compeleted_percentage}
                            status={d.status}
                          />
                          <ChapterDel chapterId={d.id} subject_id={subjectId} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
