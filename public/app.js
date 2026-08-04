let currentLanguage = "ru";
let currentBranch = "";
let currentAddress = "";
let cart = [];

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");
}

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem("language", lang);

    showScreen("address-screen");
}

async function checkAddress() {

    const address = document.getElementById("address").value.trim();

    if (!address) {
        alert("Введите адрес доставки");
        return;
    }

    currentAddress = address;

    try {

        const response = await fetch("/api/check-zone", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                address: address,
                amount: 5000
            })
        });

        const result = await response.json();

        if (!result.found) {
            alert(result.message);
            return;
        }

        if (result.inZone) {

            if (result.deliveryPrice === 0) {

                alert("✅ Адрес входит в зону.\nДоставка будет бесплатной при заказе от 5000 ₸.");

            } else {

                alert("✅ Адрес входит в зону.\nСтоимость доставки 500 ₸.");

            }

        } else {

            alert(
                "📍 Ваш адрес находится вне зоны доставки.\n\nПосле приготовления заказа вы сможете вызвать курьера через Яндекс Go или inDrive."
            );

        }

        loadBranches();

        showScreen("branch-screen");

    } catch (error) {

        alert("Ошибка соединения с сервером.");

    }

}

function loadBranches() {

    const branches = [
        "Абылай Хана 24",
        "Абылай Хана 34",
        "Жибек жолы 106",
        "Яссауи 66",
        "Абая 47"
    ];

    const container = document.getElementById("branches");

    container.innerHTML = "";
    branches.forEach(branch => {

        const card = document.createElement("div");

        card.className = "branch-card";

        card.innerHTML = "📍 " + branch;

        card.onclick = () => {

            currentBranch = branch;

            document.getElementById("branch-title").innerText = branch;

            loadMenu();

            showScreen("menu-screen");

        };

        container.appendChild(card);

    });

}

function loadMenu() {

    const foods = [

        { name: "Плов", price: 2500 },

        { name: "Манты", price: 2200 },

        { name: "Лагман", price: 2400 },

        { name: "Шашлык", price: 1800 },

        { name: "Самса", price: 700 }

    ];

    const menu = document.getElementById("menu-list");

    menu.innerHTML = "";

    foods.forEach(food => {

        const card = document.createElement("div");

        card.className = "food-card";

        card.innerHTML = `
            <h3>${food.name}</h3>
            <p>${food.price} ₸</p>
            <button class="btn" onclick="addToCart('${food.name}', ${food.price})">
                Добавить
            </button>
        `;

        menu.appendChild(card);

    });

}

function addToCart(name, price) {

    cart.push({
        name,
        price
    });

    document.getElementById("cart-count").innerText = cart.length;

}

function backToBranches() {

    showScreen("branch-screen");

}
function openCart() {

    if (cart.length === 0) {
        alert("Корзина пуста.");
        return;
    }

    let total = 0;

    let text = "🍽️ TOMCHI PREMIUM\n\n";

    text += "📍 Филиал: " + currentBranch + "\n";
    text += "🏠 Адрес: " + currentAddress + "\n\n";

    text += "Заказ:\n";

    cart.forEach(item => {

        total += item.price;

        text += "• " + item.name + " — " + item.price + " ₸\n";

    });

    text += "\n";

    if (total >= 5000) {

        text += "🚚 Доставка: Бесплатно\n";

    } else {

        text += "🚚 Доставка: 500 ₸\n";

        total += 500;

    }

    text += "\n💰 Итого: " + total + " ₸";

    const phone = "77000000000"; // ← потом заменим на номер Tomchi

    window.open(
        "https://wa.me/" +
        phone +
        "?text=" +
        encodeURIComponent(text),
        "_blank"
    );

}

document.addEventListener("DOMContentLoaded", () => {

    const lang = localStorage.getItem("language");

    if (lang) {

        currentLanguage = lang;

    }

});