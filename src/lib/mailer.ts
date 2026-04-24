import nodemailer from "nodemailer";

const getTransporter = () => {
    const gmailUser = import.meta.env.GMAIL_USER;
    const gmailAppPassword = import.meta.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
        throw new Error("Missing Gmail SMTP env vars");
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: gmailUser,
            pass: gmailAppPassword,
        },
    });
};

export const sendContactEmail = async (params: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) => {
    const transporter = getTransporter();
    const from = import.meta.env.MAIL_FROM || import.meta.env.GMAIL_USER;
    const to = import.meta.env.USER_MAIL || import.meta.env.GMAIL_USER;

    await transporter.sendMail({
        from,
        to,
        replyTo: params.email,
        subject: `[Portfolio] ${params.subject || "Nuevo mensaje"} - ${params.name}`,
        text: `Nuevo mensaje desde el formulario de contacto:\n\nNombre: ${params.name}\nEmail: ${params.email}\nAsunto: ${params.subject}\n\nMensaje:\n${params.message}`,
        html: `
            <h2>Nuevo mensaje desde el portfolio</h2>
            <p><strong>Nombre:</strong> ${params.name}</p>
            <p><strong>Email:</strong> ${params.email}</p>
            <p><strong>Asunto:</strong> ${params.subject}</p>
            <hr>
            <p><strong>Mensaje:</strong></p>
            <p>${params.message.replace(/\n/g, "<br>")}</p>
        `,
    });
};

export const sendPasswordResetEmail = async (params: {
    to: string;
    name: string;
    resetUrl: string;
}) => {
    const transporter = getTransporter();
    const from = import.meta.env.MAIL_FROM || import.meta.env.GMAIL_USER;

    await transporter.sendMail({
        from,
        to: params.to,
        subject: "Restablece tu contraseña",
        text: `Hola ${params.name},\n\nRecibimos una solicitud para cambiar tu contraseña.\n\nAbre este enlace para continuar:\n${params.resetUrl}\n\nEste enlace expira en 30 minutos.\n\nSi no solicitaste este cambio, ignora este correo.`,
        html: `
            <p>Hola ${params.name},</p>
            <p>Recibimos una solicitud para cambiar tu contraseña.</p>
            <p><a href="${params.resetUrl}">Haz clic aquí para restablecerla</a></p>
            <p>Este enlace expira en 30 minutos.</p>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
        `,
    });
};
