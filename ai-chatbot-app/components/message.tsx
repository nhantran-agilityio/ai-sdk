import type { UIMessage } from "ai";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ================= MESSAGE WRAPPER ================= */

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export function Message({ className, from, ...props }: MessageProps) {
  const isUser = from === "user";

  return (
    <div
      className={cn(
        "group flex w-full gap-2 py-4",
        isUser
          ? "justify-end"
          : "flex-row-reverse justify-end",
        className
      )}
      {...props}
    />
  );
}

/* ================= MESSAGE CONTENT ================= */

export type MessageContentProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "contained" | "flat";
  from?: UIMessage["role"];
};

export function MessageContent({
  children,
  className,
  variant = "contained",
  from = "assistant",
  ...props
}: MessageContentProps) {
  const isUser = from === "user";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 overflow-hidden rounded-lg text-sm",
        variant === "contained" && [
          "max-w-[80%] px-4 py-3",
          isUser
            ? "bg-blue-500 text-white"
            : "bg-zinc-800 text-zinc-100",
        ],
        variant === "flat" && [
          isUser && "max-w-[80%] bg-zinc-800 px-4 py-3 text-zinc-100",
          !isUser && "text-zinc-100",
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ================= AVATAR ================= */

export type MessageAvatarProps = {
  src?: string;
  name?: string;
  className?: string;
};

export function MessageAvatar({
  src,
  name,
  className,
}: MessageAvatarProps) {
  const initials = name?.slice(0, 2).toUpperCase() || "AI";

  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-medium text-white ring-1 ring-zinc-600",
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ?? "avatar"}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
