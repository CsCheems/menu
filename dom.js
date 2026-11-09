"use strict";
// Helpers de DOM. Construcción con textContent: los textos no se interpretan como HTML.
const $ = (selector) => document.querySelector(selector);

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function action(text, label, callback, className = "") {
  const button = element("button", className, text);
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.addEventListener("click", callback);
  return button;
}
