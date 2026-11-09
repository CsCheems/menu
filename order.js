"use strict";
// Reglas del pedido: validación, mensaje y enlace de WhatsApp.
// Devuelve el texto del error, o null si el pedido es válido.
function validateOrder(data) {
  if (!data.customer || (data.delivery === "delivery" && !data.address))
    return "Escribe tu nombre y, si solicitas envío, una dirección válida.";
  if (!/^\d{8,15}$/.test(CONFIG.whatsapp))
    return "Configura CONFIG.whatsapp con el número internacional real del restaurante, solo dígitos.";
  return null;
}

function buildMessage(data) {
  const lines = [`*Nuevo pedido · ${CONFIG.restaurant}*`, ""];
  for (const [id, quantity] of cart) {
    const p = findProduct(id);
    lines.push(
      `${quantity} × ${p.name}`,
      `  ${money(p.price)} c/u · ${money(p.price * quantity)}`,
    );
  }
  lines.push(
    "",
    `*Total de productos: ${money(totals().total)} ${CONFIG.currency}*`,
    "Envío, si aplica: por confirmar.",
    "",
    `*Cliente:* ${data.customer}`,
    `*Modalidad:* ${data.delivery === "delivery" ? "A domicilio" : "Para recoger"}`,
  );
  if (data.delivery === "delivery") lines.push(`*Dirección:* ${data.address}`);
  if (data.notes) lines.push(`*Indicaciones:* ${data.notes}`);
  lines.push(
    "",
    "Solicito confirmar disponibilidad, importe final y tiempo de entrega.",
  );
  return lines.join("\n");
}

const whatsappUrl = (data) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(buildMessage(data))}`;
