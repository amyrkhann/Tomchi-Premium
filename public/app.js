let currentBranch = "";
let cart = [];

function setLanguage(lang) {
    localStorage.setItem("language", lang);

    document.getElementById("language-screen").classList.remove("active");
    document.getElementById("address-screen").classList.add("active");
}

function checkAddress() {

    const address = document.getElementById("address").value.trim();

    if (address === "") {
        alert("Введите адрес доставки!");
        return;
    }

    // Простая проверка зоны
    let inZone = false;

    const zoneWords = [
        "абая",
        "сейфуллина",
        "сатпаева",
        "ташкентская",
        "момышулы",
        "каргалинская"
    ];

    zoneWords.forEach(word => {
        if (address.toLowerCase().includes(word)) {
            inZone = true;
        }
    });

    if (inZone) {
        alert("✅ Адрес входит в зону доставки.");
    } else {
        alert("⚠️ Адрес вне зоны доставки.\nМенеджер уточнит стоимость.");
    }

    document.getElementById("address-screen").classList.remove("active");
    document.getElementById("branch-screen").classList.add("active");

    const branches = [
        "📍 Абылай Хана 24",
        "📍 Абылай Хана 34",
        "📍 Жибек жолы 106",
        "📍 Яссауи 66",
        "📍 Абая 47"
    ];

    const container = document.getElementById("branches");
    container.innerHTML = "";

    branches.forEach(branch => {

        const card = document.createElement("div");

        card.className = "branch-card";

        card.innerHTML = branch;

        card.onclick = function () {

            currentBranch = branch;

            document.getElementById("branch-title").innerHTML = branch;

            document.getElementById("branch-screen").classList.remove("active");

            document.getElementById("menu-screen").classList.add("active");

            loadMenu(branch);

        };

        container.appendChild(card);

    });

}

function loadMenu(branch){

    const menu=document.getElementById("menu-list");

    menu.innerHTML="";

    const foods=[

        {
            name:"Плов",
            price:2500
        },

        {
            name:"Манты",
            price:2200
        },

        {
            name:"Лагман",
            price:2400
        }

    ];

    foods.forEach(food=>{

        const card=document.createElement("div");

        card.className="food-card";

        card.innerHTML=`

            <h3>${food.name}</h3>

            <p>${food.price} ₸</p>

            <button onclick="addToCart('${food.name}',${food.price})">

            Добавить

            </button>

        `;

        menu.appendChild(card);

    });

}

function addToCart(name,price){

    cart.push({

        name:name,

        price:price

    });

    document.getElementById("cart-count").innerHTML=cart.length;

}

function openCart(){

    if(cart.length===0){

        alert("Корзина пуста");

        return;

    }

    let text="Здравствуйте!%0A%0A";

    text+="Филиал:%20"+currentBranch+"%0A%0A";

    cart.forEach(item=>{

        text+="• "+item.name+" - "+item.price+"₸%0A";

    });

    window.open("https://wa.me/77000000000?text="+text);

}

function backToBranches(){

    document.getElementById("menu-screen").classList.remove("active");

    document.getElementById("branch-screen").classList.add("active");

}