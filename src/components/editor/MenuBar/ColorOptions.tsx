import type { Editor } from '@tiptap/react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { HIGHLIGHT_COLORS, ICONS as Icons, TEXT_COLORS } from '../../../consts/tiptap';
import type { EditorConfig } from '../MenuBar';
import Dialog from './Dialog';
import MenuButton from './MenuButton';
import MenuGroup from './MenuGroup';

type ColorOptionsProps = {
    editor: Editor;
    config: EditorConfig;
};

export default function ColorOptions({ config, editor }: ColorOptionsProps) {
    const [showHighlight, setShowHighlight] = useState(false);
    const [showColor, setShowColor] = useState(false);

    const handleCustomTextColor = (e: ChangeEvent<HTMLInputElement>) => {
        editor.chain().focus().setColor(e.target.value).run();
    };

    const handleChangeTextColor = (color: (typeof TEXT_COLORS)[number]) => {
        if (color.value) {
            editor.chain().focus().setColor(color.value).run();
        } else {
            editor.chain().focus().unsetColor().run();
        }

        setShowColor(false);
    };

    const handleCustomHighlightColor = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        editor.chain().focus().setHighlight({ color: e.target.value }).run();
    };

    const handleChangeHighlightColor = (
        color: (typeof HIGHLIGHT_COLORS)[number],
    ) => {
        if (color.value) {
            editor.chain().focus().setHighlight({ color: color.value }).run();
        } else {
            editor.chain().focus().unsetHighlight().run();
        }

        setShowHighlight(false);
    };

    return (
        <>
            <MenuGroup label="Colores" className="relative">
                <MenuButton
                    onClick={() => {
                        setShowColor((p) => !p);
                        setShowHighlight(false);
                    }}
                    tooltip="Color de texto"
                >
                    <span
                        className="text-sm leading-none font-black"
                        style={{ color: config?.textColor }}
                    >
                        A
                    </span>
                </MenuButton>

                <Dialog
                    isOpen={showColor}
                    label="Color de texto"
                    onClose={() => setShowColor(false)}
                >
                    <div className="flex flex-col gap-3">
                        <div className="flex max-w-35 flex-wrap gap-2">
                            {TEXT_COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    title={c.label}
                                    onClick={() => handleChangeTextColor(c)}
                                    className="flex size-6 items-center justify-center rounded border border-stroke transition-transform hover:scale-110 focus:outline-none"
                                    style={{
                                        background: c.value || 'transparent',
                                    }}
                                >
                                    {!c.value && (
                                        <span className="text-xs">✕</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="h-px w-full bg-dark-border" />

                        <div className="flex items-center justify-between gap-2">
                            <label
                                htmlFor="custom-text"
                                className="text-xs font-medium text-dim"
                            >
                                Personalizado
                            </label>
                            <input
                                id="custom-text"
                                type="color"
                                title="Elegir color personalizado"
                                defaultValue={config?.textColor || '#000000'}
                                onChange={handleCustomTextColor}
                                className="size-6 cursor-pointer rounded border-0 bg-transparent p-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:shadow-sm [&::-webkit-color-swatch-wrapper]:p-0"
                            />
                        </div>
                    </div>
                </Dialog>
            </MenuGroup>

            <MenuGroup label="Resaltar" className="relative">
                <MenuButton
                    onClick={() => {
                        setShowHighlight((p) => !p);
                        setShowColor(false);
                    }}
                    isActive={config?.isHighlight}
                    tooltip="Resaltar texto"
                >
                    <Icons.Highlight />
                </MenuButton>

                <Dialog
                    isOpen={showHighlight}
                    label="Resaltar texto"
                    onClose={() => setShowHighlight(false)}
                >
                    <div className="flex flex-col gap-3">
                        <div className="flex max-w-35 flex-wrap gap-2">
                            {HIGHLIGHT_COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    title={c.label}
                                    onClick={() =>
                                        handleChangeHighlightColor(c)
                                    }
                                    className="flex size-6 items-center justify-center rounded border border-stroke transition-transform hover:scale-110 focus:outline-none"
                                    style={{
                                        background: c.value || 'transparent',
                                    }}
                                >
                                    {!c.value && (
                                        <span className="text-xs">✕</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="h-px w-full bg-dark-border" />

                        <div className="flex items-center justify-between gap-2">
                            <label
                                htmlFor="custom-highlight"
                                className="text-xs font-medium text-dim"
                            >
                                Personalizado
                            </label>
                            <input
                                id="custom-highlight"
                                type="color"
                                title="Elegir color personalizado"
                                defaultValue="#ffff00"
                                onChange={handleCustomHighlightColor}
                                className="size-6 cursor-pointer rounded border-0 bg-transparent p-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:shadow-sm [&::-webkit-color-swatch-wrapper]:p-0"
                            />
                        </div>
                    </div>
                </Dialog>
            </MenuGroup>
        </>
    );
}

