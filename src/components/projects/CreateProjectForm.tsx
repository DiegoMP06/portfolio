import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { CategoryType, DraftProject, StatusType } from "../../types";
import ImageInput from "../cloudinary/ImageInput";
import InputError from "../ui/InputError";
import ProjectForm from "./ProjectForm";

type CreateProjectFormProps = {
    statuses: StatusType[]
    categories: CategoryType[]
}

export default function CreateProjectForm({ categories, statuses }: CreateProjectFormProps) {
    const [processing, setProcessing] = useState(false);

    const initialValues: DraftProject = {
        name: "",
        description: "",
        content: "",
        demoUrl: "",
        githubUrl: "",
        stack: [],
        images: [],
        categories: [],
        statusId: statuses[0].id,
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: initialValues,
    });

    const handleSave = async (data: DraftProject) => {
        setProcessing(true);

        const response = await actions.projects.create({ ...data, images: data.images || [] });

        setProcessing(false);

        if (response.error || !response.data?.success) {
            toast.error(response.error?.message ?? response.data?.message ?? "No fue posible guardar el proyecto");
            return;
        }

        toast.success(response.data.message);
        navigate("/projects");
    };

    return (
        <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit(handleSave)}>
            <ProjectForm
                control={control}
                register={register}
                categories={categories}
                statuses={statuses}
            />

            <div className="grid grid-cols-1 gap-2">
                <p className="text-white">
                    Imágenes:
                </p>

                <Controller
                    control={control}
                    name="images"
                    rules={{ validate: (value) => value!.length > 0 || "Las imágenes son requeridas" }}
                    render={({ field: { onChange, value } }) => (
                        <ImageInput
                            value={value || []}
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
                Crear proyecto
            </button>
        </form>
    );
}

