let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
document.addEventListener('DOMContentLoaded', function() {
    console.log('Halaman loaded'); 
    document.getElementById('addContactBtn').addEventListener('click', openAddModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('contactForm').addEventListener('submit', saveContact);
    document.getElementById('searchInput').addEventListener('input', filterContacts);
    
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentFilter = this.dataset.category;
            updateActiveFilter();
            loadContacts();
        });
    });
    
    // Close modal ketika klik di luar
    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
});

let currentFilter = 'all';
let editingContactId = null;

function loadContacts() {
    const contactList = document.getElementById('contactList');
    const emptyRow = document.getElementById('emptyRow');
    
    contactList.innerHTML = '';
    
    // Filter kontak berdasarkan kategori
    let filteredContacts = contacts.filter(contact => {
        if (currentFilter === 'spam') {
            return contact.category === 'spam';
        }
        return contact.category !== 'spam';
    });
    
    // Filter berdasarkan pencarian
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filteredContacts = filteredContacts.filter(contact => 
            contact.name.toLowerCase().includes(searchTerm) ||
            contact.phone.includes(searchTerm) ||
            (contact.email && contact.email.toLowerCase().includes(searchTerm))
        );
    }
    
    // Tampilkan pesan kosong jika tidak ada kontak
    if (filteredContacts.length === 0) {
        emptyRow.style.display = 'table-row';
        contactList.appendChild(emptyRow);
        return;
    }
    
    emptyRow.style.display = 'none';
    
    // Buat baris untuk setiap kontak
    filteredContacts.forEach(contact => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 hover:bg-white/50 transition';
        row.innerHTML = `
            <td class="p-5 font-medium">${contact.name}</td>
            <td class="p-5">${contact.phone}</td>
            <td class="p-5">${contact.email || '-'}</td>
            <td class="p-5">
                <div class="flex gap-2">
                    <button onclick="editContact('${contact.id}')" class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm">
                        Edit
                    </button>
                    <button onclick="${contact.category === 'spam' ? `restoreContact('${contact.id}')` : `deleteContact('${contact.id}')`}" class="px-3 py-1 ${contact.category === 'spam' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white rounded-lg transition text-sm">
                        ${contact.category === 'spam' ? 'Pulihkan' : 'Hapus'}
                    </button>
                    ${contact.category !== 'spam' ? `
                    <button onclick="markAsSpam('${contact.id}')" class="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm">
                        Spam
                    </button>` : ''}
                </div>
            </td>
        `;
        contactList.appendChild(row);
    });
}

function openAddModal() {
    editingContactId = null;
    document.getElementById('contactForm').reset();
    document.getElementById('category').value = 'personal';
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal').classList.add('flex');
}

function editContact(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
        editingContactId = contactId;
        document.getElementById('Name').value = contact.name;
        document.getElementById('phone').value = contact.phone;
        document.getElementById('email').value = contact.email || '';
        document.getElementById('category').value = contact.category;
        document.getElementById('modal').classList.remove('hidden');
        document.getElementById('modal').classList.add('flex');
    }
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('modal').classList.remove('flex');
    editingContactId = null;
}

function saveContact(e) {
    e.preventDefault();
    
    const name = document.getElementById('Name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const category = document.getElementById('category').value;
    
    if (!name || !phone) {
        alert('Nama dan Nomor Telepon harus diisi!');
        return;
    }
    
    if (editingContactId) {
        // Edit kontak yang ada
        const index = contacts.findIndex(c => c.id === editingContactId);
        if (index !== -1) {
            contacts[index] = {
                ...contacts[index],
                name,
                phone,
                email,
                category
            };
        }
    } else {
        // Tambah kontak baru
        const newContact = {
            id: Date.now().toString(),
            name,
            phone,
            email,
            category
        };
        contacts.push(newContact);
    }
    
    saveToLocalStorage();
    loadContacts();
    closeModal();
}

function deleteContact(contactId) {
    if (confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
        const index = contacts.findIndex(c => c.id === contactId);
        if (index !== -1) {
            contacts.splice(index, 1);
            saveToLocalStorage();
            loadContacts();
        }
    }
}

function markAsSpam(contactId) {
    if (confirm('Apakah Anda yakin ingin menandai kontak ini sebagai spam?')) {
        const index = contacts.findIndex(c => c.id === contactId);
        if (index !== -1) {
            contacts[index].category = 'spam';
            saveToLocalStorage();
            loadContacts();
        }
    }
}

function restoreContact(contactId) {
    const index = contacts.findIndex(c => c.id === contactId);
    if (index !== -1) {
        contacts[index].category = 'personal';
        saveToLocalStorage();
        loadContacts();
    }
}

function filterContacts() {
    loadContacts();
}

function updateActiveFilter() {
    document.querySelectorAll('.filter-btn').forEach(button => {
        if (button.dataset.category === currentFilter) {
            button.classList.add('text-purple-600', 'font-bold');
            button.classList.remove('text-gray-700');
        } else {
            button.classList.remove('text-purple-600', 'font-bold');
            button.classList.add('text-gray-700');
        }
    });
}

function saveToLocalStorage() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Inisialisasi filter aktif
updateActiveFilter();