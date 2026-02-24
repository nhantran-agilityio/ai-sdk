import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { LoaderIcon } from "./icons/loading-icon";


export type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  size?: number;
};

export const Loading = ({ className, size = 16, ...props }: LoaderProps) => (
  <div
    className={cn(
      "inline-flex animate-spin items-center justify-center",
      className
    )}
    {...props}
  >
    <LoaderIcon size={size} />
  </div>
);