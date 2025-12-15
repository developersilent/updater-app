"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.back()}
      className="cursor-pointer"
    >
      <ChevronLeft className="inline size-4 text-purple-500" />
    </Button>
  );
}
