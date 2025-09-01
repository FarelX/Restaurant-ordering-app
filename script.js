import { menuArray } from "./data.js";

// Array untuk menyimpan item pesanan
let orderArray = [];

function getMenuHtml(menuArr) {
  // .map() akan membuat array baru berisi string HTML
  return menuArr
    .map((menu) => {
      // Dekonstruksi objek untuk mendapatkan data
      const { name, ingredients, id, price, emoji } = menu;

      // template literal `${...}`
      return `
      <section class="menu-sections">
        <div class="menu-info">
          <span class="menu-emoji">${emoji}</span>
          <div class="menu-items">
            <h2 class="menu-title">${name}</h2>
            <p class="ingredients">${ingredients.join(", ")}</p>
            <p class="price">$${price}</p>
          </div>
        </div>
        <button class="cart-btn" data-id="${id}">+</button>
      </section>
    `;
    })
    .join(""); // <- Gabungkan semua string HTML menjadi satu tanpa koma
}

function addToCart(itemId) {
  // Cari item berdasarkan ID
  const itemToAdd = menuArray.find((item) => item.id === itemId);

  // Cek apakah item sudah ada di orderArray
  const existingItemIndex = orderArray.findIndex((item) => item.id === itemId);

  if (existingItemIndex !== -1) {
    // Jika sudah ada, tambah jumlahnya
    orderArray[existingItemIndex].quantity++;
  } else {
    // Jika belum ada, tambahkan ke array dengan quantity 1
    orderArray.push({
      ...itemToAdd,
      quantity: 1,
    });
  }

  // Render ulang order section
  renderOrder();
}

function renderOrder() {
  const orderSection =
    document.getElementById("orderSection") || createOrderSection();

  // Jika tidak ada item, kosongkan section
  if (orderArray.length === 0) {
    orderSection.style.display = "none";
    return;
  }

  // Tampilkan order section
  orderSection.style.display = "block";

  // Hitung total harga
  const totalPrice = orderArray.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Buat HTML untuk order section
  let orderHtml = `
    <h2>Your order</h2>
    <div class="order-items">
  `;

  // Tambahkan setiap item
  orderArray.forEach((item) => {
    orderHtml += `
      <div class="order-item">
        <div class="order-item-info">
          <h3>${item.name} ${item.quantity > 1 ? `x${item.quantity}` : ""}</h3>
          <button class="remove-btn" data-remove="${item.id}">remove</button>
        </div>
        <p class="order-item-price">$${(item.price * item.quantity).toFixed(
          2
        )}</p>
      </div>
    `;
  });

  // Tambahkan total dan tombol checkout
  orderHtml += `
    </div>
    <div class="order-total">
      <h3>Total price:</h3>
      <p>$${totalPrice.toFixed(2)}</p>
    </div>
    <button class="checkout-btn">Complete order</button>
  `;

  orderSection.innerHTML = orderHtml;

  // Tambahkan event listener untuk tombol remove
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = parseInt(this.dataset.remove);
      removeFromCart(itemId);
    });
  });
}

function createOrderSection() {
  // Buat order section jika belum ada
  const orderSection = document.createElement("section");
  orderSection.id = "orderSection";
  orderSection.className = "order-section";

  // Tambahkan setelah section container
  const sectionContainer = document.getElementById("sectionContainer");
  sectionContainer.parentNode.insertBefore(
    orderSection,
    sectionContainer.nextSibling
  );

  return orderSection;
}

function removeFromCart(itemId) {
  const itemIndex = orderArray.findIndex((item) => item.id === itemId);

  if (itemIndex !== -1) {
    if (orderArray[itemIndex].quantity > 1) {
      // Kurangi quantity jika lebih dari 1
      orderArray[itemIndex].quantity--;
    } else {
      // Hapus item jika quantity 1
      orderArray.splice(itemIndex, 1);
    }
    renderOrder();
  }
}

function render() {
  document.getElementById("sectionContainer").innerHTML =
    getMenuHtml(menuArray);

  // Tambahkan event listeners
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("cart-btn")) {
      const itemId = parseInt(e.target.dataset.id);
      addToCart(itemId);
    }

    // Tampilkan modal saat tombol Complete order diklik
    if (e.target.classList.contains("checkout-btn")) {
      document.querySelector(".modal").style.display = "block";
    }
  });

  // Event listener untuk form payment
  document
    .getElementById("paymentForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Ambil nama yang diinput
      const customerName = document.querySelector('input[name="name"]').value;

      // Sembunyikan modal
      document.querySelector(".modal").style.display = "none";

      // Tampilkan pesan terima kasih di order section
      const orderSection = document.getElementById("orderSection");
      orderSection.innerHTML = `
      <div class="thank-you-message">
        <h2>Thanks, ${customerName}!</h2>
        <p>Your order is on its way!</p>
      </div>
    `;

      // Reset orderArray
      orderArray = [];
      paymentForm.reset();
      // Jangan sembunyikan order section agar pesan terima kasih tetap terlihat
      orderSection.style.display = "block";
    });

  // Render order section jika ada item
  renderOrder();
}

render();
