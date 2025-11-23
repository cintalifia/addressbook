let contacts = [];
let editId = null;
let deleteId = null;

// Elemen DOM
const contactList = document.getElementById("contactList");
const modal = document.getElementById("modal");
const deleteModal = document.getElementById("deleteConfirmModal");

// Buka modal tambah kontak
document.getElementById("addContactBtn").addEventListener("click", () => {
    editId = null;
    document.getElementById("contactForm").reset();
    modal.classList.remove("hidden");
});

// Tutup modal tambah/edit
document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.add("hidden");
});

// Simpan / Update Kontak
document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("Name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const alamat = document.getElementById("alamat").value;
    const category = document.getElementById("category").value;

    if (editId === null) {
        // Tambah kontak baru
        const newContact = {
            id: Date.now(),
            nama,
            phone,
            email,
            alamat,
            category
        };
        contacts.push(newContact);
    } else {
        // Update kontak
        const idx = contacts.findIndex(c => c.id === editId);
        contacts[idx] = { ...contacts[idx], nama, phone, email, alamat, category };
    }

    modal.classList.add("hidden");
    renderContacts();
});

// Render tabel kontak
function renderContacts(filter = "Semua Kontak") {
    contactList.innerHTML = "";

    let filtered = contacts;

    if (filter === "sampah") {
        filtered = contacts.filter(c => c.category === "Sampah");
    }

    if (filtered.length === 0) {
        contactList.innerHTML = `
        <tr id="emptyRow">
            <td colspan="6" class="py-6 text-gray-600">
                Belum ada kontak — klik <span class="font-semibold text-pink-600">+ Tambah Kontak</span> untuk mulai
            </td>
        </tr>`;
        return;
    }

    filtered.forEach(c => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="p-4">${c.nama}</td>
            <td class="p-4">${c.phone}</td>
            <td class="p-4">${c.email}</td>
            <td class="p-4">${c.alamat}</td>
            <td class="p-4">${c.category.charAt(0).toUpperCase() + c.category.slice(1)}</td>

            <td class="p-4 flex gap-2 justify-center">

                <button class="px-3 py-1 rounded-xl bg-blue-300 hover:bg-blue-400 text-white text-sm shadow"
                    onclick="editContact(${c.id})">
                    ✏️ Edit
                </button>

                <button class="px-3 py-1 rounded-xl bg-red-300 hover:bg-red-400 text-white text-sm shadow"
                    onclick="openDeleteModal(${c.id})">
                    🗑️ Hapus
                </button>

            </td>
        `;

        contactList.appendChild(tr);
    });
}

// Edit kontak
function editContact(id) {
    editId = id;
    const c = contacts.find(ct => ct.id === id);

    document.getElementById("Name").value = c.nama;
    document.getElementById("phone").value = c.phone;
    document.getElementById("email").value = c.email;
    document.getElementById("alamat").value = c.alamat;
    document.getElementById("category").value = c.category;

    modal.classList.remove("hidden");
}

// Buka modal konfirmasi hapus
function openDeleteModal(id) {
    deleteId = id;
    deleteModal.classList.remove("hidden");
}

// Batalkan hapus
document.getElementById("cancelDelete").addEventListener("click", () => {
    deleteModal.classList.add("hidden");
    deleteId = null;
});

// Konfirmasi hapus (hapus permanen)
document.getElementById("confirmDelete").addEventListener("click", () => {
    contacts = contacts.filter(c => c.id !== deleteId);
    deleteModal.classList.add("hidden");
    deleteId = null;
    renderContacts();
});

// Filter kategori
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.category;
        renderContacts(filter);
    });
});

// Search kontak
document.getElementById("searchInput").addEventListener("input", function () {
    const search = this.value.toLowerCase();

    const filtered = contacts.filter(c =>
        c.nama.toLowerCase().includes(search) ||
        c.phone.includes(search) ||
        c.email.toLowerCase().includes(search)
    );

    contactList.innerHTML = "";

    if (filtered.length === 0) {
        contactList.innerHTML = `
        <tr id="emptyRow">
            <td colspan="6" class="py-6 text-gray-600">
                Tidak ada kontak ditemukan
            </td>
        </tr>`;
        return;
    }

    filtered.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML =
            `<td class="p-4">${c.nama}</td>
            <td class="p-4">${c.phone}</td>
            <td class="p-4">${c.email}</td>
            <td class="p-4">${c.alamat}</td>
            <td class="p-4">${c.category}</td>
            <td class="p-4">
                <button onclick="editContact(${c.id})" class="px-3 py-1 bg-blue-300 rounded">Edit</button>
                <button onclick="openDeleteModal(${c.id})" class="px-3 py-1 bg-red-300 rounded">Hapus</button>
            </td>`;
        contactList.appendChild(tr);
    });
});
