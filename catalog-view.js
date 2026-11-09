"use strict";
// Vista del catálogo y las categorías.
function renderCategories(selected, onSelect) {
  const nav = $("#categories");
  nav.replaceChildren();
  for (const name of ["Todos", ...new Set(PRODUCTS.map((p) => p.category))]) {
    const button = action(name, `Filtrar: ${name}`, () => {
      onSelect(name);
      $('#categories button[aria-pressed="true"]').focus();
    });
    button.setAttribute("aria-pressed", String(name === selected));
    nav.append(button);
  }
}

function productPhoto(product) {
  const placeholder = () => {
    const node = element("div", "photo placeholder", product.emoji);
    node.setAttribute("aria-hidden", "true");
    return node;
  };
  if (!product.image) return placeholder();
  const img = element("img", "photo");
  img.src = product.image;
  img.alt = product.name;
  img.loading = "lazy";
  img.width = 160;
  img.height = 160;
  img.addEventListener("error", () => img.replaceWith(placeholder()), {
    once: true,
  });
  return img;
}

function productButton(product, onAdd) {
  if (product.price === null)
    return action(
      "Consultar",
      `Consultar precio de ${product.name}`,
      () =>
        alert(
          "El precio de Club Sandwich no se distingue en las imágenes. Solicítalo al restaurante antes de agregarlo.",
        ),
      "add",
    );
  return action(
    "+ Agregar",
    `Agregar ${product.name}`,
    () => onAdd(product.id),
    "add",
  );
}

function productCard(product, onAdd) {
  const card = element("article", "product");
  const info = element("div", "info");
  const bottom = element("div", "product-bottom");
  bottom.append(
    element(
      "span",
      "price",
      product.price === null ? "Consultar precio" : money(product.price),
    ),
    productButton(product, onAdd),
  );
  info.append(
    element("h3", "", product.name),
    element("p", "description", product.description),
    bottom,
  );
  card.append(productPhoto(product), info);
  return card;
}

function renderCatalog(category, onAdd) {
  $("#category-title").textContent =
    category === "Todos" ? "Nuestro menú" : category;
  $("#catalog").replaceChildren(
    ...PRODUCTS.filter(
      (p) => category === "Todos" || p.category === category,
    ).map((p) => productCard(p, onAdd)),
  );
}
