
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface ModernTabsProps {
  defaultValue: string;
  items: TabItem[];
  className?: string;
  children: ((props: { value: string }) => ReactNode) | ReactNode;
  onValueChange?: (value: string) => void;
}

export function ModernTabs({ defaultValue, items, className, children, onValueChange }: ModernTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} onValueChange={onValueChange} className={cn("w-full", className)}>
      <TabsList className="mb-6 border-b w-full rounded-none bg-transparent h-auto p-0 overflow-x-auto flex">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold flex items-center gap-2 transition-all hover:bg-gray-50"
          >
            {item.icon && <span className="transition-transform">{item.icon}</span>}
            <span>{item.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="animate-fade-in">
        {typeof children === 'function' ? children({ value: defaultValue }) : children}
      </div>
    </Tabs>
  );
}
