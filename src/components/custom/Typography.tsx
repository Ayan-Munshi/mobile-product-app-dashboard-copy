import { cn } from "@/lib/utils"; // Utility to combine Tailwind classes

interface TypographyProps {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  as: Component = "p",
  className,
  children,
}) => {
  return (
    <Component className={cn("text-base leading-relaxed text-gray-800", className)}>
      {children}
    </Component>
  );
};