document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());

// ---------- Carousel geser (Layanan / Portofolio / Review) ----------

function initHscroll(el) {
  if (!el || el.dataset.hscrollInit) return;
  el.dataset.hscrollInit = "1";

  const wrap = el.closest(".hscroll-wrap");
  const leftBtn = wrap ? wrap.querySelector(".hscroll-arrow.left") : null;
  const rightBtn = wrap ? wrap.querySelector(".hscroll-arrow.right") : null;

  function updateArrows() {
    if (!leftBtn || !rightBtn) return;
    const maxScroll = el.scrollWidth - el.clientWidth - 2;
    const overflowing = el.scrollWidth > el.clientWidth + 2;
    leftBtn.style.display = overflowing ? "flex" : "none";
    rightBtn.style.display = overflowing ? "flex" : "none";
    leftBtn.disabled = el.scrollLeft <= 2;
    rightBtn.disabled = el.scrollLeft >= maxScroll;
  }

  // Drag-to-scroll pakai mouse
  let isDown = false, startX = 0, startScroll = 0, moved = false;

  el.addEventListener("mousedown", (e) => {
    isDown = true;
    moved = false;
    el.classList.add("dragging");
    startX = e.pageX;
    startScroll = el.scrollLeft;
  });
  window.addEventListener("mouseup", () => {
    isDown = false;
    el.classList.remove("dragging");
  });
  window.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 4) moved = true;
    el.scrollLeft = startScroll - dx;
  });
  // Cegah klik kartu terpicu tepat setelah drag
  el.addEventListener("click", (e) => {
    if (moved) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  // Scroll roda mouse vertikal jadi horizontal
  el.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });

  el.addEventListener("scroll", updateArrows);
  window.addEventListener("resize", updateArrows);

  if (leftBtn) leftBtn.addEventListener("click", () => {
    el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
  });
  if (rightBtn) rightBtn.addEventListener("click", () => {
    el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
  });

  // Cek ulang setelah konten dinamis (Supabase) selesai render
  const observer = new MutationObserver(updateArrows);
  observer.observe(el, { childList: true });

  updateArrows();
}

document.querySelectorAll(".hscroll").forEach(initHscroll);

// Nomor WA tujuan pemesanan (sama seperti di section Kontak)
const WA_NUMBER = "6289510579739";

function formatRupiah(num) {
  return "Rp" + Number(num || 0).toLocaleString("id-ID");
}

