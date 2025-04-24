
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
  children: ReactNode;
}

export function ModernTabs({ defaultValue, items, className, children }: ModernTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className={cn("w-full", className)}>
      <TabsList className="mb-6 border-b w-full rounded-none bg-transparent h-auto p-0 overflow-x-auto flex">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold flex items-center gap-2"
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
