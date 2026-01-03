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

/* ==================== LOCAL STORAGE ==================== */
function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

/* 🔥 FIX UTAMA: PAKSA PAKAI DATA KAMU */
function loadContacts() {
  contacts = [...initialContacts];
  saveContacts();
}

/* ==================== DOM ==================== */
const contactList = document.getElementById("contactList");
const modal = document.getElementById("modal");
const deleteModal = document.getElementById("deleteConfirmModal");

/* ==================== OPEN ADD MODAL ==================== */
document.getElementById("addContactBtn").addEventListener("click", () => {
  editId = null;
  document.getElementById("contactForm").reset();
  modal.classList.remove("hidden");
});

/* ==================== CLOSE MODAL ==================== */
document.getElementById("closeModal").addEventListener("click", () => {
  modal.classList.add("hidden");
});

/* ==================== SUBMIT FORM ==================== */
document.getElementById("contactForm").addEventListener("submit", (e) => {
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
    const index = contacts.findIndex((c) => c.id === editId);
    contacts[index] = {
      ...contacts[index],
      nama,
      phone,
      email,
      alamat,
      category,
    };
  }

  saveContacts();
  modal.classList.add("hidden");
  renderContacts();
});

/* ==================== RENDER CONTACTS ==================== */
function renderContacts(filter = "all") {
  contactList.innerHTML = "";

  let filteredContacts = contacts;
  if (filter === "sampah") {
    filteredContacts = contacts.filter((c) => c.category === "Sampah");
  }

  if (filteredContacts.length === 0) {
    contactList.innerHTML = `
      <tr>
        <td colspan="6" class="py-6 text-gray-600">
          Belum ada kontak
        </td>
      </tr>
    `;
    return;
  }

  filteredContacts.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="p-4">${c.nama}</td>
      <td class="p-4">${c.phone}</td>
      <td class="p-4">${c.email}</td>
      <td class="p-4">${c.alamat}</td>
      <td class="p-4">${c.category}</td>
      <td class="p-4 flex gap-2 justify-center">
        <button onclick="editContact(${c.id})"
          class="px-3 py-1 rounded-xl bg-blue-300 hover:bg-blue-400 text-white">
          ✏️ Edit
        </button>
        <button onclick="openDeleteModal(${c.id})"
          class="px-3 py-1 rounded-xl bg-red-300 hover:bg-red-400 text-white">
          🗑️ Hapus
        </button>
      </td>
    `;
    contactList.appendChild(tr);
  });
}

/* ==================== EDIT ==================== */
function editContact(id) {
  editId = id;
  const c = contacts.find((ct) => ct.id === id);

  document.getElementById("Name").value = c.nama;
  document.getElementById("phone").value = c.phone;
  document.getElementById("email").value = c.email;
  document.getElementById("alamat").value = c.alamat;
  document.getElementById("category").value = c.category;

  modal.classList.remove("hidden");
}

/* ==================== DELETE ==================== */
function openDeleteModal(id) {
  deleteId = id;
  deleteModal.classList.remove("hidden");
}

document.getElementById("cancelDelete").addEventListener("click", () => {
  deleteModal.classList.add("hidden");
  deleteId = null;
});

document.getElementById("confirmDelete").addEventListener("click", () => {
  contacts = contacts.filter((c) => c.id !== deleteId);
  saveContacts();
  deleteModal.classList.add("hidden");
  deleteId = null;
  renderContacts();
});

/* ==================== FILTER ==================== */
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    renderContacts(btn.dataset.category);
  });
});

/* ==================== SEARCH ==================== */
document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const filtered = contacts.filter(
    (c) =>
      c.nama.toLowerCase().includes(keyword) ||
      c.phone.includes(keyword) ||
      c.email.toLowerCase().includes(keyword)
  );

  contactList.innerHTML = "";

  if (filtered.length === 0) {
    contactList.innerHTML = `
      <tr>
        <td colspan="6" class="py-6 text-gray-600">
          Tidak ada kontak ditemukan
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
        <button onclick="editContact(${c.id})"
          class="px-3 py-1 bg-blue-300 rounded">
          Edit
        </button>
        <button onclick="openDeleteModal(${c.id})"
          class="px-3 py-1 bg-red-300 rounded">
          Hapus
        </button>
      </td>
    `;
    contactList.appendChild(tr);
  });
});

/* ==================== INIT ==================== */
loadContacts();
renderContacts();
