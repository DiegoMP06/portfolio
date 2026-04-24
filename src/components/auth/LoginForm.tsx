import { useForm } from 'react-hook-form';
import type { LoginFormData } from '../../types';
import InputError from '../ui/InputError';
import { useState } from 'react';
import { actions } from 'astro:actions';
import { navigate } from 'astro:transitions/client';
import { toast } from 'sonner';

export default function LoginForm() {
    const [processing, setProcessing] = useState(false);
    const emailErrorId = "login-email-error";
    const passwordErrorId = "login-password-error";
    const initialValues: LoginFormData = {
        email: '',
        password: '',
    }

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialValues
    })

    const handleLogin = async (data: LoginFormData) => {
        setProcessing(true);

        const response = await actions.auth.login(data)

        setProcessing(false);

        if (response.error) {
            toast.error(response.error.message ?? 'No se pudo iniciar sesión');
            return;
        }

        if (response.data?.success) {
            navigate('/projects');
        } else {
            toast.error(response.data?.message ?? 'Credenciales incorrectas');
        }
    }

    return (
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(handleLogin)}>
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
                    {...register('email', {
                        required: 'El correo electrónico es obligatorio',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'El correo electrónico no es válido'
                        },
                    })}
                />

                <InputError id={emailErrorId} message={errors.email?.message} />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="password" className="text-white"> Contraseña: </label>

                <input
                    id="password"
                    type="password"
                    className="border border-slate-300 text-white placeholder:text-slate-300 px-4 py-2 rounded-lg"
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? passwordErrorId : undefined}
                    {...register('password', {
                        required: 'La contraseña es obligatoria',
                    })}
                />

                <InputError id={passwordErrorId} message={errors.password?.message} />
            </div>

            <button
                type="submit"
                disabled={processing}
                className="text-white font-bold bg-red cursor-pointer hover:bg-pink transition-colors px-4 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
                Iniciar sesión
            </button>
        </form>
    )
}