function waLink(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// ---------- Detail modal (shared) ----------

const detailOverlay = document.getElementById("detail-overlay");
const detailMediaWrap = document.getElementById("detail-media-wrap");
const detailBody = document.getElementById("detail-body");

function openDetail({ mediaHtml, bodyHtml }) {
  detailMediaWrap.innerHTML = mediaHtml || "";
  detailBody.innerHTML = bodyHtml;
  detailOverlay.classList.add("show");
}

function closeDetail() {
  detailOverlay.classList.remove("show");
  detailMediaWrap.innerHTML = "";
}

document.getElementById("detail-close").addEventListener("click", closeDetail);
detailOverlay.addEventListener("click", (e) => {
  if (e.target === detailOverlay) closeDetail();
});

// ---------- Services ----------

async function loadServices() {
  const listEl = document.getElementById("services-list");

  const { data, error } = await supabaseClient
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    listEl.innerHTML = `<div class="empty-state">Layanan belum bisa dimuat. Cek pengaturan Supabase.</div>`;
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    listEl.innerHTML = `<div class="empty-state">Belum ada layanan ditambahkan.</div>`;
    return;
  }

  window.__allServices = data;

  listEl.innerHTML = data.map(service => `
    <div class="info-card" data-id="${service.id}">
      <div class="thumb">
        ${service.image_url
          ? `<img src="${escapeHtml(service.image_url)}" alt="${escapeHtml(service.title)}">`
          : `<div class="thumb-placeholder">Sisi Kreatif</div>`}
      </div>
      <div class="body">
        <span class="service-cat">${escapeHtml(service.category || "Layanan")}</span>
        <h3>${escapeHtml(service.title)}</h3>
        <p>${escapeHtml(service.description || "")}</p>
        ${service.price ? `<span class="service-price">${escapeHtml(service.price)}</span>` : ""}
        <div class="menu-actions">
          <button class="btn-add" data-id="${service.id}" data-action="add-cart">+ Keranjang</button>
          <button class="btn-wa" data-id="${service.id}" data-action="wa-order" title="Pesan langsung via WhatsApp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-2.9.9.9-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.7.8-.9 1c-.2.2-.3.2-.6.1-.2-.1-1.1-.4-2-1.3-.7-.7-1.2-1.5-1.4-1.7-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5s0-.4-.1-.5c-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.6 1.1 2.8c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join("");

  listEl.querySelectorAll(".info-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("[data-action]")) return; // jangan buka detail kalau klik tombol aksi
      const service = data.find(s => s.id === card.dataset.id);
      openDetail({
        mediaHtml: service.image_url
          ? `<img class="detail-media" src="${escapeHtml(service.image_url)}" alt="${escapeHtml(service.title)}">`
          : "",
        bodyHtml: `
          <span class="service-cat">${escapeHtml(service.category || "Layanan")}</span>
          <h2>${escapeHtml(service.title)}</h2>
          <p>${escapeHtml(service.description || "")}</p>
          ${service.price ? `<span class="service-price">${escapeHtml(service.price)}</span>` : ""}
        `
      });
    });
  });

  listEl.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });

  listEl.querySelectorAll('[data-action="wa-order"]').forEach(btn => {
    btn.addEventListener("click", () => {
      const service = data.find(s => s.id === btn.dataset.id);
      const message = `Halo Sisi Kreatif, saya mau pesan layanan:\n\n*${service.title}*${service.price ? " - " + service.price : ""}\n\nApakah bisa dibantu? Terima kasih.`;
      window.open(waLink(message), "_blank");
    });
  });
}

// ---------- Portfolio ----------

async function loadPortfolio() {
  const listEl = document.getElementById("portfolio-list");

  const { data, error } = await supabaseClient
    .from("portfolios")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    listEl.innerHTML = `<div class="empty-state">Portofolio belum bisa dimuat.</div>`;
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    listEl.innerHTML = `<div class="empty-state">Belum ada portofolio ditambahkan.</div>`;
    return;
  }

  listEl.innerHTML = data.map(item => `
    <div class="info-card" data-id="${item.id}">
      <div class="thumb">
        ${renderThumb(item)}
        <span class="media-badge">${mediaLabel(item.media_type)}</span>
      </div>
      <div class="body">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description || "")}</p>
      </div>
    </div>
  `).join("");

  listEl.querySelectorAll(".info-card").forEach(card => {
    card.addEventListener("click", () => {
      const item = data.find(p => p.id === card.dataset.id);
      openDetail({
        mediaHtml: renderDetailMedia(item),
        bodyHtml: `
          <h2>${escapeHtml(item.title)}</h2>
          <p>${escapeHtml(item.description || "")}</p>
        `
      });
    });
  });
}

function mediaLabel(type) {
  if (type === "video") return "Video";
  if (type === "document") return "Dokumen";
  return "Gambar";
}

function renderThumb(item) {
  if (!item.media_url) return `<div class="thumb-placeholder">Sisi Kreatif</div>`;
  if (item.media_type === "image") {
    return `<img src="${escapeHtml(item.media_url)}" alt="${escapeHtml(item.title)}">`;
  }
  if (item.media_type === "video") {
    return `<video src="${escapeHtml(item.media_url)}" muted></video>`;
  }
  return `<div class="thumb-placeholder">📄 Dokumen</div>`;
}

function renderDetailMedia(item) {
  if (!item.media_url) return "";
  if (item.media_type === "image") {
    return `<img class="detail-media" src="${escapeHtml(item.media_url)}" alt="${escapeHtml(item.title)}">`;
  }
  if (item.media_type === "video") {
    return `<video class="detail-media" src="${escapeHtml(item.media_url)}" controls></video>`;
  }
  return `<div class="detail-media" style="display:flex;align-items:center;justify-content:center;">
    <a class="doc-link" href="${escapeHtml(item.media_url)}" target="_blank" rel="noopener">📄 Buka dokumen</a>
  </div>`;
}

// ---------- Reviews ----------

async function loadReviews() {
  const listEl = document.getElementById("review-list");

  const { data, error } = await supabaseClient
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    listEl.innerHTML = `<div class="empty-state">Review belum bisa dimuat.</div>`;
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    listEl.innerHTML = `<div class="empty-state">Belum ada review.</div>`;
    return;
  }

  listEl.innerHTML = data.map(r => `
    <div class="review-card">
      <div class="review-stars">${"★".repeat(r.rating || 5)}${"☆".repeat(5 - (r.rating || 5))}</div>
      <p class="review-text">"${escapeHtml(r.review_text)}"</p>
      <div class="review-name">${escapeHtml(r.client_name)}</div>
    </div>
  `).join("");
}

// ============================================
// KERANJANG & CHECKOUT
// ============================================

let cart = JSON.parse(localStorage.getItem("sk_cart") || "{}"); // { serviceId: qty }

function saveCart() {
  localStorage.setItem("sk_cart", JSON.stringify(cart));
  renderCartCount();
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  openCartDrawer();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCartDrawer();
}

function cartEntries() {
  const services = window.__allServices || [];
  return Object.entries(cart)
    .map(([id, qty]) => {
      const service = services.find(s => s.id === id);
      if (!service) return null;
      const price = Number(service.price_numeric || 0);
      return { ...service, qty, unitPrice: price, subtotal: price * qty };
    })
    .filter(Boolean);
}

function cartTotal() {
  return cartEntries().reduce((sum, e) => sum + e.subtotal, 0);
}

function renderCartCount() {
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

function renderCartDrawer() {
  const bodyEl = document.getElementById("cart-body");
  const entries = cartEntries();

  if (entries.length === 0) {
    bodyEl.innerHTML = `<div class="empty-cart">Keranjang masih kosong.<br>Yuk pilih layanan yang Anda butuhkan.</div>`;
  } else {
    bodyEl.innerHTML = entries.map(e => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${escapeHtml(e.title)}</div>
          <div class="cart-item-price">${formatRupiah(e.unitPrice)}</div>
        </div>
        <div class="qty-control">
          <button data-id="${e.id}" data-delta="-1">−</button>
          <span>${e.qty}</span>
          <button data-id="${e.id}" data-delta="1">+</button>
        </div>
      </div>
    `).join("");

    bodyEl.querySelectorAll(".qty-control button").forEach(btn => {
      btn.addEventListener("click", () => changeQty(btn.dataset.id, parseInt(btn.dataset.delta)));
    });
  }

  document.getElementById("cart-total").textContent = formatRupiah(cartTotal());
}

