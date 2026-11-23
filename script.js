// CareNest storefront configuration. Replace these placeholders before publishing.
const STORE_CONFIG = {
  whatsappNumber: "6285157861182", // Example format: 6281234567890 (digits only, include country code)
  social: { instagram: "https://www.instagram.com/rajendra.png?evlk=M2cxOGN1ZmQ5bWw3", tiktok: "https://vt.tiktok.com/ZSs8mfTkE/", youtube: "https://youtu.be/iVWsP3IadBk?si=B3y6me1xcOyh0Svq" },
  products: {
    pink: { name: "CareNest Pink", price: 110000 },
    red: { name: "CareNest Red", price: 100000 }
  }
};

const rupiah = value => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(value);

const cart = {};
const productGrid = document.getElementById("product-grid");
const cartDrawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("overlay");
const checkoutModal = document.getElementById("checkout-modal");
const toast = document.getElementById("toast");

document.querySelectorAll("[data-price]").forEach(el => {
  el.textContent = rupiah(STORE_CONFIG.products[el.dataset.price].price);
});
document.querySelectorAll("[data-social]").forEach(link => {
  const url = STORE_CONFIG.social[link.dataset.social];
  if (url) { link.href = url; link.target = "_blank"; link.rel = "noopener"; }
  else link.addEventListener("click", event => { event.preventDefault(); showToast("Tambahkan link akun resmi di script.js."); });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2500);
}
function cartQty() { return Object.values(cart).reduce((sum, item) => sum + item.qty, 0); }
function cartTotal() { return Object.entries(cart).reduce((sum, [id, item]) => sum + STORE_CONFIG.products[id].price * item.qty, 0); }
function renderCart() {
  const qty = cartQty();
  document.getElementById("cart-count").textContent = qty;
  document.getElementById("drawer-count").textContent = `(${qty})`;
  document.getElementById("cart-subtotal").textContent = rupiah(cartTotal());
  document.getElementById("checkout-total").textContent = rupiah(cartTotal());
  const host = document.getElementById("cart-items");
  const entries = Object.entries(cart);
  if (!entries.length) {
    host.innerHTML = '<div class="empty-cart">Your cart is waiting.<br><span>Add a CareNest bag to begin.</span></div>';
    return;
  }
  host.innerHTML = entries.map(([id, item]) => {
    const product = STORE_CONFIG.products[id];
    return `<div class="cart-line"><div><b>${product.name}</b><small>${rupiah(product.price)} each</small></div><div class="qty"><button data-qty="${id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${id}" data-change="1" aria-label="Increase quantity">+</button></div></div>`;
  }).join("");
}
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = button.dataset.add;
  cart[id] = cart[id] || { qty: 0 };
  cart[id].qty++;
  renderCart();
  showToast(`${STORE_CONFIG.products[id].name} added to cart`);
});
document.getElementById("cart-items").addEventListener("click", event => {
  const button = event.target.closest("[data-qty]");
  if (!button) return;
  const id = button.dataset.qty;
  cart[id].qty += Number(button.dataset.change);
  if (cart[id].qty <= 0) delete cart[id];
  renderCart();
});
function openCart() { cartDrawer.classList.add("active"); overlay.classList.add("active"); cartDrawer.setAttribute("aria-hidden", "false"); }
function closeCart() { cartDrawer.classList.remove("active"); overlay.classList.remove("active"); cartDrawer.setAttribute("aria-hidden", "true"); }
document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("checkout-open").addEventListener("click", () => {
  if (!cartQty()) return showToast("Keranjang masih kosong.");
  closeCart();
  checkoutModal.classList.add("active");
});
document.getElementById("close-checkout").addEventListener("click", () => checkoutModal.classList.remove("active"));
checkoutModal.addEventListener("click", event => { if (event.target === checkoutModal) checkoutModal.classList.remove("active"); });
document.getElementById("checkout-form").addEventListener("submit", event => {
  event.preventDefault();
  const hint = document.getElementById("form-hint");
  if (!STORE_CONFIG.whatsappNumber) {
    hint.textContent = "Checkout belum aktif: isi STORE_CONFIG.whatsappNumber di script.js dengan nomor WhatsApp admin.";
    return;
  }
  const form = new FormData(event.currentTarget);
  const lines = Object.entries(cart).map(([id, item]) => {
    const p = STORE_CONFIG.products[id];
    return `• ${p.name} x${item.qty} — ${rupiah(p.price * item.qty)}`;
  });
  const message = [
    "Halo CareNest, saya ingin melakukan pemesanan:",
    "",
    ...lines,
    "",
    `Subtotal: ${rupiah(cartTotal())}`,
    `Nama: ${form.get("name")}`,
    `WhatsApp: ${form.get("phone")}`,
    `Alamat: ${form.get("address")}`,
    `Catatan: ${form.get("notes") || "-"}`,
    "",
    "Mohon konfirmasi stok, ongkir, dan total akhir. Terima kasih."
  ].join("\n");
  const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
});
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false");
}));
renderCart();
