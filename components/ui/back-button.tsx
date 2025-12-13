"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  
  return (
    <Button 
      size="icon-lg" 
      variant="outline" 
      className="cursor-pointer"
      onClick={() => router.back()}
    >
      <ChevronLeft className="size-5" />
    </Button>
  );
}