// ---- Drawer open/close ----
const cartOverlay = document.getElementById("cart-overlay");
const cartDrawer = document.getElementById("cart-drawer");

function openCartDrawer() {
  cartOverlay.classList.add("show");
  cartDrawer.classList.add("show");
  renderCartDrawer();
}

function closeCartDrawer() {
  cartOverlay.classList.remove("show");
  cartDrawer.classList.remove("show");
}

document.getElementById("open-cart").addEventListener("click", openCartDrawer);
document.getElementById("close-cart").addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", () => {
  closeCartDrawer();
  closeCheckoutModal();
});

// ---- Checkout modal ----
const checkoutOverlay = document.getElementById("checkout-overlay");
const checkoutStep1 = document.getElementById("checkout-step-1");
const checkoutStep2 = document.getElementById("checkout-step-2");

function openCheckoutModal() {
  if (cartEntries().length === 0) return;
  checkoutOverlay.classList.add("show");
  checkoutStep1.style.display = "block";
  checkoutStep2.style.display = "none";
  renderCheckoutSummary();
}

function closeCheckoutModal() {
  checkoutOverlay.classList.remove("show");
}

function renderCheckoutSummary() {
  const entries = cartEntries();
  document.getElementById("summary-list").innerHTML = entries.map(e => `
    <div class="summary-row"><span>${e.qty}x ${escapeHtml(e.title)}</span><span>${formatRupiah(e.subtotal)}</span></div>
  `).join("");
  document.getElementById("modal-total").textContent = formatRupiah(cartTotal());
  document.getElementById("qris-total").textContent = formatRupiah(cartTotal());
}

document.getElementById("checkout-btn").addEventListener("click", () => {
  closeCartDrawer();
  openCheckoutModal();
});

document.getElementById("back-to-cart-btn").addEventListener("click", () => {
  closeCheckoutModal();
  openCartDrawer();
});

document.getElementById("to-payment-btn").addEventListener("click", () => {
  const name = document.getElementById("cust-name").value.trim();
  if (!name) {
    alert("Mohon isi nama Anda dulu ya.");
    return;
  }
  checkoutStep1.style.display = "none";
  checkoutStep2.style.display = "block";
});

document.getElementById("back-to-step1-btn").addEventListener("click", () => {
  checkoutStep1.style.display = "block";
  checkoutStep2.style.display = "none";
});

document.getElementById("confirm-paid-btn").addEventListener("click", () => {
  const name = document.getElementById("cust-name").value.trim();
  const note = document.getElementById("cust-note").value.trim();
  const entries = cartEntries();

  let message = `Halo Sisi Kreatif, saya sudah bayar via QRIS untuk pesanan jasa berikut:\n\n`;
  message += `Nama: ${name}\n\n`;
  entries.forEach(e => {
    message += `${e.qty}x ${e.title} - ${formatRupiah(e.subtotal)}\n`;
  });
  message += `\nTotal: ${formatRupiah(cartTotal())}`;
  if (note) message += `\nCatatan: ${note}`;
  message += `\n\nMohon dikonfirmasi ya, terima kasih!`;

  window.open(waLink(message), "_blank");

  cart = {};
  saveCart();
  closeCheckoutModal();
  document.getElementById("cust-name").value = "";
  document.getElementById("cust-note").value = "";
});

loadServices();
loadPortfolio();
loadReviews();
renderCartCount();
