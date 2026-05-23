import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "missing_key");

function getStatusText(status: string) {
  if (status === "processing") {
    return "Your handmade order is now being prepared with care.";
  }

  if (status === "completed") {
    return "Your order has been completed. Thank you for choosing Ressential.";
  }

  if (status === "cancelled") {
    return "Your order has been cancelled. Please contact Ressential if you need more information.";
  }

  return `Your order status has been updated to ${status}.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { customerEmail, customerName, orderId, status } = body;

    if (!customerEmail || !orderId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const shortId = String(orderId).slice(0, 8).toUpperCase();

    const data = await resend.emails.send({
      from: "Ressential Orders <onboarding@resend.dev>",
      to: customerEmail,
      subject: `Ressential Order #${shortId} - ${status}`,
      html: `
        <div style="margin:0;padding:0;background:#f8f3ed;font-family:Arial,sans-serif;color:#2b211d;">
          <div style="max-width:680px;margin:0 auto;padding:30px 18px;">
            <div style="background:#2b211d;color:white;border-radius:28px 28px 0 0;padding:30px;text-align:center;">
              <p style="margin:0;color:#d6b488;letter-spacing:4px;font-size:12px;text-transform:uppercase;">
                Ressential
              </p>
              <h1 style="margin:12px 0 0;font-size:28px;">
                Order Status Update
              </h1>
            </div>

            <div style="background:white;padding:30px;border:1px solid #eadccc;">
              <p>Hello ${customerName || "there"},</p>

              <p>Your order <strong>#${shortId}</strong> status has changed to:</p>

              <div style="margin:24px 0;padding:24px;background:#fbf7f1;border-radius:20px;text-align:center;">
                <p style="margin:0;font-size:28px;font-weight:bold;text-transform:capitalize;">
                  ${status}
                </p>
              </div>

              <p style="line-height:1.7;color:#6f625b;">
                ${getStatusText(status)}
              </p>

              <p style="margin-top:30px;">
                Thank you,<br/>
                <strong>Ressential</strong>
              </p>
            </div>

            <div style="background:#ead8cf;padding:18px;text-align:center;border-radius:0 0 28px 28px;color:#5b4a42;">
              <p style="margin:0;font-size:13px;">
                Handmade luxury gifts with elegant personal details.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Status email failed" },
      { status: 500 }
    );
  }
}