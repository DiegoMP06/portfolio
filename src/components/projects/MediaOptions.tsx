import { Check, Trash } from "lucide-react";
import type { MediaType, ProjectType } from "../../types";
import { toast } from "sonner";
import { actions } from "astro:actions";
import { useState } from "react";
import { navigate } from "astro:transitions/client";

type MediaOptionsProps = {
    mediaId: MediaType['id'];
    featured: boolean;
    projectId: ProjectType['id'];
}

export default function MediaOptions({ mediaId, projectId, featured }: MediaOptionsProps) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Esta acción elimina la imagen. ¿Deseas continuar?",
        );

        if (!confirmed) {
            return;
        }

        setProcessing(true);

        const response = await actions.media.removeImage({ projectId, mediaId });

        setProcessing(false);

        if (response.error || !response.data?.success) {
            toast.error(response.error?.message ?? "No fue posible eliminar la imagen");
            return;
        }

        toast.success(response.data.message);
        navigate("/projects/" + projectId + "/edit");
    };

    const handleFeatured = async () => {
        setProcessing(true);

        const response = await actions.media.setFeaturedImage({ projectId, mediaId });

        setProcessing(false);

        if (response.error || !response.data?.success) {
            toast.error(response.error?.message ?? "No fue posible destacar la imagen");
            return;
        }

        toast.success(response.data.message);
        navigate("/projects/" + projectId + "/edit");
    };

    return (
        <>
            {featured ? (
                <p className="text-sm px-3 py-1.5 text-purple border border-purple flex gap-1 items-center rounded">
                    <Check className="size-4" />
                    Imagen destacada
                </p>
            ) : (
                <button
                    type="button"
                    disabled={processing}
                    className="text-green-200 hover:text-white transition-colors flex gap-1 items-center border border-green-200 px-2 py-1 rounded hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleFeatured}
                >
                    <Check className="size-4" />
                    {processing ? "Procesando..." : "Destacar"}
                </button>
            )}

            <button
                type="button"
                disabled={processing}
                className="text-red-200 hover:text-white transition-colors flex gap-1 items-center border border-red-200 px-2 py-1 rounded hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDelete}
            >
                <Trash className="size-4" />
                {processing ? "Procesando..." : "Eliminar"}
            </button>
        </>
    )
}

