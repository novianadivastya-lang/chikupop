// =========================================================
// CHIKUPOP - JAVASCRIPT
// Bagian ini menangani menu mobile, filter produk,
// keranjang sederhana, dan tombol WhatsApp.
// =========================================================

// Nomor WhatsApp Chikupop.
// Format: 62 + nomor HP tanpa tanda +.
const NOMOR_WA = "6285124283099";


// ==================== MENU MOBILE ====================

// Mengambil tombol hamburger dan daftar navigasi.
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");

menuToggle.addEventListener("click", function() {
    // Class "open" akan menampilkan / menyembunyikan menu.
    navLinks.classList.toggle("open");
});

// Setelah salah satu menu diklik, menu mobile ditutup.
navLinks.querySelectorAll("a").forEach(function(link) {
    link.addEventListener("click", function() {
        navLinks.classList.remove("open");
    });
});


// ==================== FILTER MENU ====================

// Mengambil semua tombol kategori dan semua kartu produk.
const filterButtons = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {

        // Mengambil kategori dari data-filter.
        const pilihan = button.dataset.filter;

        // Mengubah tombol aktif.
        filterButtons.forEach(function(item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        // Menampilkan produk sesuai kategori.
        productCards.forEach(function(card) {
            const kategori = card.dataset.kategori;

            if (pilihan === "semua" || pilihan === kategori) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }
        });
    });
});


// ==================== KERANJANG ====================

// Map digunakan untuk menyimpan produk yang dipilih.
// Contoh:
// "Chikuro Original" -> { harga: 10000, jumlah: 2 }
const cart = new Map();

const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartSummary = document.querySelector("#cart-summary");
const checkoutButton = document.querySelector("#checkout-button");


// Mengubah angka menjadi format Rupiah.
function rupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}


// Menambahkan atau mengurangi jumlah produk.
function ubahJumlah(nama, harga, perubahan) {
    let item = cart.get(nama);

    // Kalau produk belum ada, buat data baru.
    if (!item) {
        item = {
            harga: harga,
            jumlah: 0
        };

        cart.set(nama, item);
    }

    item.jumlah += perubahan;

    // Kalau jumlah sudah 0, hapus dari keranjang.
    if (item.jumlah <= 0) {
        cart.delete(nama);
    }

    tampilkanKeranjang();
}


// Tombol "+ Tambah" pada setiap produk.
productCards.forEach(function(card) {

    const tombol = card.querySelector(".add-button");
    const nama = card.dataset.nama;
    const harga = Number(card.dataset.harga);

    tombol.addEventListener("click", function() {
        ubahJumlah(nama, harga, 1);

        // Efek kecil saat tombol ditekan.
        tombol.classList.add("selected");

        setTimeout(function() {
            tombol.classList.remove("selected");
        }, 250);
    });
});


// Menampilkan isi keranjang ke halaman.
function tampilkanKeranjang() {

    // Bersihkan tampilan sebelumnya.
    cartItems.innerHTML = "";

    let totalItem = 0;
    let totalHarga = 0;

    // Kalau belum ada pesanan.
    if (cart.size === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Keranjang masih kosong 🍗</p>';
        cartTotal.textContent = "Rp0";
        cartSummary.textContent = "Belum ada menu yang dipilih.";
        checkoutButton.classList.add("disabled");
        checkoutButton.href = "#";
        return;
    }

    // Membuat setiap baris produk.
    cart.forEach(function(item, nama) {

        const subtotal = item.harga * item.jumlah;

        totalItem += item.jumlah;
        totalHarga += subtotal;

        const row = document.createElement("div");
        row.className = "cart-row";

        row.innerHTML = `
            <div>
                <strong>${nama}</strong>
                <small>${rupiah(subtotal)}</small>
            </div>

            <div class="quantity">
                <button aria-label="Kurangi ${nama}">−</button>
                <span>${item.jumlah}</span>
                <button aria-label="Tambah ${nama}">+</button>
            </div>
        `;

        const buttons = row.querySelectorAll("button");

        buttons[0].addEventListener("click", function() {
            ubahJumlah(nama, item.harga, -1);
        });

        buttons[1].addEventListener("click", function() {
            ubahJumlah(nama, item.harga, 1);
        });

        cartItems.appendChild(row);
    });


    // Update total.
    cartTotal.textContent = rupiah(totalHarga);
    cartSummary.textContent = totalItem + " item ada di keranjang.";

    checkoutButton.classList.remove("disabled");


    // Membuat teks pesanan untuk WhatsApp.
    let pesan = "Halo Chikupop, saya mau pesan:%0A%0A";

    cart.forEach(function(item, nama) {
        pesan +=
            item.jumlah +
            "x " +
            nama +
            " - " +
            rupiah(item.harga * item.jumlah) +
            "%0A";
    });

    pesan += "%0ATotal: " + rupiah(totalHarga);
    pesan += "%0A%0ATerima kasih!";


    // Membuat link WhatsApp otomatis.
    checkoutButton.href =
        "https://wa.me/" +
        NOMOR_WA +
        "?text=" +
        pesan;
}


// ==================== FOOTER WHATSAPP ====================

const footerWa = document.querySelector("#footer-wa");

footerWa.href =
    "https://wa.me/" +
    NOMOR_WA +
    "?text=Halo%20Chikupop,%20saya%20mau%20tanya%20tentang%20menu.";


// ==================== TAHUN FOOTER ====================

// Tahun akan berubah otomatis setiap tahun.
document.querySelector("#tahun").textContent =
    new Date().getFullYear();
