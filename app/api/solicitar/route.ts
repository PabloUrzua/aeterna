import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, type, plan, placa, userEmail, relation, message, species, breed, totalPrice } = data;

    // Send email via Resend
    if (resend) {
      await resend.emails.send({
        from: "Amuley Ventas <ventas@amuley.com>", // Requiere dominio verificado en Resend
        to: [userEmail, "ventas@amuley.com"], // Se envía al usuario y una copia a ventas
        subject: `Confirmación de solicitud de Memorial - ${name}`,
        html: `
          <div style="font-family: sans-serif; color: #111; max-w: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h1 style="color: #967B62; text-align: center;">¡Gracias por tu solicitud!</h1>
            <p>Hola,</p>
            <p>Hemos recibido correctamente tu solicitud para crear un memorial en <strong>Amuley</strong>.</p>
            
            <h2 style="color: #967B62; border-bottom: 1px solid #eee; padding-bottom: 8px;">Detalles de la solicitud</h2>
            <ul>
              <li><strong>Para:</strong> ${name}</li>
              <li><strong>Tipo:</strong> ${type === "persona" ? "Persona" : "Mascota"}</li>
              <li><strong>Plan seleccionado:</strong> ${plan}</li>
              <li><strong>Placa Física:</strong> ${placa ? "Sí (+$20.000)" : "No"}</li>
              <li><strong>Total a pagar:</strong> $${totalPrice ? totalPrice.toLocaleString("es-CL") : "-"}</li>
              <li><strong>Tu relación:</strong> ${relation || "-"}</li>
              ${type === "mascota" ? `<li><strong>Especie/Raza:</strong> ${species} / ${breed}</li>` : ""}
            </ul>
            
            <h3 style="color: #55504C;">Historia o Mensaje:</h3>
            <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #967B62; font-style: italic;">
              "${message || "Sin mensaje"}"
            </p>

            <p style="margin-top: 30px;">Nuestro equipo está preparando todo. Recibirás tu enlace de acceso en <strong>menos de 24 horas</strong>.</p>
            <p style="color: #888; font-size: 12px; text-align: center; margin-top: 40px;">
              El equipo de Amuley<br>
              <a href="mailto:ventas@amuley.com" style="color: #967B62;">ventas@amuley.com</a>
            </p>
          </div>
        `,
      });
      console.log("Email sent to:", userEmail);
    } else {
      console.log("=========================================");
      console.log("⚠️ SIMULACIÓN DE EMAIL (Falta RESEND_API_KEY)");
      console.log("De: ventas@amuley.com");
      console.log("Para:", userEmail);
      console.log("Plan seleccionado:", plan);
      console.log("Incluye placa:", placa);
      console.log("Total:", totalPrice);
      console.log("=========================================");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en API /solicitar:", error);
    return NextResponse.json(
      { success: false, error: "Error al enviar la solicitud." },
      { status: 500 }
    );
  }
}
