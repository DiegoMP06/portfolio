type Props = {
    label: string;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
};

export default function TiptapToolbarButton({
    label,
    onClick,
    active = false,
    disabled = false,
}: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors cursor-pointer ${
                active
                    ? "bg-neon/20 border-neon text-neon"
                    : "bg-surface border-stroke text-slate-300 hover:border-neon/50"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {label}
        </button>
    );
}

