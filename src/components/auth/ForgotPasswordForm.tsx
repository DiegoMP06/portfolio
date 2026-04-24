import { actions } from "astro:actions";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ForgotPasswordData } from "../../types";
import InputError from "../ui/InputError";


export default function ForgotPasswordForm() {
    const [processing, setProcessing] = useState(false);
    const emailErrorId = "forgot-password-email-error";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordData>({
        defaultValues: {
            email: "",
        },
    });

    const handleForgotPassword = async (data: ForgotPasswordData) => {
        setProcessing(true);

        const response = await actions.auth.forgotPassword(data);

        setProcessing(false);

        if (response.error) {
            toast.error(response.error.message ?? "No fue posible procesar la solicitud");
            return;
        }

        if (response.data?.success) {
            toast.success(response.data.message);
            return;
        }

        toast.error(response.data?.message ?? "No fue posible procesar la solicitud");
    };

    return (
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(handleForgotPassword)}>
            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="email" className="text-white">
                    Correo electrónico:
                </label>

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
                            message: "El correo electrónico no es válido",
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
                {processing ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>
        </form>
    );
}

