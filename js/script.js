document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addContactBtn");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("closeModal");
    const form = document.getElementById("contactForm");
    const contactList = document.getElementById("contactList");
    const searchInput = document.getElementById("searchInput");

    // Modal hapus
    const deleteModal = document.getElementById("deleteConfirmModal");
    const cancelDelete = document.getElementById("cancelDelete");
    const confirmDelete = document.getElementById("confirmDelete");

    let contacts = [];
    let editingId = null;
    let currentFilter = "all";
    let contactToDelete = null;

    // === OPEN ADD CONTACT MODAL ===
    addBtn.addEventListener("click", () => {
        editingId = null;
        form.reset();
        modal.classList.remove("hidden");
    });

    // === CLOSE ADD/EDIT MODAL ===
    closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // === SAVE CONTACT ===
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const newContact = {
            id: editingId ?? Date.now(),
            name: document.getElementById("Name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            alamat: document.getElementById("alamat").value,
            category: document.getElementById("category").value.toLowerCase()
        };

        if (editingId) {
            contacts = contacts.map(c => (c.id === editingId ? newContact : c));
        } else {
            contacts.push(newContact);
        }

        modal.classList.add("hidden");
        form.reset();
        editingId = null;
        renderContacts(currentFilter, searchInput.value);
    });

    // === RENDER CONTACTS ===
    function renderContacts(filter = "all", keyword = "") {
        contactList.innerHTML = "";

        const filtered = contacts.filter(c => {
            const matchCategory =
                (filter === "all") || (c.category.toLowerCase() === filter.toLowerCase());

            const matchSearch =
                c.name.toLowerCase().includes(keyword.toLowerCase()) ||
                c.email.toLowerCase().includes(keyword.toLowerCase()) ||
                c.phone.toLowerCase().includes(keyword.toLowerCase());

            return matchCategory && matchSearch;
        });

        if (filtered.length === 0) {
            contactList.innerHTML = `
                <tr>
                    <td colspan="6" class="py-6 text-center text-gray-600">
                        Tidak ada kontak.
                    </td>
                </tr>`;
            return;
        }

        filtered.forEach((c) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td class="p-4">${c.name}</td>
                <td class="p-4">${c.phone}</td>
                <td class="p-4">${c.email}</td>
                <td class="p-4">${c.alamat}</td>
                <td class="p-4">${c.category}</td>

                <td class="p-4 flex justify-center gap-3">

                    <button class="edit-btn px-3 py-1.5 rounded-xl text-white shadow 
                        bg-gradient-to-r from-blue-300 to-purple-300 
                        hover:from-blue-400 hover:to-purple-400 transition flex items-center gap-1">
                        ✏️ <b>Edit</b>
                    </button>

                    <button class="delete-btn px-3 py-1.5 rounded-xl text-white shadow
                        bg-gradient-to-r from-pink-300 to-red-300
                        hover:from-pink-400 hover:to-red-400 transition flex items-center gap-1">
                        🗑️ <b>Hapus</b>
                    </button>

                </td>
            `;

            // === EDIT CONTACT ===
            row.querySelector(".edit-btn").addEventListener("click", () => {
                editingId = c.id;

                document.getElementById("Name").value = c.name;
                document.getElementById("phone").value = c.phone;
                document.getElementById("email").value = c.email;
                document.getElementById("alamat").value = c.alamat;
                document.getElementById("category").value = c.category;

                modal.classList.remove("hidden");
            });

            // === DELETE CONTACT (OPEN MODAL) ===
            row.querySelector(".delete-btn").addEventListener("click", () => {
                contactToDelete = c;
                deleteModal.classList.remove("hidden");
            });

            contactList.appendChild(row);
        });
    }

    // === CANCEL DELETE ===
    cancelDelete.addEventListener("click", () => {
        deleteModal.classList.add("hidden");
        contactToDelete = null;
    });

    // === CONFIRM DELETE ===
    confirmDelete.addEventListener("click", () => {
        if (contactToDelete) {
            contactToDelete.category = "sampah";
        }
        deleteModal.classList.add("hidden");
        renderContacts(currentFilter, searchInput.value);
    });

    // === FILTER BUTTONS ===
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            currentFilter = btn.dataset.category;
            renderContacts(currentFilter, searchInput.value);
        });
    });

    // === SEARCH ===
    searchInput.addEventListener("input", () => {
        renderContacts(currentFilter, searchInput.value);
    });
});
