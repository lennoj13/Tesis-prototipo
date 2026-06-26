import os
import smtplib
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ...utils.general.logs import HandleLogs

class EmailSender:
    """Clase utilitaria para el envío asíncrono de correos mediante SMTP."""

    @staticmethod
    def send_email_async(to_email, subject, html_content):
        """Dispara el envío de correo en un hilo en segundo plano."""
        thread = threading.Thread(target=EmailSender._send_email, args=(to_email, subject, html_content))
        thread.daemon = True
        thread.start()

    @staticmethod
    def _send_email(to_email, subject, html_content):
        """Lógica real de conexión SMTP y envío de correo."""
        # Se obtienen las credenciales desde las variables de entorno
        smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', 587))
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')

        if not smtp_user or not smtp_password:
            HandleLogs.write_error("Faltan credenciales SMTP. No se pudo enviar el correo a " + str(to_email))
            return

        try:
            msg = MIMEMultipart("alternative")
            msg['Subject'] = subject
            msg['From'] = f"Sistema de Prácticas Preprofesionales <{smtp_user}>"
            msg['To'] = to_email

            part_html = MIMEText(html_content, "html")
            msg.attach(part_html)

            # Conexión al servidor SMTP
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, to_email, msg.as_string())
            server.quit()
            
            # Puedes usar logs para saber que se envio
            # HandleLogs.write_log(f"Correo enviado exitosamente a {to_email}")

        except Exception as e:
            HandleLogs.write_error(f"Error enviando correo a {to_email}: {str(e)}")

    @staticmethod
    def send_acceptance_notification(to_email, gestor_nombre, estudiante_nombre, empresa_nombre, vacante_titulo, carrera_nombre):
        """Genera y envía la plantilla HTML de notificación de aceptación."""
        
        subject = f"Notificación: Nuevo Estudiante Aceptado - {carrera_nombre}"
        
        html_content = f"""
        <html>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; overflow: hidden; border: 1px solid #e2e5ec;">
                
                <div style="background-color: #3c8dbc; padding: 20px; text-align: center; border-bottom: 4px solid #2c7bb5;">
                    <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: normal;">Sistema de Prácticas Preprofesionales</h2>
                </div>
                
                <div style="padding: 30px;">
                    <p style="color: #333333; font-size: 16px; margin-top: 0;">Estimado/a <strong>{gestor_nombre}</strong>,</p>
                    
                    <p style="color: #555555; font-size: 15px; line-height: 1.6;">
                        Le notificamos de manera oficial que una empresa ha aceptado a un estudiante de su carrera para iniciar el proceso de prácticas preprofesionales.
                    </p>
                    
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #3c8dbc; padding: 20px; margin: 25px 0; border-radius: 2px;">
                        <h4 style="margin-top: 0; color: #3c8dbc; font-size: 16px; margin-bottom: 15px; text-transform: uppercase;">Detalles de la Postulación</h4>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #666666; width: 120px; font-weight: bold;">Estudiante:</td>
                                <td style="padding: 6px 0; color: #333333;">{estudiante_nombre}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #666666; font-weight: bold;">Empresa:</td>
                                <td style="padding: 6px 0; color: #333333;">{empresa_nombre}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #666666; font-weight: bold;">Vacante:</td>
                                <td style="padding: 6px 0; color: #333333;">{vacante_titulo}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #666666; font-weight: bold;">Carrera:</td>
                                <td style="padding: 6px 0; color: #333333;">{carrera_nombre}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p style="color: #555555; font-size: 15px; line-height: 1.6;">
                        Se requiere su revisión en la plataforma para proceder con la validación académica y dar inicio formal al proceso.
                    </p>
                </div>
                
                <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #888888; font-size: 11px; margin: 0; text-transform: uppercase;">
                        Este es un mensaje generado automáticamente. Por favor, no responda a este correo.
                    </p>
                </div>
                
            </div>
        </body>
        </html>
        """
        
        EmailSender.send_email_async(to_email, subject, html_content)

