import { cn } from "@/lib/utils";

interface HamburgerIconProps {
  isOpen?: boolean;
  className?: string;
}

export function HamburgerIcon({
  isOpen = false,
  className,
}: HamburgerIconProps) {
  return (
    <div
      className={cn(
        "w-6 h-6 flex flex-col justify-center items-center",
        className
      )}
    >
      <span
        className={cn(
          "block w-5 h-0.5 bg-current transition-all duration-300 ease-out",
          isOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
        )}
      />
      <span
        className={cn(
          "block w-5 h-0.5 bg-current transition-opacity duration-300",
          isOpen ? "opacity-0" : "opacity-100"
        )}
      />
      <span
        className={cn(
          "block w-5 h-0.5 bg-current transition-all duration-300 ease-out",
          isOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
        )}
      />
    </div>
  );
}
