
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface NumPadProps {
  onNumberClick: (value: string) => void;
  onDelete: () => void;
  className?: string;
}

export function NumPad({ onNumberClick, onDelete, className }: NumPadProps) {
  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '⌫']
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {numbers.map((row, rowIndex) => (
        row.map((num, colIndex) => (
          <Button
            key={`${rowIndex}-${colIndex}`}
            variant="secondary"
            className={cn(
              "aspect-square text-xl font-medium bg-white/80 hover:bg-white text-blue-600",
              !num && "invisible"
            )}
            onClick={() => {
              if (num === '⌫') {
                onDelete();
              } else {
                onNumberClick(num);
              }
            }}
          >
            {num}
          </Button>
        ))
      ))}
    </div>
  );
}
