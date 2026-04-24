type InputErrorProps = {
    message?: string;
    id?: string;
};

export default function InputError({ message, id }: InputErrorProps) {
    return message ? (
        <p
            id={id}
            role="alert"
            aria-live="polite"
            className="bg-red-200 text-red-900 border-red-900 rounded py-2 pl-8 pr-4 border-l-8 text-xs font-bold uppercase"
        >
            {message}
        </p>
    ) : null;
}
