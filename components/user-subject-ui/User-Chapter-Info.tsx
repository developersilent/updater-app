import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { ChaptersType } from "@/db/schema";


export function UserChapterInfo({ data }: { data: ChaptersType[] }) {
  return (
    <div className="m-3 border-2 rounded-2xl h-[450px] overflow-auto p-5 container">
      <Table className="border-separate" style={{ borderSpacing: "0 0.75rem" }}>
        <TableHeader className="bg-primary-foreground/80 sticky top-0">
          <TableRow>
            <TableHead className="text-center">Ch_No</TableHead>
            <TableHead className="text-center">Ch_Name</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Completed_%</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((d, i) => (
            <TableRow key={`${d.id}-${i}`} className="bg-card/50">
              <TableCell className="text-center text-cyan-100">{d.chapter_number}</TableCell>
              <TableCell className="text-center text-purple-400 text-sm">{d.chapter_name}</TableCell>
              <TableCell className={`text-center text-xs
                ${d.status === 'COMPLETED' ? 'text-green-400' : d.status === 'DOING_IT_CURRENTLY' ? 'text-yellow-400' : 'text-orange-400 animate-pulse'}
                `}>{d.status}</TableCell>
              <TableCell className={`
                text-center
                ${d.compeleted_percentage === '100%' ? 'text-green-400' : parseInt(d.compeleted_percentage || '0') >= 40 ? 'text-indigo-400' : 'text-red-400 animate-pulse'}
                
                `} >{d.compeleted_percentage || '0'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
