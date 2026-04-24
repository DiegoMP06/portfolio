import { useState } from "react";
import { useForm } from "react-hook-form";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { toast } from "sonner";
import type { ResetPasswordData } from "../../types";
import InputError from "../ui/InputError";

type Props = {
    token: string;
};

export default function ResetPasswordForm({ token }: Props) {
    const [processing, setProcessing] = useState(false);
    const passwordErrorId = "reset-password-error";
    const passwordConfirmationErrorId = "reset-password-confirmation-error";

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ResetPasswordData>({
        defaultValues: {
            password: "",
            passwordConfirmation: "",
        },
    });

    const password = watch("password");

    const handleResetPassword = async (data: ResetPasswordData) => {
        setProcessing(true);

        const response = await actions.auth.resetPassword({
            token,
            password: data.password,
            passwordConfirmation: data.passwordConfirmation,
        });

        setProcessing(false);

        if (response.error) {
            toast.error(response.error.message ?? "No fue posible actualizar tu contraseña");
            return;
        }

        if (response.data?.success) {
            navigate("/auth/login");
            return;
        }

        toast.error(response.data?.message ?? "No fue posible actualizar tu contraseña");
    };

    return (
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(handleResetPassword)}>
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
                Cambiar contraseña
            </button>
        </form>
    );
}

