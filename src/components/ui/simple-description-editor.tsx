import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bold, Italic, Underline } from "lucide-react";

interface SimpleDescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SimpleDescriptionEditor({
  value,
  onChange,
  placeholder = "Enter description...",
  className = "",
}: SimpleDescriptionEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    // Only update when external value changes (avoid cursor jump while typing)
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command: string) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(command); // simple formatting only
  };

  const handleInput = () => {
    const el = editorRef.current;
    if (!el) return;
    onChange(el.innerHTML);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => exec("bold")} aria-label="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec("italic")} aria-label="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec("underline")} aria-label="Underline">
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline
        dir="ltr"
        onInput={handleInput}
        className="min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring text-left"
        data-placeholder={placeholder}
      />
      {/* Placeholder styling */}
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
