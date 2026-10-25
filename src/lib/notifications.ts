import twilio from "twilio";
import { NotificationLog, User } from "@/database/models";

type AdminOrderNotification = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  total: string;
};

type CustomerOrderNotification = AdminOrderNotification & {
  customerPhone: string;
};

function adminMessage(order: AdminOrderNotification) {
  return `New order confirmed: ${order.orderNumber}\nCustomer: ${order.customerName}\nTotal: ${order.total}`;
}

function customerMessage(order: AdminOrderNotification) {
  return `Your order ${order.orderNumber} is confirmed. Total: ${order.total}. Thank you for shopping with us.`;
}

async function sendWhatsApp(to: string, message: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.WHATSAPP_GRAPH_VERSION || "v23.0";

  if (!token || !phoneNumberId) {
    throw new Error("WhatsApp credentials are not configured");
  }

  const response = await fetch(
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      }),
    }
  );

  const body = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(body));
  }

  return body?.messages?.[0]?.id as string | undefined;
}

async function sendSms(to: string, message: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || !from) {
    throw new Error("Twilio credentials are not configured");
  }

  const client = twilio(sid, token);
  const result = await client.messages.create({
    body: message,
    from,
    to,
  });

  return result.sid;
}

async function deliver(params: {
  orderId: string;
  recipient: string;
  channel: "WHATSAPP" | "SMS";
  message: string;
}) {
  try {
    const providerId =
      params.channel === "WHATSAPP"
        ? await sendWhatsApp(params.recipient, params.message)
        : await sendSms(params.recipient, params.message);

    await NotificationLog.create({
      orderId: params.orderId,
      recipient: params.recipient,
      channel: params.channel,
      status: "SENT",
      providerId: providerId || null,
      error: null,
    });
  } catch (error) {
    await NotificationLog.create({
      orderId: params.orderId,
      recipient: params.recipient,
      channel: params.channel,
      status: "FAILED",
      providerId: null,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function notifyAdminsForOrder(order: AdminOrderNotification) {
  const admins = await User.findAll({
    where: {
      role: "ADMIN",
      isActive: true,
    },
    attributes: ["phone"],
  });

  const jobs = admins.flatMap((admin) =>
    admin.phone
      ? [
          deliver({
            orderId: order.orderId,
            recipient: admin.phone,
            channel: "WHATSAPP",
            message: adminMessage(order),
          }),
          deliver({
            orderId: order.orderId,
            recipient: admin.phone,
            channel: "SMS",
            message: adminMessage(order),
          }),
        ]
      : []
  );

  await Promise.allSettled(jobs);
}

export async function notifyCustomerForOrder(
  order: CustomerOrderNotification
) {
  if (process.env.NOTIFY_CUSTOMER_ON_CONFIRMATION !== "true") {
    return;
  }

  await Promise.allSettled([
    deliver({
      orderId: order.orderId,
      recipient: order.customerPhone,
      channel: "WHATSAPP",
      message: customerMessage(order),
    }),
    deliver({
      orderId: order.orderId,
      recipient: order.customerPhone,
      channel: "SMS",
      message: customerMessage(order),
    }),
  ]);
}
