import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { Check, Trash, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "../../lib/utils";


type ProjectOptionsProps = {
    projectId: number;
    featured: boolean
};
export default function ProjectOptions({ projectId, featured }: ProjectOptionsProps) {

    const [processing, setProcessing] = useState(false);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Esta acción eliminará el proyecto. ¿Deseas continuar?",
        );

        if (!confirmed) {
            return;
        }

        setProcessing(true);

        const response = await actions.projects.remove({ projectId });

        setProcessing(false);

        if (response.error || !response.data?.success) {
            toast.error(response.error?.message ?? "No fue posible eliminar el proyecto");
            return;
        }

        toast.success(response.data.message);
        navigate("/projects");
    };

    const handleFeatured = async () => {
        setProcessing(true);

        const response = await actions.projects.setFeaturedProject({ projectId });

        setProcessing(false);

        if (response.error || !response.data?.success) {
            toast.error(response.error?.message ?? (featured ? "No fue posible quitar el destacado del proyecto" : "No fue posible destacar el proyecto"));
            return;
        }

        toast.success(response.data.message);
        navigate("/projects");
    };

    return (
        <>
            <button
                type="button"
                onClick={handleFeatured}
                disabled={processing}
                className={cn(
                    'transition-colors flex gap-1 items-center border px-2 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                    featured ? 'text-indigo-400 hover:text-indigo-300 border-indigo-400 hover:border-indigo-300' : 'text-blue-400 hover:text-blue-300 border-blue-400 hover:border-blue-300'
                )}
                title="Editar proyecto"
            >
                {featured ? (
                    <>
                        <X className="size-4" />
                        Dejar de destacar
                    </>
                ) : (
                    <>
                        <Check className="size-4" />
                        Destacar
                    </>
                )}
            </button>

            <button
                type="button"
                onClick={handleDelete}
                disabled={processing}
                className="text-red-400 hover:text-red-300 transition-colors flex gap-1 items-center border border-red-400 px-2 py-1 rounded hover:border-red-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Eliminar proyecto"
            >
                <Trash className="size-4" />
                Eliminar
            </button>
        </>
    )
}
