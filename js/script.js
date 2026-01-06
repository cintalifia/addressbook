/* ==================== DEBUG ==================== */
console.log("script kebaca ✅");

/* ==================== DATA AWAL ==================== */
const initialContacts = [
  {
    id: 1,
    nama: "Cinta Alifia",
    phone: "6285771150002",
    email: "cntalifia0@gmail.com",
    alamat: "Jakarta",
    category: "Semua Kontak",
  },
  {
    id: 2,
    nama: "Theodora Putri",
    phone: "628957183950226834",
    email: "theodoraputri14@gmail.com",
    alamat: "Bandung",
    category: "Semua Kontak",
  },
  {
    id: 3,
    nama: "Balgis Patin",
    phone: "6289513219146",
    email: "balgispatin34@gmail.com",
    alamat: "Yogyakarta",
    category: "Sampah",
  },
  {
    id: 4,
    nama: "Annissa Revy",
    phone: "6289513219146",
    email: "revyannsa18@gmail.com",
    alamat: "Medan",
    category: "Sampah",
  },
];

/* ==================== STATE ==================== */
let contacts = [];
let editId = null;
let deleteId = null;
let activeFilter = "all";

/* ==================== DOM ==================== */
const contactList = document.getElementById("contactList");
const modal = document.getElementById("modal"); // <dialog>
const deleteModal = document.getElementById("deleteConfirmModal"); // <dialog>

const addBtn = document.getElementById("addContactBtn");
const form = document.getElementById("contactForm");
const closeModalBtn = document.getElementById("closeModal");

const cancelDeleteBtn = document.getElementById("cancelDelete");
const confirmDeleteBtn = document.getElementById("confirmDelete");

const searchInput = document.getElementById("searchInput");

/* ==================== LOCAL STORAGE ==================== */
function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function loadContacts() {
  const saved = localStorage.getItem("contacts");
  if (saved) {
    try {
      contacts = JSON.parse(saved) || [];
    } catch (err) {
      console.warn("localStorage rusak, reset ke initial", err);
      contacts = [...initialContacts];
      saveContacts();
    }
  } else {
    contacts = [...initialContacts];
    saveContacts();
  }
}

/* ==================== DIALOG HELPERS (PENTING) ==================== */
function openDialog(dlg) {
  // Tailwind "hidden" = display:none; harus dicabut dulu
  dlg.classList.remove("hidden");
  if (!dlg.open) dlg.showModal();
}

function closeDialog(dlg) {
  if (dlg.open) dlg.close();
  dlg.classList.add("hidden");
}

/* Tutup dialog kalau klik backdrop */
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeDialog(modal);
});
deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) closeDialog(deleteModal);
});

/* ==================== OPEN ADD MODAL ==================== */
addBtn.addEventListener("click", () => {
  editId = null;
  form.reset();
  document.getElementById("category").value = "Semua Kontak";
  openDialog(modal);
});

/* ==================== CLOSE MODAL ==================== */
closeModalBtn.addEventListener("click", () => closeDialog(modal));

/* ==================== SUBMIT FORM ==================== */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nama = document.getElementById("Name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const category = document.getElementById("category").value;

  if (!nama || !phone || !email || !alamat) {
    alert("Semua field wajib diisi!");
    return;
  }

  if (editId === null) {
    contacts.push({
      id: Date.now(),
      nama,
      phone,
      email,
      alamat,
      category,
    });
  } else {
    const idx = contacts.findIndex((c) => c.id === editId);
    if (idx !== -1) {
      contacts[idx] = {
        ...contacts[idx],
        nama,
        phone,
        email,
        alamat,
        category,
      };
    }
  }

  saveContacts();
  closeDialog(modal);
  renderContacts(activeFilter);
});

/* ==================== RENDER CONTACTS ==================== */
function renderContacts(filter = "all") {
  activeFilter = filter;

  let filtered = [...contacts];

  // filter kategori
  if (filter === "sampah") {
    filtered = filtered.filter((c) => c.category === "Sampah");
  }

  // search
  const keyword = (searchInput.value || "").toLowerCase().trim();
  if (keyword) {
    filtered = filtered.filter(
      (c) =>
        c.nama.toLowerCase().includes(keyword) ||
        c.phone.includes(keyword) ||
        c.email.toLowerCase().includes(keyword) ||
        c.alamat.toLowerCase().includes(keyword)
    );
  }

  contactList.innerHTML = "";

  if (filtered.length === 0) {
    contactList.innerHTML = `
      <tr>
        <td colspan="6" class="py-6 text-gray-600">
          ${keyword ? "Tidak ada kontak ditemukan" : "Belum ada kontak"}
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="p-4">${c.nama}</td>
      <td class="p-4">${c.phone}</td>
      <td class="p-4">${c.email}</td>
      <td class="p-4">${c.alamat}</td>
      <td class="p-4">${c.category}</td>
      <td class="p-4 flex gap-2 justify-center">
        <button data-edit="${c.id}"
          class="px-3 py-1 rounded-xl bg-blue-300 hover:bg-blue-400 text-white">
          ✏️ Edit
        </button>
        <button data-del="${c.id}"
          class="px-3 py-1 rounded-xl bg-red-300 hover:bg-red-400 text-white">
          🗑️ Hapus
        </button>
      </td>
    `;
    contactList.appendChild(tr);
  });
}

/* ==================== EVENT DELEGATION (EDIT/DELETE) ==================== */
contactList.addEventListener("click", (e) => {
  const editBtn = e.target.closest("[data-edit]");
  const delBtn = e.target.closest("[data-del]");

  if (editBtn) {
    const id = Number(editBtn.dataset.edit);
    editContact(id);
  }

  if (delBtn) {
    const id = Number(delBtn.dataset.del);
    openDeleteModal(id);
  }
});

/* ==================== EDIT ==================== */
function editContact(id) {
  editId = id;
  const c = contacts.find((ct) => ct.id === id);
  if (!c) return;

  document.getElementById("Name").value = c.nama;
  document.getElementById("phone").value = c.phone;
  document.getElementById("email").value = c.email;
  document.getElementById("alamat").value = c.alamat;
  document.getElementById("category").value = c.category;

  openDialog(modal);
}

/* ==================== DELETE ==================== */
function openDeleteModal(id) {
  deleteId = id;
  openDialog(deleteModal);
}

cancelDeleteBtn.addEventListener("click", () => {
  deleteId = null;
  closeDialog(deleteModal);
});

confirmDeleteBtn.addEventListener("click", () => {
  contacts = contacts.filter((c) => c.id !== deleteId);
  saveContacts();
  deleteId = null;
  closeDialog(deleteModal);
  renderContacts(activeFilter);
});

/* ==================== FILTER ==================== */
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    renderContacts(btn.dataset.category);
  });
});

/* ==================== SEARCH ==================== */
searchInput.addEventListener("input", () => {
  renderContacts(activeFilter);
});

/* ==================== INIT ==================== */
loadContacts();
renderContacts("all");
