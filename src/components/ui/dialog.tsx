"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "cn";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogBackdrop = DialogPrimitive.Backdrop;
const DialogPopup = DialogPrimitive.Popup;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Portal>
      <DialogBackdrop className="fixed inset-0 z-50 bg-emerald-950/40" />
      <DialogPopup
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-xl dark:border-emerald-100/10 dark:bg-[#18251e]",
          className
        )}
        {...props}
      >
        {children}
      </DialogPopup>
    </DialogPrimitive.Portal>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogBackdrop,
  DialogPopup,
  DialogContent,
  DialogTitle,
  DialogDescription,
};
