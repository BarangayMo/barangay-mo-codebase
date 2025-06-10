
import React, { useState } from 'react';
import { Button } from './button';
import { 
  Bold, 
  Italic, 
  List, 
  Link2, 
  Eye, 
  Code2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from './textarea';

interface EnhancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
}

export const EnhancedRichTextEditor = ({ 
  value, 
  onChange, 
  placeholder, 
  className,
  maxLength = 5000 
}: EnhancedRichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const formatBold = () => insertFormatting('**', '**');
  const formatItalic = () => insertFormatting('*', '*');
  const formatList = () => {
    const lines = value.split('\n');
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    const start = textarea?.selectionStart || 0;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    insertFormatting('\n- ', '');
  };
  const formatLink = () => insertFormatting('[', '](url)');

  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc pl-4">$1</ul>')
      .replace(/\n/g, '<br>');
  };

  const remainingChars = maxLength - value.length;

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={formatBold}
            type="button"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={formatItalic}
            type="button"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={formatList}
            type="button"
            title="List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={formatLink}
            type="button"
            title="Link"
          >
            <Link2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs",
            remainingChars < 100 ? "text-destructive" : "text-muted-foreground"
          )}>
            {remainingChars} chars left
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsPreview(!isPreview)}
            className="h-8 px-2"
            type="button"
          >
            <Eye className="h-4 w-4 mr-1" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsCodeMode(!isCodeMode)}
            className="h-8 px-2"
            type="button"
          >
            <Code2 className="h-4 w-4 mr-1" />
            {isCodeMode ? 'Visual' : 'HTML'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[200px]">
        {isPreview ? (
          <div 
            className="p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        ) : (
          <Textarea
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                onChange(e.target.value);
              }
            }}
            placeholder={placeholder}
            className="border-0 resize-none min-h-[200px] focus-visible:ring-0 rounded-none"
            style={{ fontFamily: isCodeMode ? 'monospace' : 'inherit' }}
          />
        )}
      </div>
    </div>
  );
};
