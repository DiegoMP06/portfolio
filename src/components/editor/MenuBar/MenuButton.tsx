import type { ComponentProps } from 'react';
import { cn } from '../../../lib/utils';

type MenuButtonProps = {
    isActive?: boolean;
    tooltip?: string;
} & ComponentProps<'button'>;

export default function MenuButton({
    isActive,
    className,
    children,
    tooltip,
    title,
    ...props
}: MenuButtonProps) {
    return (
        <button
            type="button"
            title={tooltip ?? title}
            aria-label={tooltip ?? title}
            aria-pressed={isActive}
            className={cn(
                'inline-flex h-7 min-w-7 items-center justify-center rounded px-1.5',
                'text-xs font-bold whitespace-nowrap',
                'cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
                'transition-colors',
                isActive
                    ? 'bg-neon/20 border border-neon/70 text-neon hover:bg-neon/30'
                    : 'bg-base/70 border border-stroke text-slate-300 hover:border-neon/50 hover:text-white',
                className || '',
            )}
            {...props}
        >
            {children}
        </button>
    );
}

