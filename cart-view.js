"use strict";
// Vista del carrito (resumen, filas y diálogo).
const dialog = $("#cart-dialog");

function cartRow(id, quantity, { onChange, onRemove }) {
  const p = findProduct(id);
  const row = element("div", "cart-row");
  const top = element("div", "row-top");
  top.append(
    element("strong", "", p.name),
    element("strong", "", money(p.price * quantity)),
  );
  row.append(top, element("p", "unit", `${money(p.price)} por unidad`));
  const line = element("div", "quantity-line");
  const controls = element("div", "quantity");
  const minus = action("−", `Restar una unidad de ${p.name}`, () =>
    onChange(id, -1),
  );
  minus.dataset.key = id + "-minus";
  const plus = action("+", `Sumar una unidad de ${p.name}`, () =>
    onChange(id, 1),
  );
  plus.dataset.key = id + "-plus";
  plus.disabled = quantity >= MAX_UNITS;
  controls.append(minus, element("span", "", String(quantity)), plus);
  const remove = action(
    "Eliminar",
    `Eliminar ${p.name}`,
    () => onRemove(id),
    "remove",
  );
  remove.dataset.key = id + "-remove";
  line.append(controls, remove);
  row.append(line);
  return row;
}

function renderCart(handlers) {
  const { units, total } = totals();
  $("#cart-button").hidden = !units;
  $("#cart-count").textContent =
    `Ver pedido · ${units} ${units === 1 ? "producto" : "productos"}`;
  $("#cart-total").textContent = money(total);
  $("#total").textContent = money(total);
  $("#checkout").disabled = !units;
  const items = $("#cart-items");
  const focused = document.activeElement;
  const focusKey = items.contains(focused) ? focused.dataset.key : null;
  items.replaceChildren();
  for (const [id, quantity] of cart)
    items.append(cartRow(id, quantity, handlers));
  if (!units) {
    items.append(
      element(
        "p",
        "fine",
        "Tu carrito está vacío. Agrega algo del menú para comenzar.",
      ),
    );
    if (dialog.open) $("#close").focus();
  } else if (focusKey) {
    const target = [...items.querySelectorAll("button")].find(
      (b) => b.dataset.key === focusKey && !b.disabled,
    );
    (target || $("#close")).focus();
  }
}

function bindDialog() {
  $("#cart-button").addEventListener("click", () => {
    dialog.showModal();
    document.body.style.overflow = "hidden";
  });
  $("#close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
    if (!$("#cart-button").hidden) $("#cart-button").focus();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.close();
  });
}
