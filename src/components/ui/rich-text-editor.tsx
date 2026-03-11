import { useEffect, useRef } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { sanitizeRichText } from '@/lib/richText';

interface RichTextEditorProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RichTextEditor({
  id,
  label,
  value,
  placeholder,
  onChange,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const sanitized = sanitizeRichText(value || '');
    if (editorRef.current.innerHTML !== sanitized) {
      editorRef.current.innerHTML = sanitized;
    }
  }, [value]);

  const handleCommand = (command: 'bold' | 'italic' | 'underline') => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    if (editorRef.current) {
      onChange(sanitizeRichText(editorRef.current.innerHTML));
    }
  };

  const handleInput = () => {
    if (!editorRef.current) {
      return;
    }

    onChange(sanitizeRichText(editorRef.current.innerHTML));
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="border border-input rounded-md bg-background overflow-hidden">
        <div className="flex items-center gap-1 p-2 border-b border-input bg-muted/40">
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCommand('bold')}>
            <Bold className="w-4 h-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCommand('italic')}>
            <Italic className="w-4 h-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCommand('underline')}>
            <Underline className="w-4 h-4" />
          </Button>
        </div>
        <div
          id={id}
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder={placeholder}
          className="min-h-[88px] p-3 text-sm text-foreground focus:outline-none [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-muted-foreground"
        />
      </div>
    </div>
  );
}
