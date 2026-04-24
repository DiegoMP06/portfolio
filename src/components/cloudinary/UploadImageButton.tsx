import { FileImage } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CloudinaryWidget {
    open: () => void;
    destroy: () => void;
}

interface CloudinaryResult {
    event: string;
    info: {
        public_id: string;
        secure_url: string;
    };
}

declare global {
    interface Window {
        cloudinary: {
            createUploadWidget: (
                options: object,
                callback: (error: unknown, result: CloudinaryResult) => void
            ) => CloudinaryWidget;
        };
    }
}

export default function UploadImageButton({ onUpload }: { onUpload: (id: string) => void }) {
    const widgetRef = useRef<CloudinaryWidget | null>(null);
    const onUploadRef = useRef(onUpload);

    useEffect(() => {
        onUploadRef.current = onUpload;
    }, [onUpload]);

    useEffect(() => {
        if (!window.cloudinary || widgetRef.current) return;

        widgetRef.current = window.cloudinary.createUploadWidget(
            {
                cloudName: import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
                uploadPreset: import.meta.env.PUBLIC_CLOUDINARY_UPLOAD_PRESET,
                multiple: true,
                maxFiles: 10,
                singleUploadAutoClose: false,
                showCompletedButton: true,
                clientAllowedFormats: ['jpg', 'png', 'webp', 'jpeg'],
                resourceType: 'image',
                sources: ['local', 'url', 'camera', 'google_drive'],
                language: 'es',
                text: {
                    es: {
                        menu: { select_file: 'Seleccionar imagen' },
                        local: {
                            browse: 'Buscar',
                            dd_instruction: 'Arrastra tus imágenes aquí',
                        },
                    },
                },
            },
            (error, result) => {
                if (!error && result?.event === 'success') {
                    onUploadRef.current(result.info.public_id);
                }
            }
        );

        return () => {
            document.body.style.overflow = 'auto';
            widgetRef.current?.destroy();
            widgetRef.current = null;
        };
    }, []);

    return (
        <button
            type="button"
            onClick={() => widgetRef.current?.open()}
            className="border border-purple text-purple px-4 py-2 rounded-lg hover:text-purple hover:border-purple transition-colors flex gap-2 items-center justify-center cursor-pointer"
        >
            <FileImage className="size-4" />
            Subir
        </button>
    );
}