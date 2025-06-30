"use client";
import { VariantProps } from "class-variance-authority";
import React, { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type CopyState = "idle" | "copied" | "error";

interface CopyEventButtonProps
  extends Omit<React.ComponentProps<"button">, "children" | "onClick">,
    VariantProps<typeof buttonVariants> {
  eventId: string;
  clerkUserId: string;
}

function getCopyLabel(state: CopyState) {
  switch (state) {
    case "copied":
      return "Copied!";
    case "error":
      return "Error";
    case "idle":
    default:
      return "Copy Link";
  }
}
export default function CopyEventButton({
  eventId,
  clerkUserId,
  className,
  variant,
  size,
  ...props
}: CopyEventButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const handleCopy = () => {
    const url = `${location.origin}/book/${clerkUserId}/${eventId}`; 
    navigator.clipboard
      .writeText(url) // Try to copy the URL
      .then(() => {
        setCopyState("copied"); // On success, show "Copied!" state
        toast("Link copied successfully.", {
          duration: 3000,
        });
        setTimeout(() => setCopyState("idle"), 2000); // Reset after 2 seconds
      })
      .catch(() => {
        setCopyState("error"); // On failure, show "Error" state
        setTimeout(() => setCopyState("idle"), 2000); // Reset after 2 seconds
      });
  };

  return (
    <Button
          onClick={handleCopy}
          className={cn(buttonVariants({ variant, size }), 'cursor-pointer', className)} 
          variant={variant}
          size={size}
          {...props}
        >
          <CopyIcon className="size-4 mr-2" /> 
          {getCopyLabel(copyState)} 
        </Button>
  );
}
