import React, { useCallback, useMemo } from 'react';
import { createEditor, Descendant, Editor, Element, Text } from 'slate';
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { Button } from './button';
import { Bold, Italic, List, ListOrdered, Quote } from 'lucide-react';

const HOTKEYS: { [key: string]: string } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter description...",
  className = ""
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const initialValue: Descendant[] = useMemo(() => {
    if (!value) {
      return [{ type: 'paragraph', children: [{ text: '' }] }];
    }
    try {
      return JSON.parse(value);
    } catch {
      return [{ type: 'paragraph', children: [{ text: value }] }];
    }
  }, [value]);

  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props;
    switch (element.type) {
      case 'bulleted-list':
        return <ul {...attributes} className="list-disc ml-6">{children}</ul>;
      case 'numbered-list':
        return <ol {...attributes} className="list-decimal ml-6">{children}</ol>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'quote':
        return <blockquote {...attributes} className="border-l-4 border-gray-300 pl-4 italic">{children}</blockquote>;
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let { attributes, children, leaf } = props;
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
      children = <em>{children}</em>;
    }
    return <span {...attributes}>{children}</span>;
  }, []);

  const handleChange = (newValue: Descendant[]) => {
    onChange(JSON.stringify(newValue));
  };

  const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(
      format
    );

    Editor.unwrapNodes(editor, {
      match: n =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        LIST_TYPES.includes(n.type as string),
      split: true,
    })

    let newProperties: Partial<Element> = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
    Editor.setNodes(editor, newProperties)

    if (!isActive && isList) {
      const block: Element = { type: format, children: [] }
      Editor.wrapNodes(editor, block)
    }
  }

  const toggleMark = (editor: Editor, format: string) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }

  const isBlockActive = (editor: Editor, format: string) => {
    const { selection } = editor
    if (!selection) return false

    const [node] = Editor.nodes(editor, {
      match: n =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        (n.type as string) === format,
    })

    return !!node
  }

  const isMarkActive = (editor: Editor, format: string) => {
    const marks = Editor.marks(editor)
    return marks ? !!marks[format] : false
  }

  return (
    <div className={`border rounded-lg ${className}`}>
      <div className="border-b p-2 flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            toggleMark(editor, 'bold')
          }}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            toggleMark(editor, 'italic')
          }}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            toggleBlock(editor, 'bulleted-list')
          }}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            toggleBlock(editor, 'numbered-list')
          }}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            toggleBlock(editor, 'quote')
          }}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            className="min-h-[200px] outline-none"
          />
        </Slate>
      </div>
    </div>
  );
};

export { RichTextEditor };
