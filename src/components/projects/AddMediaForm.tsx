import { Controller, useForm } from "react-hook-form"
import type { ProjectType } from "../../types"
import ImageInput from "../cloudinary/ImageInput"
import { useState } from "react"
import { actions } from "astro:actions"
import { toast } from "sonner"
import { navigate } from "astro:transitions/client"
import InputError from "../ui/InputError"

type AddMediaFormProps = {
    projectId: ProjectType['id']
}

type MediaForm = {
    images: string[]
}

export default function AddMediaForm({ projectId }: AddMediaFormProps) {
    const [processing, setProcessing] = useState(false);
    const initialValues: MediaForm = {
        images: [],
    }

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: initialValues,
    });

    const handleAddMedia = async (data: MediaForm) => {
        setProcessing(true);

        const response = await actions.media.addImages({ projectId, images: data.images });

        setProcessing(false);

        if (response.error || !response.data?.success) {
            toast.error(response.error?.message ?? response.data?.message ?? "No fue posible agregar las imágenes");
            return;
        }

        toast.success(response.data.message);
        navigate("/projects/" + projectId + "/edit");
    }

    return (
        <form className="card-glass p-6 my-10 mx-auto max-w-xl w-full grid grid-cols-1 gap-5" onSubmit={handleSubmit(handleAddMedia)}>
            <div className="grid grid-cols-1 gap-2">
                <p className="text-white">
                    Agregar Imágenes:
                </p>

                <Controller
                    control={control}
                    name="images"
                    rules={{ validate: (value) => value!.length > 0 || "Las imágenes son requeridas" }}
                    render={({ field: { onChange, value } }) => (
                        <ImageInput
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />

                <InputError message={errors.images?.message} />
            </div>



            <button
                type="submit"
                disabled={processing}
                className="text-white font-bold bg-red cursor-pointer hover:bg-pink transition-colors px-4 py-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
                Guardar Cambios
            </button>
        </form>
    )
}
