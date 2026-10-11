
const WHATSAPP_NUMBER = "77479370909";
const DELIVERY_IMAGE = "/images/delivery-zone.jpg";

const menu = [
  { category: "Бургеры", name: "Чизбургер куриный", price: 1800 },
  { category: "Бургеры", name: "Чизбургер говяжий", price: 2000 },
  { category: "Бургеры", name: "Чизбургер ассорти", price: 2200 },
  { category: "Пицца", name: "Пицца 4 сезона", price: 3500 },
  { category: "Пицца", name: "Пицца куриная", price: 3000 },
  { category: "Пицца", name: "Маргарита", price: 2500 },
  { category: "Пицца", name: "Пепперони", price: 3000 },
  { category: "Пицца", name: "Пицца донер", price: 3500 },
  { category: "Основные блюда", name: "Плов", price: 1800 },
  { category: "Основные блюда", name: "Манты", price: 1800 },
  { category: "Основные блюда", name: "Лагман", price: 1800 }
];

let language = "ru";
let screen = "language";
let selectedCategory = "Все";
let cart = {};
let orderInfo = { name: "", phone: "", address: "", comment: "" };

const words = {
  ru: {
    choose: "Выберите язык",
    zone: "Зона доставки",
    zoneText: "Посмотрите нашу зону доставки перед заказом.",
    menu: "Наше меню",
    cart: "Корзина",
    empty: "Корзина пока пустая",
    total: "Итого",
    checkout: "Оформить заказ",
    back: "Назад",
    name: "Ваше имя",
    phone: "Номер телефона",
    address: "Адрес доставки",
    comment: "Комментарий к заказу (необязательно)",
    send: "Заказать через WhatsApp",
    continue: "Перейти к меню",
    hours: "Доставка ежедневно с 11:00 до 23:00",
    required: "Заполните имя, телефон и адрес доставки.",
    all: "Все",
    imageError: "Загрузите фото в public/images/delivery-zone.jpg",
    order: "НОВЫЙ ЗАКАЗ — TOMCHI PREMIUM",
    quantity: "Количество",
    deliveryAddress: "Адрес",
    customer: "Клиент",
    customerPhone: "Телефон",
    note: "Комментарий"
  },
  kz: {
    choose: "Тілді таңдаңыз",
    zone: "Жеткізу аймағы",
    zoneText: "Тапсырыс бермес бұрын жеткізу аймағын қарап шығыңыз.",
    menu: "Біздің мәзір",
    cart: "Себет",
    empty: "Себет әзірге бос",
    total: "Барлығы",
    checkout: "Тапсырыс беру",
    back: "Артқа",
    name: "Атыңыз",
    phone: "Телефон нөмірі",
    address: "Жеткізу мекенжайы",
    comment: "Тапсырысқа түсініктеме (міндетті емес)",
    send: "WhatsApp арқылы тапсырыс беру",
    continue: "Мәзірге өту",
    hours: "Жеткізу күн сайын 11:00–23:00",
    required: "Атыңызды, телефон нөмірін және мекенжайды толтырыңыз.",
    all: "Барлығы",
    imageError: "Суретті public/images/delivery-zone.jpg жолына жүктеңіз",
    order: "ЖАҢА ТАПСЫРЫС — TOMCHI PREMIUM",
    quantity: "Саны",
    deliveryAddress: "Мекенжай",
    customer: "Клиент",
    customerPhone: "Телефон",
    note: "Түсініктеме"
  }
};

function t(key) {
  return words[language][key] || key;
}

