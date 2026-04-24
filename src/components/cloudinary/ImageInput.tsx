import CloudinaryImage from "./CloudinaryImage"
import UploadImageButton from "./UploadImageButton"

type ImageInputProps = {
    onChange: (value: string[]) => void
    value: string[]
}

export default function ImageInput({ onChange, value }: ImageInputProps) {
    const handleRemove = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="space-y-4">
            <UploadImageButton
                onUpload={(newImage) => onChange([...value, newImage])}
            />

            {value.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {value.map((image, index) => (
                        <div key={`${image}-${index}`} className="relative group">
                            <div className="overflow-hidden rounded-xl border border-white/10 shadow-lg">
                                <CloudinaryImage publicId={image} alt={`Imagen ${index + 1} de ${value.length}`} />
                            </div>

                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-xl transition-transform hover:scale-110"
                                title="Eliminar imagen"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card-glass p-8 text-center text-slate-400 border-2 border-dashed border-white/5 mt-4 rounded-xl">
                    <p>Aún no tienes imágenes seleccionadas.</p>
                </div>
            )}
        </div>
    )
}
