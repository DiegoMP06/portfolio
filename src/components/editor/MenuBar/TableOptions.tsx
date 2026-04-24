import type { Editor } from '@tiptap/react';
import { Grid, Pencil, Plus, Rows2, Trash, XIcon } from 'lucide-react';
import { useState } from 'react';
import { ICONS as Icons } from '../../../consts/tiptap';
import type { EditorConfig } from '../MenuBar';
import Dialog from './Dialog';
import MenuButton from './MenuButton';
import MenuGroup from './MenuGroup';

type TableOptionsProps = {
    editor: Editor;
    config: EditorConfig;
};

export default function TableOptions({ config, editor }: TableOptionsProps) {
    const [showTableMenu, setShowTableMenu] = useState(false);

    return (
        <MenuGroup label="Tablas" className="relative">
            <MenuButton
                onClick={() => setShowTableMenu((p) => !p)}
                isActive={config?.isInTable}
                tooltip="Tabla"
            >
                <Icons.Table />
            </MenuButton>

            <Dialog
                label="Insertar tabla"
                isOpen={showTableMenu}
                onClose={() => setShowTableMenu(false)}
            >
                <div className="flex min-w-44 flex-col gap-0.5 text-xs">
                    {!config?.isInTable ? (
                        <>
                            <p className="mb-1 border-b border-stroke px-1 pb-1 font-semibold text-dim">
                                Insertar tabla
                            </p>
                            {[
                                [2, 2],
                                [3, 3],
                                [4, 4],
                                [3, 2],
                                [4, 3],
                                [5, 4],
                            ].map(([c, r]) => (
                                <button
                                    key={`${c}x${r}`}
                                    type="button"
                                    onClick={() => {
                                        editor
                                            .chain()
                                            .focus()
                                            .insertTable({
                                                rows: r,
                                                cols: c,
                                                withHeaderRow: true,
                                            })
                                            .run();
                                        setShowTableMenu(false);
                                    }}
                                    className="flex items-center gap-2 rounded px-2 py-1 text-left text-slate-300 hover:bg-base"
                                >
                                    {c} columnas × {r} filas
                                </button>
                            ))}
                        </>
                    ) : (
                        <>
                            <p className="mb-1 flex items-center gap-2 border-b border-stroke px-1 pb-1 font-semibold text-dim">
                                <Pencil className="size-4" />
                                Editar tabla
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .addColumnBefore()
                                        .run()
                                }
                                className="flex items-center gap-2 rounded px-2 py-1 text-left text-slate-300 hover:bg-base"
                            >
                                <Plus className="size-4" />
                                Columna antes
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .addColumnAfter()
                                        .run()
                                }
                                className="flex items-center gap-2 rounded px-2 py-1 text-left text-slate-300 hover:bg-base"
                            >
                                <Plus className="size-4" />
                                Columna después
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    editor.chain().focus().deleteColumn().run()
                                }
                                className="flex items-center gap-2 rounded px-2 py-1 text-left text-red-400 hover:bg-base"
                            >
                                <XIcon className="size-4" />
                                Eliminar columna
                            </button>
                            <hr className="my-1 border-stroke" />
                            <button
                                type="button"
                                onClick={() =>
                                    editor.chain().focus().addRowBefore().run()
                                }
                                className="flex items-center gap-2 rounded px-2 py-1 text-left text-slate-300 hover:bg-base"
                            >
                                <Plus className="size-4" />
                                Fila antes
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    editor.chain().focus().addRowAfter().run()
                                }
                                className="flex items-center gap-2 rounded px-2 py-1 text-left text-slate-300 hover:bg-base"
                            >
                                <Plus className="size-4" />
                                Fila después
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    editor.chain().focus().deleteRow().run()
                                }
                                className="flex items-center gap-2 rounded px-2 py-1 text-left text-red-400 hover:bg-base"
                            >
                                <XIcon className="size-4" />
                                Eliminar fila
                            </button>
                            <hr className="my-1 border-stroke" />
                            <button
                                type="button"
                                onClick={() =>
                                    editor.chain().focus().mergeCells().run()
                                }
                                className="flex items-center gap-2 rounded px-2 py-1 text-left text-slate-300 hover:bg-base"
                            >
                                <Grid className="size-4" />
                                Combinar celdas
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    editor.chain().focus().splitCell().run()
                                }
                                className="flex items-center gap-2 rounded px-2 py-1 text-left text-slate-300 hover:bg-base"
                            >
                                <Rows2 className="size-4" />
                                Separar celda
                            </button>
                            <hr className="my-1 border-stroke" />
                            <button
                                type="button"
                                onClick={() => {
                                    editor.chain().focus().deleteTable().run();
                                    setShowTableMenu(false);
                                }}
                                className="flex items-center gap-2 rounded px-2 py-1 text-left font-bold text-red-400 hover:bg-base"
                            >
                                <Trash className="size-4" />
                                Eliminar tabla
                            </button>
                        </>
                    )}
                </div>
            </Dialog>
        </MenuGroup>
    );
}

