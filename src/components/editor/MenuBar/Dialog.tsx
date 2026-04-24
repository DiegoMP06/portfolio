import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';

type DialogProps = {
    className?: string;
    label: string;
    isOpen: boolean;
    onClose: () => void;
};

export default function Dialog({
    label,
    isOpen,
    onClose,
    className,
    children,
}: PropsWithChildren<DialogProps>) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handler);
        }

        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handler);
        }

        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose]);

    return !isOpen ? null : (
        <div
            ref={containerRef}
            role="dialog"
            aria-label={label}
            className={cn(
                'absolute top-full left-0 z-50 mt-1',
                'rounded-lg border border-stroke bg-surface shadow-card',
                'flex min-w-72 flex-col gap-2 p-3',
                className || '',
            )}
        >
            {children}
        </div>
    );
}

