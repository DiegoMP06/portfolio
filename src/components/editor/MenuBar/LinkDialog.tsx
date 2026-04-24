import type { Editor } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../lib/utils';
import Dialog from './Dialog';

type LinkDialogProps = {
    editor: Editor;
    isOpen: boolean;
    onClose: () => void;
};

export default function LinkDialog({
    editor,
    isOpen,
    onClose,
}: LinkDialogProps) {
    const [url, setUrl] = useState('');
    const [openInNewTab, setOpenInNewTab] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            const existing = editor.getAttributes('link').href ?? '';

            setTimeout(() => {
                setUrl(existing);
                setOpenInNewTab(
                    editor.getAttributes('link').target === '_blank',
                );
            }, 0);

            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen, editor]);

    const apply = () => {
        const trimmed = url.trim();

        if (!trimmed) {
            editor.chain().focus().unsetLink().run();
        } else {
            const href = /^https?:\/\//i.test(trimmed)
                ? trimmed
                : `https://${trimmed}`;
            editor
                .chain()
                .focus()
                .setLink({
                    href,
                    target: openInNewTab ? '_blank' : undefined,
                    rel: openInNewTab ? 'noopener noreferrer' : undefined,
                })
                .run();
        }

        onClose();
    };

    const remove = () => {
        editor.chain().focus().unsetLink().run();
        onClose();
    };

        return (
        <Dialog label="Insertar enlace" isOpen={isOpen} onClose={remove}>
            <label className="text-xs font-semibold text-dim">
                URL del enlace
            </label>
            <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        apply();
                    }
                }}
                placeholder="https://ejemplo.com"
                className={cn(
                    'w-full rounded border border-stroke px-2.5 py-1.5 text-sm',
                    'bg-base text-fore',
                    'focus:border-neon focus:outline-none',
                )}
            />
            <label className="flex cursor-pointer items-center gap-2 text-xs text-dim select-none">
                <input
                    type="checkbox"
                    checked={openInNewTab}
                    onChange={(e) => setOpenInNewTab(e.target.checked)}
                    className="rounded"
                />
                Abrir en nueva pestaña
            </label>
            <div className="flex gap-2 pt-1">
                <button
                    type="button"
                    onClick={apply}
                    className="flex-1 rounded bg-red px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-pink"
                >
                    {url.trim() ? 'Aplicar' : 'Quitar enlace'}
                </button>
                {editor.isActive('link') && (
                    <button
                        type="button"
                        onClick={remove}
                        className="rounded border border-red-500 px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/10"
                    >
                        Quitar
                    </button>
                )}
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded border border-stroke px-3 py-1.5 text-xs font-bold text-slate-300 transition-colors hover:text-white"
                >
                    Cancelar
                </button>
            </div>
        </Dialog>
    );
}

