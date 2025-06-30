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
    console.log("Copying URL:", url); // Log the URL for debugging
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
      className={cn(
        buttonVariants({ variant, size, className }),
        "cursor-pointer",
        className
      )}
      {...props}
      onClick={handleCopy}
    >
      <CopyIcon className="mr-2 size-4" />
      {getCopyLabel(copyState)}
    </Button>
  );
}