function money(amount) {
  return Number(amount).toLocaleString("ru-RU") + " ₸";
}

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function cartCount() {
  return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

function cartTotal() {
  return Object.entries(cart).reduce((sum, [index, quantity]) => {
    return sum + menu[Number(index)].price * quantity;
  }, 0);
}

function render() {
  const app = document.getElementById("app");
  if (!app) return;

  if (screen === "language") {
    app.innerHTML = `
      <div class="simple-wrap">
        <div class="simple-card">
          <div class="simple-logo">TOMCHI PREMIUM</div>
          <h2>${t("choose")}</h2>
          <button class="simple-btn" onclick="chooseLanguage('ru')">🇷🇺 Русский</button>
          <button class="simple-btn" onclick="chooseLanguage('kz')">🇰🇿 Қазақша</button>
        </div>
      </div>`;
    return;
  }

  if (screen === "zone") {
    app.innerHTML = `
      <div class="simple-wrap">
        <div class="simple-card">
          <div class="simple-logo">TOMCHI PREMIUM</div>
          <h2>${t("zone")}</h2>
          <p>${t("zoneText")}</p>
          <img
            class="zone-image"
            src="${DELIVERY_IMAGE}"
            alt="${t("zone")}"
            onerror="this.style.display='none';document.getElementById('image-error').style.display='block'"
          >
          <p id="image-error" style="display:none;color:#a33">${t("imageError")}</p>
          <p>${t("hours")}</p>
          <button class="simple-btn" onclick="showMenu()">${t("continue")}</button>
        </div>
      </div>`;
    return;
  }

  if (screen === "menu") {
    const categories = [t("all"), ...new Set(menu.map(item => item.category))];

    const categoryButtons = categories.map(category => `
      <button
        onclick="setCategory('${safe(category)}')"
        style="${selectedCategory === category ? "background:#916718;color:white" : ""}">
        ${safe(category)}
      </button>
    `).join("");

    const filtered = selectedCategory === t("all")
      ? menu
      : menu.filter(item => item.category === selectedCategory);

    const cards = filtered.map(item => {
      const index = menu.indexOf(item);
      const quantity = cart[index] || 0;

      return `
        <div class="food-card">
          <h3>${safe(item.name)}</h3>
          <div class="food-price">${money(item.price)}</div>
          <div class="quantity-row" style="margin-top:12px">
            <button onclick="changeQuantity(${index},-1)">−</button>
            <strong>${quantity}</strong>
            <button onclick="changeQuantity(${index},1)">+</button>
          </div>
        </div>`;
    }).join("");

    app.innerHTML = `
      <div class="simple-wrap">
        <div class="simple-logo">TOMCHI PREMIUM</div>
        <h2>${t("menu")}</h2>
        <p>${t("hours")}</p>
        <div class="category-bar">${categoryButtons}</div>
        <div class="food-grid">${cards}</div>
      </div>
      ${cartCount() > 0 ? `
        <button class="cart-fixed" onclick="openCart()">
          🛒 ${t("cart")} · ${cartCount()} · ${money(cartTotal())}
        </button>` : ""}
    `;
    return;
  }

  if (screen === "cart") {
    const items = Object.entries(cart).map(([index, quantity]) => {
      const item = menu[Number(index)];

      return `
        <div class="cart-line">
          <div>
            <strong>${safe(item.name)}</strong>
            <div>${quantity} × ${money(item.price)}</div>
          </div>
          <div>
            <strong>${money(item.price * quantity)}</strong>
            <div class="quantity-row" style="margin-top:8px">
              <button onclick="changeQuantity(${index},-1)">−</button>
              <span>${quantity}</span>
              <button onclick="changeQuantity(${index},1)">+</button>
            </div>
          </div>
        </div>`;
    }).join("");

    app.innerHTML = `
      <div class="simple-wrap">
        <div class="simple-logo">TOMCHI PREMIUM</div>
        <h2>${t("cart")}</h2>
        ${items || `<p>${t("empty")}</p>`}
        <div class="total-line">
          <span>${t("total")}</span>
          <span>${money(cartTotal())}</span>
        </div>
        <button class="simple-btn" onclick="openCheckout()" ${cartCount() === 0 ? "disabled" : ""}>
          ${t("checkout")}
        </button>
        <button class="simple-btn" style="background:#777" onclick="showMenu()">${t("back")}</button>
      </div>`;
    return;
  }

  if (screen === "checkout") {
    app.innerHTML = `
      <div class="simple-wrap">
        <div class="simple-card">
          <div class="simple-logo">TOMCHI PREMIUM</div>
          <h2>${t("checkout")}</h2>
          <input class="simple-input" id="customer-name" placeholder="${t("name")}" value="${safe(orderInfo.name)}">
          <input class="simple-input" id="customer-phone" type="tel" placeholder="${t("phone")}" value="${safe(orderInfo.phone)}">
          <input class="simple-input" id="customer-address" placeholder="${t("address")}" value="${safe(orderInfo.address)}">
          <textarea class="simple-input" id="customer-comment" rows="3" placeholder="${t("comment")}">${safe(orderInfo.comment)}</textarea>
          <div class="total-line">
            <span>${t("total")}</span>
            <span>${money(cartTotal())}</span>
          </div>
          <button class="simple-btn" onclick="sendWhatsAppOrder()">${t("send")}</button>
          <button class="simple-btn" style="background:#777" onclick="openCart()">${t("back")}</button>
        </div>
      </div>`;
  }
}

function chooseLanguage(value) {
  language = value;
  selectedCategory = t("all");
  screen = "zone";
  render();
}

function showMenu() {
  screen = "menu";
  selectedCategory = t("all");
  render();
}

function setCategory(category) {
  selectedCategory = category;
  render();
}

function changeQuantity(index, amount) {
  const next = (cart[index] || 0) + amount;

  if (next <= 0) {
    delete cart[index];
  } else {
    cart[index] = next;
  }

  render();
}

function openCart() {
  screen = "cart";
  render();
}

function openCheckout() {
  if (cartCount() === 0) return;
  screen = "checkout";
  render();
}

function sendWhatsAppOrder() {
  orderInfo.name = document.getElementById("customer-name")?.value.trim() || "";
  orderInfo.phone = document.getElementById("customer-phone")?.value.trim() || "";
  orderInfo.address = document.getElementById("customer-address")?.value.trim() || "";
  orderInfo.comment = document.getElementById("customer-comment")?.value.trim() || "";

  if (!orderInfo.name || !orderInfo.phone || !orderInfo.address) {
    alert(t("required"));
    return;
  }

  if (cartCount() === 0) {
    alert(t("empty"));
    return;
  }

  const lines = Object.entries(cart).map(([index, quantity]) => {
    const item = menu[Number(index)];
    return `• ${item.name} — ${quantity} × ${money(item.price)} = ${money(item.price * quantity)}`;
  });

  const message = [
    t("order"),
    "",
    ...lines,
    "",
    `${t("total")}: ${money(cartTotal())}`,
    "",
    `${t("customer")}: ${orderInfo.name}`,
    `${t("customerPhone")}: ${orderInfo.phone}`,
    `${t("deliveryAddress")}: ${orderInfo.address}`,
    ...(orderInfo.comment ? [`${t("note")}: ${orderInfo.comment}`] : [])
  ].join("\n");

  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  window.location.href = url;
}

render();
