"use strict";
// Punto de entrada: conecta modelo, vistas y eventos.
const form = $("#order-form");
let category = "Todos";

const say = (text) => ($("#status").textContent = text);

function change(id, delta) {
  if (!changeQuantity(id, delta)) {
    if (findProduct(id)?.price != null) say(`Máximo ${MAX_UNITS} unidades por producto.`);
    return;
  }
  refreshCart();
  say(`Carrito: ${totals().units} unidades, ${money(totals().total)}.`);
}

function remove(id) {
  const { name } = findProduct(id);
  cart.delete(id);
  refreshCart();
  say(`${name} eliminado.`);
}

const refreshCart = () => renderCart({ onChange: change, onRemove: remove });

function selectCategory(name) {
  category = name;
  renderCategories(category, selectCategory);
  renderCatalog(category, (id) => change(id, 1));
}

function readOrder() {
  return {
    customer: $("#customer").value.trim(),
    delivery: form.elements.delivery.value,
    address: $("#address").value.trim(),
    notes: $("#notes").value.trim(),
  };
}

form.addEventListener("change", () => {
  const delivery = form.elements.delivery.value === "delivery";
  $("#address-field").hidden = !delivery;
  $("#address").required = delivery;
  $("#address").disabled = !delivery;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const error = $("#error");
  error.hidden = true;
  if (!totals().units) return;
  const data = readOrder();
  const problem = validateOrder(data);
  if (problem) {
    error.textContent = problem;
    error.hidden = false;
    if (!data.customer) $("#customer").focus();
    else if (data.delivery === "delivery" && !data.address) $("#address").focus();
    return;
  }
  window.open(whatsappUrl(data), "_blank", "noopener,noreferrer");
  // No vaciar: abrir WhatsApp no confirma que el cliente haya enviado el pedido.
});

bindDialog();
renderCategories(category, selectCategory);
renderCatalog(category, (id) => change(id, 1));
refreshCart();
