import { actions } from "astro:actions";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { CategoryType, DraftProject, FormattedProject, StatusType } from "../../types";
import ProjectForm from "./ProjectForm";

type EditProjectFormProps = {
    statuses: StatusType[]
    categories: CategoryType[]
    project: FormattedProject;
}

export default function EditProjectForm({ categories, statuses, project }: EditProjectFormProps) {
    const [processing, setProcessing] = useState(false);

    const initialValues: DraftProject = {
        name: project.name,
        description: project.description,
        content: project.content,
        demoUrl: project.demoUrl || '',
        githubUrl: project.githubUrl,
        stack: project.stack as string[],
        categories: project.categories.map((c) => c.id),
        statusId: project.statusId,
    }

    const {
        register,
        handleSubmit,
        control,
    } = useForm({
        defaultValues: initialValues,
    });

    const handleSave = async (data: DraftProject) => {
        setProcessing(true);

        const response = await actions.projects.update({ ...data, projectId: project.id });

        setProcessing(false);

        if (response.error || !response.data?.success) {
            toast.error(response.error?.message ?? response.data?.message ?? "No fue posible guardar el proyecto");
            return;
        }

        toast.success(response.data.message);
    };

    return (
        <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit(handleSave)}>
            <ProjectForm
                control={control}
                register={register}
                categories={categories}
                statuses={statuses}
            />

            <button
                type="submit"
                disabled={processing}
                className="text-white font-bold bg-red cursor-pointer hover:bg-pink transition-colors px-4 py-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
                Guardar cambios
            </button>
        </form>
    );
}

