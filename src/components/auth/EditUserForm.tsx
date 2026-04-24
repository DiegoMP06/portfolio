import { useForm } from "react-hook-form";
import InputError from "../ui/InputError";
import type { EditUserData } from "../../types";
import { useState } from "react";
import { actions } from "astro:actions";
import { toast } from "sonner";

type EditUserFormProps = {
    name: string;
    email: string;
}

export default function EditUserForm({ name, email }: EditUserFormProps) {
    const [processing, setProcessing] = useState(false);
    const nameErrorId = "edit-user-name-error";
    const emailErrorId = "edit-user-email-error";

    const initialValues: EditUserData = {
        name,
        email,
    }

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialValues
    })

    const handleEditUser = async (data: EditUserData) => {
        setProcessing(true);

        const response = await actions.auth.updateProfile(data);

        setProcessing(false);

        if (response.error) {
            toast.error(response.error.message ?? "No fue posible actualizar tu perfil");
            return;
        }

        if (response.data?.success) {
            toast.success(response.data.message);
            return;
        }

        toast.error(response.data?.message ?? "No fue posible actualizar tu perfil");
    }

    return (
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(handleEditUser)}>
            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="name" className="text-white"> Nombre: </label>

                <input
                    id="name"
                    type="text"
                    className="border border-slate-300 text-white placeholder:text-slate-300 px-4 py-2 rounded-lg"
                    placeholder="Tu nombre"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? nameErrorId : undefined}
                    {...register("name", {
                        required: "El nombre es requerido",
                        minLength: {
                            value: 2,
                            message: "El nombre debe tener al menos 2 caracteres",
                        }
                    })}
                />

                <InputError id={nameErrorId} message={errors.name?.message} />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="email" className="text-white"> Correo electrónico: </label>

                <input
                    id="email"
                    type="email"
                    className="border border-slate-300 text-white placeholder:text-slate-300 px-4 py-2 rounded-lg"
                    placeholder="tu-correo@ejemplo.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? emailErrorId : undefined}
                    {...register("email", {
                        required: "El correo electrónico es obligatorio",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'El correo electrónico no es válido'
                        },
                    })}
                />

                <InputError id={emailErrorId} message={errors.email?.message} />
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

