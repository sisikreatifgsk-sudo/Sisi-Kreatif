const loginScreen = document.getElementById("login-screen");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("login-form");
const loginMsg = document.getElementById("login-msg");
const logoutBtn = document.getElementById("logout-btn");

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// ---------- AUTH ----------

async function checkSession() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    showDashboard();
  } else {
    showLogin();
  }
}

function showLogin() {
  loginScreen.style.display = "flex";
  dashboard.style.display = "none";
}

function showDashboard() {
  loginScreen.style.display = "none";
  dashboard.style.display = "block";
  loadAdminList();
  loadPortfolioAdminList();
  loadReviewAdminList();
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginMsg.textContent = "Memeriksa…";
  loginMsg.className = "form-msg";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
      loginMsg.textContent = "Email atau kata sandi salah.";
      loginMsg.className = "form-msg error";
      return;
    }

    loginMsg.textContent = "";
    showDashboard();
  } catch (err) {
    console.error(err);
    loginMsg.textContent = "Tidak bisa terhubung ke server. Cek js/supabase-client.js (URL & key Supabase) dan koneksi internet Anda.";
    loginMsg.className = "form-msg error";
  }
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLogin();
});

// ---------- TABS ----------

document.querySelectorAll(".admin-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.style.display = "none");
    tab.classList.add("active");
    document.getElementById("tab-" + tab.dataset.tab).style.display = "grid";
  });
});

// ---------- STORAGE UPLOAD HELPER ----------

async function uploadToMedia(file, folder) {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabaseClient.storage.from("media").upload(path, file);
  if (error) throw error;

  const { data } = supabaseClient.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

function detectMediaType(file) {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "document";
}

// ============================================
// LAYANAN
// ============================================

const serviceForm = document.getElementById("service-form");
const formMsg = document.getElementById("form-msg");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit");
const adminList = document.getElementById("admin-list");
const serviceImageInput = document.getElementById("service-image");
const serviceImagePreview = document.getElementById("service-image-preview");

let currentServiceImageUrl = "";

serviceImageInput.addEventListener("change", () => {
  const file = serviceImageInput.files[0];
  if (!file) return;
  serviceImagePreview.innerHTML = `<img class="file-preview-img" src="${URL.createObjectURL(file)}">`;
});

async function loadAdminList() {
  adminList.innerHTML = `<li class="empty-state">Memuat…</li>`;

  const { data, error } = await supabaseClient
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    adminList.innerHTML = `<li class="empty-state">Gagal memuat data.</li>`;
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    adminList.innerHTML = `<li class="empty-state">Belum ada layanan. Tambahkan lewat form di samping.</li>`;
    return;
  }

  adminList.innerHTML = data.map(service => `
    <li>
      <div class="admin-row">
        <div class="admin-row-info">
          <b>${escapeHtml(service.title)}</b>
          <div class="meta">${escapeHtml(service.category || "")} · ${escapeHtml(service.price || "-")}</div>
        </div>
        <div class="row-actions">
          <button class="icon-btn" onclick="startEdit('${service.id}')">Edit</button>
          <button class="icon-btn danger" onclick="deleteService('${service.id}')">Hapus</button>
        </div>
      </div>
    </li>
  `).join("");

  window.__services = data;
}

serviceForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("service-id").value;
  formMsg.textContent = "Menyimpan…";
  formMsg.className = "form-msg";
  submitBtn.disabled = true;

  try {
    let imageUrl = currentServiceImageUrl;
    const file = serviceImageInput.files[0];
    if (file) {
      formMsg.textContent = "Mengunggah gambar…";
      imageUrl = await uploadToMedia(file, "services");
    }

    const payload = {
      title: document.getElementById("title").value.trim(),
      category: document.getElementById("category").value,
      description: document.getElementById("description").value.trim(),
      price: document.getElementById("price").value.trim(),
      price_numeric: parseFloat(document.getElementById("price-numeric").value) || 0,
      image_url: imageUrl,
    };

    let error;
    if (id) {
      ({ error } = await supabaseClient.from("services").update(payload).eq("id", id));
    } else {
      ({ error } = await supabaseClient.from("services").insert(payload));
    }
    if (error) throw error;

    formMsg.textContent = "Tersimpan.";
    formMsg.className = "form-msg success";
    resetForm();
    loadAdminList();
  } catch (err) {
    formMsg.textContent = "Gagal menyimpan. Coba lagi.";
    formMsg.className = "form-msg error";
    console.error(err);
  } finally {
    submitBtn.disabled = false;
  }
});

