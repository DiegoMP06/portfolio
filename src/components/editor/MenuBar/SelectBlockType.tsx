import type { Editor } from '@tiptap/react';
import { useMemo } from 'react';
import type { EditorConfig } from '../MenuBar';
import MenuGroup from './MenuGroup';

type SelectBlockTypeProps = {
    editor: Editor;
    config: EditorConfig;
};

const BLOCK_TYPES = [
    {
        type: 'p',
        label: 'Párrafo',
    },
    {
        type: 'h1',
        label: 'Encabezado 1',
    },
    {
        type: 'h2',
        label: 'Encabezado 2',
    },
    {
        type: 'h3',
        label: 'Encabezado 3',
    },
    {
        type: 'h4',
        label: 'Encabezado 4',
    },
    {
        type: 'code',
        label: 'Código',
    },
    {
        type: 'quote',
        label: 'Cita',
    },
];

export default function SelectBlockType({
    config,
    editor,
}: SelectBlockTypeProps) {
    const blockValue = useMemo(
        () =>
            config?.isH1
                ? 'h1'
                : config?.isH2
                    ? 'h2'
                    : config?.isH3
                        ? 'h3'
                        : config?.isH4
                            ? 'h4'
                            : config?.isCodeBlock
                                ? 'code'
                                : config?.isBlockquote
                                    ? 'quote'
                                    : 'p',
        [config],
    );

    const setBlock = (variant: string) => {
        if (variant === 'p') {
            editor.chain().focus().setParagraph().run();
            return;
        }

        if (variant === 'h1') {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
            return;
        }

        if (variant === 'h2') {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
            return;
        }

        if (variant === 'h3') {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
            return;
        }

        if (variant === 'h4') {
            editor.chain().focus().toggleHeading({ level: 4 }).run();
            return;
        }

        if (variant === 'code') {
            editor.chain().focus().toggleCodeBlock().run();
            return;
        }

        if (variant === 'quote') {
            editor.chain().focus().toggleBlockquote().run();
        }
    };

    return (
        <MenuGroup label="Tipo de Bloque">
            <select
                value={blockValue}
                onChange={(e) => setBlock(e.target.value)}
                aria-label="Tipo de bloque"
                className="rounded border border-stroke bg-base px-2 py-1 text-xs text-slate-200 focus:border-neon focus:outline-none"
            >
                {BLOCK_TYPES.map((type) => (
                    <option key={type.type} value={type.type}>
                        {type.label}
                    </option>
                ))}
            </select>
        </MenuGroup>
    );
}

