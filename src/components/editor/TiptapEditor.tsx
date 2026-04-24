import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { CSSProperties } from 'react';
import MenuBar from './MenuBar';
import TipTapEditorContainer from './TipTapEditorContainer';

type TipTapEditorProps = {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    minHeight?: string;
    maxHeight?: string;
    disabled?: boolean;
    style?: CSSProperties;
};


const buildExtensions = (placeholder?: string) => [
    StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
    }),
    TextStyleKit,
    Underline,
    Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer' },
    }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
    }),
    Color,
    Highlight.configure({ multicolor: true }),
    Superscript,
    Subscript,
    Image.configure({
        allowBase64: false,
        HTMLAttributes: { class: 'tiptap-image' },
    }),
    Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: { class: 'tiptap-youtube' },
    }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    TaskList,
    TaskItem.configure({ nested: true }),
    CharacterCount,
    ...(placeholder ? [Placeholder.configure({ placeholder })] : []),
];

export default function TiptapEditor({
    value,
    onChange,
    placeholder,
    minHeight = '200px',
    maxHeight,
    disabled = false,
    style,
}: TipTapEditorProps) {
    const editor = useEditor({
        extensions: buildExtensions(placeholder),
        content: value,
        editable: !disabled,
        editorProps: {
            attributes: {
                class:
                    "max-h-80 min-h-64 overflow-y-auto rounded-lg rounded-t-none border border-stroke bg-surface/70 px-4 py-2 text-slate-100 focus:outline-none",
            },
        },
        onUpdate: ({ editor: currentEditor }) => {
            onChange(currentEditor.getHTML());
        },
        immediatelyRender: false,
    });

    if (!editor) {
        return null;
    }

    return (
        <div
            className="card-glass grid grid-cols-1 overflow-hidden"
            aria-disabled={disabled}
            style={style}
        >
            <MenuBar editor={editor} />
            <TipTapEditorContainer
                style={{
                    minHeight,
                    maxHeight,
                    overflowY: maxHeight ? 'auto' : undefined,
                }}
            >
                <EditorContent editor={editor} />
            </TipTapEditorContainer>
        </div>
    );
}

