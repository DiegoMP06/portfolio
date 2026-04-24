import type { ClipboardEvent } from "react";
import { useEffect, useState } from "react";
import { Code, Pencil, Plus, Trash } from 'lucide-react';
import InputError from "../ui/InputError";

type StackInputProps = {
    value: string[];
    onChange: (value: string[]) => void
}

type StackItem = {
    id: number;
    value: string;
}

export default function StackInput({ value, onChange }: StackInputProps) {
    const initialItems = () => value.map((tech) => ({
        id: Date.now() * Math.random(),
        value: tech,
    }));

    const [items, setItems] = useState<StackItem[]>(initialItems());
    const [editItem, setEditItem] = useState<StackItem | null>(null);
    const [item, setItem] = useState('');
    const [error, setError] = useState<undefined | string>(undefined);

    const handleSaveItem = () => {
        if (item.trim() !== '') {
            addItem()
            setError(undefined);
        } else {
            setError('El campo no puede estar vacío');
        }
    };

    const handleSetEditItem = (item: StackItem) => {
        setItem(item.value);
        setEditItem(item);
    };

    const addItem = () => {
        if (editItem) {
            const newItems = items.map((itemObj) =>
                itemObj.id === editItem.id ?
                    { ...itemObj, value: item.trim() } : itemObj
            )

            setItems(newItems);
        } else {
            const alreadyExists = items.some(
                (itemObj) =>
                    itemObj.value.toLowerCase() === item.trim().toLowerCase(),
            );

            if (alreadyExists) {
                setError("La tecnologia ya fue agregada");
                return;
            }

            setItems([...items, { id: Date.now(), value: item.trim() }]);
        }

        setItem('');
        setEditItem(null);
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        const pasteData = e.clipboardData.getData('text');

        if (pasteData.includes(',')) {
            e.preventDefault();

            const newTechs = pasteData
                .split(',')
                .map((tech) => tech.trim())
                .filter((tech) => tech !== '');

            const existing = new Set(items.map((itemObj) => itemObj.value.toLowerCase()));
            const newItems = newTechs
                .filter((tech) => !existing.has(tech.toLowerCase()))
                .map((tech) => ({
                id: Date.now() * Math.random(),
                value: tech,
            }));

            setItems([...items, ...newItems]);
            setItem('');
            setError(undefined);
        }
    };

    const handleRemoveItem = (id: number) => {
        setItems(items.filter((item) => item.id !== id));
    };

    useEffect(() => {
        onChange(items.map((item) => item.value));
    }, [items, onChange]);

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="grid gap-2">
                <div className="flex gap-2">
                    <input
                        placeholder="Ingresa una tecnología"
                        className="flex-1 border border-slate-300 text-white placeholder:text-slate-300 px-4 py-2 rounded-lg"
                        value={item}
                        onPaste={handlePaste}
                        onChange={(e) => setItem(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSaveItem();
                            }
                        }}
                    />

                    <button
                        className="flex-none p-2 rounded-lg border-cyan text-cyan border hover:text-neon hover:border-neon transition-colors disabled:opacity-50 disabled:cursor-not-allowed aspect-square flex items-center justify-center cursor-pointer"
                        type="button"
                        onClick={handleSaveItem}
                    >
                        {editItem ? (
                            <Pencil className='size-4' />
                        ) : (
                            <Plus className='size-4' />
                        )}
                    </button>
                </div>

                <InputError message={error} />
            </div>

            {items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                        <div
                            className="w-fit gap-1 overflow-hidden rounded-lg border border-stroke bg-base flex"
                            key={item.id}
                            onDoubleClick={() => handleSetEditItem(item)}
                        >
                            <div className="p-2 bg-purple text-white flex items-center">
                                <Code className="size-6" />
                            </div>

                            <div className="p-2 text-fore text-sm font-bold flex items-center">
                                <h3>{item.value}</h3>
                            </div>

                            <div className="p-2 flex items-center">
                                <button
                                    className="flex-none bg-red p-2 rounded-lg text-white hover:bg-pink cursor-pointer"
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                >
                                    <Trash className='size-4' />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