function startEdit(id) {
  const service = (window.__services || []).find(s => s.id === id);
  if (!service) return;

  document.getElementById("service-id").value = service.id;
  document.getElementById("title").value = service.title || "";
  document.getElementById("category").value = service.category || "Desain Grafis";
  document.getElementById("description").value = service.description || "";
  document.getElementById("price").value = service.price || "";
  document.getElementById("price-numeric").value = service.price_numeric || "";
  currentServiceImageUrl = service.image_url || "";
  serviceImagePreview.innerHTML = currentServiceImageUrl
    ? `<img class="file-preview-img" src="${currentServiceImageUrl}">`
    : "";
  serviceImageInput.value = "";

  formTitle.textContent = "Edit layanan";
  submitBtn.textContent = "Simpan perubahan";
  cancelEditBtn.style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
  serviceForm.reset();
  document.getElementById("service-id").value = "";
  currentServiceImageUrl = "";
  serviceImagePreview.innerHTML = "";
  formTitle.textContent = "Tambah layanan";
  submitBtn.textContent = "Simpan layanan";
  cancelEditBtn.style.display = "none";
}

async function deleteService(id) {
  if (!confirm("Hapus layanan ini?")) return;
  const { error } = await supabaseClient.from("services").delete().eq("id", id);
  if (error) { alert("Gagal menghapus."); console.error(error); return; }
  loadAdminList();
}

// ============================================
// PORTOFOLIO
// ============================================

const portfolioForm = document.getElementById("portfolio-form");
const portfolioFormMsg = document.getElementById("portfolio-form-msg");
const portfolioFormTitle = document.getElementById("portfolio-form-title");
const portfolioSubmitBtn = document.getElementById("portfolio-submit-btn");
const portfolioCancelBtn = document.getElementById("portfolio-cancel-edit");
const portfolioAdminList = document.getElementById("portfolio-admin-list");
const portfolioFileInput = document.getElementById("portfolio-file");
const portfolioFilePreview = document.getElementById("portfolio-file-preview");

let currentPortfolioMediaUrl = "";
let currentPortfolioMediaType = "";

portfolioFileInput.addEventListener("change", () => {
  const file = portfolioFileInput.files[0];
  if (!file) return;
  const type = detectMediaType(file);
  if (type === "image") {
    portfolioFilePreview.innerHTML = `<img class="file-preview-img" src="${URL.createObjectURL(file)}">`;
  } else {
    portfolioFilePreview.innerHTML = `<span class="upload-status">File dipilih: ${escapeHtml(file.name)}</span>`;
  }
});

async function loadPortfolioAdminList() {
  portfolioAdminList.innerHTML = `<li class="empty-state">Memuat…</li>`;

  const { data, error } = await supabaseClient
    .from("portfolios")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    portfolioAdminList.innerHTML = `<li class="empty-state">Gagal memuat data.</li>`;
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    portfolioAdminList.innerHTML = `<li class="empty-state">Belum ada portofolio.</li>`;
    return;
  }

  portfolioAdminList.innerHTML = data.map(item => `
    <li>
      <div class="admin-row">
        <div class="admin-row-info">
          <b>${escapeHtml(item.title)}</b>
          <div class="meta">${escapeHtml(item.media_type || "")}</div>
        </div>
        <div class="row-actions">
          <button class="icon-btn" onclick="startEditPortfolio('${item.id}')">Edit</button>
          <button class="icon-btn danger" onclick="deletePortfolio('${item.id}')">Hapus</button>
        </div>
      </div>
    </li>
  `).join("");

  window.__portfolio = data;
}

portfolioForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("portfolio-id").value;
  portfolioFormMsg.textContent = "Menyimpan…";
  portfolioFormMsg.className = "form-msg";
  portfolioSubmitBtn.disabled = true;

  try {
    let mediaUrl = currentPortfolioMediaUrl;
    let mediaType = currentPortfolioMediaType;
    const file = portfolioFileInput.files[0];
    if (file) {
      portfolioFormMsg.textContent = "Mengunggah file…";
      mediaUrl = await uploadToMedia(file, "portfolio");
      mediaType = detectMediaType(file);
    }

    const payload = {
      title: document.getElementById("portfolio-title").value.trim(),
      description: document.getElementById("portfolio-description").value.trim(),
      media_url: mediaUrl,
      media_type: mediaType,
    };

    let error;
    if (id) {
      ({ error } = await supabaseClient.from("portfolios").update(payload).eq("id", id));
    } else {
      ({ error } = await supabaseClient.from("portfolios").insert(payload));
    }
    if (error) throw error;

    portfolioFormMsg.textContent = "Tersimpan.";
    portfolioFormMsg.className = "form-msg success";
    resetPortfolioForm();
    loadPortfolioAdminList();
  } catch (err) {
    portfolioFormMsg.textContent = "Gagal menyimpan. Coba lagi.";
    portfolioFormMsg.className = "form-msg error";
    console.error(err);
  } finally {
    portfolioSubmitBtn.disabled = false;
  }
});

