"use strict";
// Modelo del carrito: estado y reglas, sin tocar el DOM.
const MAX_UNITS = 99;
const cart = new Map();

const money = (cents) =>
  new Intl.NumberFormat(CONFIG.locale, {
    style: "currency",
    currency: CONFIG.currency,
  }).format(cents / 100);

const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

function totals() {
  let units = 0,
    total = 0;
  for (const [id, quantity] of cart) {
    units += quantity;
    total += findProduct(id).price * quantity;
  }
  return { units, total };
}

// Devuelve false si el cambio no se aplicó (sin precio o sobre el máximo).
function changeQuantity(id, delta) {
  if (findProduct(id)?.price == null) return false;
  const quantity = (cart.get(id) || 0) + delta;
  if (quantity > MAX_UNITS) return false;
  if (quantity <= 0) cart.delete(id);
  else cart.set(id, quantity);
  return true;
}
