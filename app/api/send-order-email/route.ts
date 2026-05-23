import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "missing_key");

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      total,
      items,
      address,
      city,
      country,
    } = body;

    const itemsHtml = items
      .map(
        (item: any) => `
          <tr>
            <td style="padding:14px;border-bottom:1px solid #eadccc;">
              <strong>${item.name}</strong>
              ${
                item.size
                  ? `<br/><span style="color:#7a6d65;font-size:13px;">Size: ${item.size}</span>`
                  : ""
              }
              ${
                item.color
                  ? `<br/><span style="color:#7a6d65;font-size:13px;">Color: ${item.color}</span>`
                  : ""
              }
              ${
                item.templateDescription
                  ? `<br/><span style="color:#7a6d65;font-size:13px;">Custom: ${item.templateDescription}</span>`
                  : ""
              }
            </td>
            <td style="padding:14px;border-bottom:1px solid #eadccc;text-align:center;">
              ${item.quantity}
            </td>
            <td style="padding:14px;border-bottom:1px solid #eadccc;text-align:right;">
              €${Number(item.price).toFixed(2)}
            </td>
          </tr>
        `
      )
      .join("");

    const data = await resend.emails.send({
      from: "Ressential Orders <onboarding@resend.dev>",
      to: process.env.ADMIN_ORDER_EMAIL || "",
      subject: `New Ressential Order - ${customerName}`,
      html: `
        <div style="margin:0;padding:0;background:#f8f3ed;font-family:Arial,sans-serif;color:#2b211d;">
          <div style="max-width:760px;margin:0 auto;padding:30px 18px;">
            <div style="background:#2b211d;color:white;border-radius:28px 28px 0 0;padding:28px;text-align:center;">
              <p style="margin:0;color:#d6b488;letter-spacing:4px;font-size:12px;text-transform:uppercase;">
                Ressential
              </p>
              <h1 style="margin:12px 0 0;font-size:30px;">
                New Order Received
              </h1>
            </div>

            <div style="background:white;padding:28px;border:1px solid #eadccc;">
              <h2 style="margin-top:0;">Customer Details</h2>

              <p><strong>Name:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
              <p><strong>Delivery:</strong> ${address}, ${city}, ${country}</p>

              <div style="margin:28px 0;padding:22px;background:#fbf7f1;border-radius:20px;text-align:center;">
                <p style="margin:0;color:#7a6d65;text-transform:uppercase;letter-spacing:3px;font-size:12px;">
                  Order Total
                </p>
                <h2 style="margin:8px 0 0;font-size:32px;">
                  €${Number(total).toFixed(2)}
                </h2>
              </div>

              <h2>Products</h2>

              <table style="width:100%;border-collapse:collapse;margin-top:12px;">
                <thead>
                  <tr>
                    <th align="left" style="padding:14px;border-bottom:2px solid #2b211d;">Product</th>
                    <th align="center" style="padding:14px;border-bottom:2px solid #2b211d;">Qty</th>
                    <th align="right" style="padding:14px;border-bottom:2px solid #2b211d;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </div>

            <div style="background:#ead8cf;padding:20px;text-align:center;border-radius:0 0 28px 28px;color:#5b4a42;">
              <p style="margin:0;font-size:13px;">
                Login to the admin dashboard to process this order.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}