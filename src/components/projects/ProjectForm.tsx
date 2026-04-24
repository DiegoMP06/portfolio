import { Controller, useFormState, type Control, type UseFormRegister } from "react-hook-form";
import TiptapEditor from "../editor/TiptapEditor";
import InputError from "../ui/InputError";
import StackInput from "./StackInput";
import type { CategoryType, DraftProject, StatusType } from "../../types";

type ProjectFormProps = {
    control: Control<DraftProject>
    register: UseFormRegister<DraftProject>
    categories: CategoryType[]
    statuses: StatusType[]
};

export default function ProjectForm({ control, register, categories, statuses }: ProjectFormProps) {
    const { errors } = useFormState({ control })

    return (
        <>
            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="name" className="text-white">
                    Nombre:
                </label>

                <input
                    id="name"
                    type="text"
                    className="border border-stroke bg-base/60 text-white placeholder:text-slate-400 px-4 py-2 rounded-lg"
                    placeholder="El nombre de tu proyecto"
                    {...register("name", {
                        required: "El nombre es requerido",
                        minLength: {
                            value: 3,
                            message: "El nombre debe tener al menos 3 caracteres",
                        },
                    })}
                />

                <InputError message={errors.name?.message} />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="description" className="text-white">
                    Descripción:
                </label>

                <textarea
                    id="description"
                    className="border border-stroke bg-base/60 text-white placeholder:text-slate-400 px-4 py-2 rounded-lg min-h-32 resize-none"
                    placeholder="Descripción corta para la tarjeta del proyecto"
                    {...register("description", {
                        required: "La descripción es requerida",
                        minLength: {
                            value: 50,
                            message: "La descripción debe tener al menos 50 caracteres",
                        },
                    })}
                />

                <InputError message={errors.description?.message} />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="content" className="text-white">
                    Contenido:
                </label>

                <Controller
                    control={control}
                    name="content"
                    rules={{
                        required: "El contenido es requerido",
                        validate: (value) =>
                            value.replace(/<[^>]*>/g, "").trim().length >= 50 ||
                            "El contenido debe tener al menos 50 caracteres",
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TiptapEditor
                            onChange={onChange}
                            value={value}
                            placeholder="Describe el proyecto, decisiones técnicas, arquitectura y resultados..."
                            minHeight="260px"
                        />
                    )}
                />

                <InputError message={errors.content?.message} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="demoUrl" className="text-white">
                        Demo URL:
                    </label>

                    <input
                        id="demoUrl"
                        type="url"
                        className="border border-stroke bg-base/60 text-white placeholder:text-slate-400 px-4 py-2 rounded-lg"
                        placeholder="https://mi-demo.com"
                        {...register("demoUrl", {
                            pattern: {
                                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-.~:/?#[\]@!$&'()*+,;=%]*)?$/,
                                message: "La demo URL debe ser valida",
                            },
                        })}
                    />

                    <InputError message={errors.demoUrl?.message} />
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="githubUrl" className="text-white">
                        Github URL:
                    </label>

                    <input
                        id="githubUrl"
                        type="url"
                        className="border border-stroke bg-base/60 text-white placeholder:text-slate-400 px-4 py-2 rounded-lg"
                        placeholder="https://github.com/mi-repo"
                        {...register("githubUrl", {
                            required: "La URL de Github es requerida",
                            pattern: {
                                value: /^https?:\/\/github\.com\/.+/i,
                                message: "La URL de Github no es valida",
                            },
                        })}
                    />

                    <InputError message={errors.githubUrl?.message} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="stack" className="text-white">
                    Tecnologías:
                </label>

                <Controller
                    control={control}
                    name="stack"
                    rules={{
                        validate: (value) =>
                            value.length > 0 || "Al menos una tecnología es requerida",
                    }}
                    render={({ field: { onChange, value } }) => (
                        <StackInput onChange={onChange} value={value} />
                    )}
                />

                <InputError message={errors.stack?.message} />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="statusId" className="text-white">
                    Estado:
                </label>

                <select
                    id="statusId"
                    className="border border-stroke bg-base/60 text-white placeholder:text-slate-400 px-4 py-2 rounded-lg"
                    {...register("statusId", {
                        required: "El estado es obligatorio",
                        valueAsNumber: true,
                        validate: (value) =>
                            statuses.some((status) => status.id === value) || "El estado es obligatorio",
                    })}
                >
                    {statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                            {status.name}
                        </option>
                    ))}
                </select>

                <InputError message={errors.statusId?.message} />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <p className="text-white">
                    Categorías:
                </p>

                <Controller
                    control={control}
                    name="categories"
                    rules={{
                        validate: (value) => value.length > 0 || 'Al menos una categoría es requerida',
                    }}
                    render={({ field: { onChange, value } }) => (
                        <ul className="flex flex-col gap-1">
                            {categories.map((category) => (
                                <li className="flex gap-2 items-center" key={category.id}>
                                    <input
                                        type="checkbox"
                                        name={`category-${category.id}`}
                                        id={`category-${category.id}`}
                                        checked={value.some((id) => id === category.id)}
                                        onChange={() => onChange(
                                            value.some((id) => id === category.id) ?
                                                value.filter((id) => id !== category.id) :
                                                [...value, category.id]
                                        )}
                                    />
                                    <label htmlFor={`category-${category.id}`} className="text-white font-medium text-sm cursor-pointer">
                                        {category.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                />

                <InputError message={errors.categories?.message} />
            </div>
        </>
    );
}

