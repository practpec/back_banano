import nodemailer from 'nodemailer';
import { EmailService } from '../../application/services/email.service';

export class NodemailerEmailService implements EmailService {
    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'clientemanagerchtecnologia@gmail.com',
                    pass: 'ehtsctkzkbfbazlu',
                },
                tls: {
                    // ignorar la verificación del certificado pass: fkokdhsseqkbqzsz
                    rejectUnauthorized: false 
                }
            });

            const mailOptions = {
                from: 'clientemanagerchtecnologia@gmail.com',
                to: to,
                subject: subject,
                html: body
            };

            await transporter.sendMail(mailOptions);
            console.log('Correo electrónico enviado correctamente');
        } catch (error) {
            throw new Error('Error al enviar el correo electrónico: ' + error);
        }
    }

    async sendWelcomeEmail(to: string, nombre: string): Promise<void> {
        try {
            const subject = 'Registro exitoso';
            const body = `
                <div style="font-family: Arial, sans-serif;">
                    <h3>Bienvenido/a, ${nombre}</h3>
                    <h3>Usted se ha sido registrado como un nuevo adminitrador del software bananoTrack</h3>
                    <p>Su cuenta ha sido creada exitosamente en nuestro sistema.</p>
                    <p>Gracias por registrarse.</p>
                </div>
            `;

            await this.sendEmail(to, subject, body);
        } catch (error) {
            throw new Error('Error al enviar el correo de bienvenida: ' + error);
        }
    }
}
