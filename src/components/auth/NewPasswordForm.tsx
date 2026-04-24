import { useForm } from "react-hook-form"
import type { NewPasswordData } from "../../types"
import { useState } from "react"
import InputError from "../ui/InputError"
import { actions } from "astro:actions"
import { toast } from "sonner"


export default function NewPasswordForm() {
    const [processing, setProcessing] = useState(false)
    const currentPasswordErrorId = "new-password-current-error";
    const passwordErrorId = "new-password-error";
    const passwordConfirmationErrorId = "new-password-confirmation-error";
    const initialValues: NewPasswordData = {
        currentPassword: "",
        password: "",
        passwordConfirmation: "",
    }

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: initialValues
    })

    const password = watch("password");

    const handleChangePassword = async (data: NewPasswordData) => {
        setProcessing(true);

        const response = await actions.auth.updatePassword(data);

        setProcessing(false);

        if (response.error) {
            toast.error(response.error.message ?? "No fue posible actualizar tu contraseña");
            return;
        }

        if (response.data?.success) {
            toast.success(response.data.message);
            setValue("currentPassword", "");
            setValue("password", "");
            setValue("passwordConfirmation", "");
            return;
        }

        toast.error(response.data?.message ?? "No fue posible actualizar tu contraseña");
    }

    return (
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(handleChangePassword)}>
            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="currentPassword" className="text-white"> Contraseña actual: </label>

                <input
                    id="currentPassword"
                    type="password"
                    className="border border-slate-300 text-white placeholder:text-slate-300 px-4 py-2 rounded-lg"
                    placeholder="Contraseña actual"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.currentPassword)}
                    aria-describedby={errors.currentPassword ? currentPasswordErrorId : undefined}
                    {...register("currentPassword", {
                        required: "La contraseña actual es requerida",
                    })}
                />

                <InputError id={currentPasswordErrorId} message={errors.currentPassword?.message} />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="password" className="text-white"> Nueva contraseña: </label>

                <input
                    id="password"
                    type="password"
                    className="border border-slate-300 text-white placeholder:text-slate-300 px-4 py-2 rounded-lg"
                    placeholder="Nueva contraseña"
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? passwordErrorId : undefined}
                    {...register("password", {
                        required: "La contraseña es requerida",
                        minLength: {
                            value: 8,
                            message: "La contraseña debe tener al menos 8 caracteres",
                        },
                    })}
                />

                <InputError id={passwordErrorId} message={errors.password?.message} />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="passwordConfirmation" className="text-white"> Confirmar nueva contraseña: </label>

                <input
                    id="passwordConfirmation"
                    type="password"
                    className="border border-slate-300 text-white placeholder:text-slate-300 px-4 py-2 rounded-lg"
                    placeholder="Confirmar nueva contraseña"
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.passwordConfirmation)}
                    aria-describedby={errors.passwordConfirmation ? passwordConfirmationErrorId : undefined}
                    {...register("passwordConfirmation", {
                        required: "La contraseña es requerida",
                        minLength: {
                            value: 8,
                            message: "La contraseña debe tener al menos 8 caracteres",
                        },
                        validate: (value) => value === password || "Las contraseñas no coinciden",
                    })}
                />

                <InputError id={passwordConfirmationErrorId} message={errors.passwordConfirmation?.message} />
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