function startEditPortfolio(id) {
  const item = (window.__portfolio || []).find(p => p.id === id);
  if (!item) return;

  document.getElementById("portfolio-id").value = item.id;
  document.getElementById("portfolio-title").value = item.title || "";
  document.getElementById("portfolio-description").value = item.description || "";
  currentPortfolioMediaUrl = item.media_url || "";
  currentPortfolioMediaType = item.media_type || "";
  portfolioFilePreview.innerHTML = currentPortfolioMediaType === "image" && currentPortfolioMediaUrl
    ? `<img class="file-preview-img" src="${currentPortfolioMediaUrl}">`
    : (currentPortfolioMediaUrl ? `<span class="upload-status">File tersimpan: ${escapeHtml(currentPortfolioMediaType)}</span>` : "");
  portfolioFileInput.value = "";

  portfolioFormTitle.textContent = "Edit portofolio";
  portfolioSubmitBtn.textContent = "Simpan perubahan";
  portfolioCancelBtn.style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

portfolioCancelBtn.addEventListener("click", resetPortfolioForm);

function resetPortfolioForm() {
  portfolioForm.reset();
  document.getElementById("portfolio-id").value = "";
  currentPortfolioMediaUrl = "";
  currentPortfolioMediaType = "";
  portfolioFilePreview.innerHTML = "";
  portfolioFormTitle.textContent = "Tambah portofolio";
  portfolioSubmitBtn.textContent = "Simpan portofolio";
  portfolioCancelBtn.style.display = "none";
}

async function deletePortfolio(id) {
  if (!confirm("Hapus item portofolio ini?")) return;
  const { error } = await supabaseClient.from("portfolios").delete().eq("id", id);
  if (error) { alert("Gagal menghapus."); console.error(error); return; }
  loadPortfolioAdminList();
}

// ============================================
// REVIEW
// ============================================

const reviewForm = document.getElementById("review-form");
const reviewFormMsg = document.getElementById("review-form-msg");
const reviewAdminList = document.getElementById("review-admin-list");

async function loadReviewAdminList() {
  reviewAdminList.innerHTML = `<li class="empty-state">Memuat…</li>`;

  const { data, error } = await supabaseClient
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    reviewAdminList.innerHTML = `<li class="empty-state">Gagal memuat data.</li>`;
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    reviewAdminList.innerHTML = `<li class="empty-state">Belum ada review.</li>`;
    return;
  }

  reviewAdminList.innerHTML = data.map(r => `
    <li>
      <div class="admin-row">
        <div class="admin-row-info">
          <b>${escapeHtml(r.client_name)}</b>
          <div class="meta">${"★".repeat(r.rating || 5)} · ${escapeHtml((r.review_text || "").slice(0, 40))}${(r.review_text || "").length > 40 ? "…" : ""}</div>
        </div>
        <div class="row-actions">
          <button class="icon-btn danger" onclick="deleteReview('${r.id}')">Hapus</button>
        </div>
      </div>
    </li>
  `).join("");
}

reviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  reviewFormMsg.textContent = "Menyimpan…";
  reviewFormMsg.className = "form-msg";

  const payload = {
    client_name: document.getElementById("client-name").value.trim(),
    rating: parseInt(document.getElementById("rating").value),
    review_text: document.getElementById("review-text").value.trim(),
  };

  const { error } = await supabaseClient.from("reviews").insert(payload);

  if (error) {
    reviewFormMsg.textContent = "Gagal menyimpan.";
    reviewFormMsg.className = "form-msg error";
    console.error(error);
    return;
  }

  reviewFormMsg.textContent = "Tersimpan.";
  reviewFormMsg.className = "form-msg success";
  reviewForm.reset();
  loadReviewAdminList();
});

async function deleteReview(id) {
  if (!confirm("Hapus review ini?")) return;
  const { error } = await supabaseClient.from("reviews").delete().eq("id", id);
  if (error) { alert("Gagal menghapus."); console.error(error); return; }
  loadReviewAdminList();
}

checkSession();
