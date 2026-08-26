let language = "ru";
let selectedBranch = "";
let cart = [];

// ---------------- ЯЗЫК ----------------

function setLanguage(lang){

    language = lang;

    document.getElementById("language-screen").classList.remove("active");
    document.getElementById("address-screen").classList.add("active");

    if(lang==="kz"){
        document.querySelector("#address-screen h2").innerText="Жеткізу мекенжайын енгізіңіз";
        document.getElementById("address").placeholder="Мысалы: Абай 47";
    }else{
        document.querySelector("#address-screen h2").innerText="Введите адрес доставки";
        document.getElementById("address").placeholder="Например: Абая 47";
    }

}

// ---------------- ПРОВЕРКА АДРЕСА ----------------

async function checkAddress(){

    const address=document.getElementById("address").value.trim();

    if(!address){
        alert(language==="kz" ? "Мекенжайды енгізіңіз" : "Введите адрес");
        return;
    }

    try{

        const res=await fetch("/api/check-zone",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                address:address,
                amount:5000
            })
        });

const data = await res.json();
if (data.inZone) {

    document.getElementById("modalTitle").innerText =
        "✅ Адрес входит в зону доставки";

    document.getElementById("modalText").innerText =
`Ваш адрес входит в нашу зону доставки.

• Заказ от 5 000 ₸ — доставка БЕСПЛАТНО.

• Заказ до 5 000 ₸ — стоимость доставки 500 ₸.

Продолжить оформление заказа?`;

} else {

    document.getElementById("modalTitle").innerText =
        "⚠️ Адрес вне зоны бесплатной доставки";

    document.getElementById("modalText").innerText =
`Ваш адрес не входит в бесплатную зону доставки.

После оформления заказа потребуется вызвать курьера через Яндекс Go или inDrive.


Продолжить оформление заказа?`;

}

document.getElementById("deliveryModal").classList.add("show");

    }catch(e){

        alert("Ошибка подключения");

    }

}

// ---------------- ФИЛИАЛЫ ----------------

function showBranches(){

    document.getElementById("address-screen").classList.remove("active");
    document.getElementById("branch-screen").classList.add("active");

    const branches=[
        "Абылай Хана 24",
        "Абылай Хана 34",
        "Жібек Жолы 106",
        "Абая 47",
        "Яссауи 66"
    ];

    const container=document.getElementById("branches");

    container.innerHTML="";

    branches.forEach(branch=>{

        const div=document.createElement("div");

        div.className="branch-card";

        div.innerHTML=branch;

        div.onclick=function(){

            openMenu(branch);

        };

        container.appendChild(div);

    });

}

// ---------------- МЕНЮ ----------------
function openMenu(branch){

    selectedBranch = branch;

    document.getElementById("branch-screen").classList.remove("active");
    document.getElementById("menu-screen").classList.add("active");

    document.getElementById("branch-title").innerText = branch;

    const menu = document.getElementById("menu-list");

    // Пока настоящее меню делаем для Абылай Хана 24
    if(branch === "Абылай Хана 24"){

        const foods = [

            // ===== ПЛОВ =====
            ["Плов", "Ташкентский", 1990],
            ["Плов", "Шифа", 2190],
            ["Плов", "Ханский", 2490],
            ["Плов", "По-казахски", 2590],
            ["Плов", "Мясо доп.", 690],

            ["Плов 1 кг", "Ташкентский", 4990],
            ["Плов 1 кг", "Ханский", 6490],

            ["Плов предзаказ", "Чайхана плов (1 кг)", 5090],
            ["Плов предзаказ", "Самаркандский (1 кг)", 6290],

            // ===== САМСА =====
            ["Самса", "Куриный", 550],
            ["Самса", "Говядина", 600],
            ["Самса", "Лепешка", 300],

            // ===== СУПЫ =====
            ["Супы", "Пельмени", 1790],
            ["Супы", "Тефтели", 1890],
            ["Супы", "Шорпа", 1890],

            // ===== САЛАТЫ =====
            ["Салаты", "Солёные огурцы", 790],
            ["Салаты", "Морковка", 790],
            ["Салаты", "Чим-чи", 790],
            ["Салаты", "Ачичук", 1090],
            ["Салаты", "Свежий салат", 1290],

            // ===== ГАРНИРЫ =====
            ["Гарниры", "Фри", 890],
            ["Гарниры", "Наггетсы", 1190],

            // ===== ШАШЛЫК =====
            ["Шашлык", "Люля", 1190],
            ["Шашлык", "Крылышки", 1190],
            ["Шашлык", "Окорочка", 1190],
            ["Шашлык", "Утка", 1190],
            ["Шашлык", "Рулет", 1290],
            ["Шашлык", "Баранина", 1490],
            ["Шашлык", "Говядина", 1490],
            ["Шашлык", "Семечки", 1590],
            ["Шашлык", "Напалеон", 1790],
            ["Шашлык", "Антрикот", 2190],

            // ===== СОУСЫ =====
            ["Соусы", "Кетчуп", 250],
            ["Соусы", "Майонез", 250],
            ["Соусы", "Сырный соус", 250],
            ["Соусы", "Красный соус", 250],
            ["Соусы", "Сметана", 350],

            // ===== КОМБО =====
            ["Комбо", "Комбо 1", 2590],
            ["Комбо", "Комбо 2", 7990],
            ["Комбо", "Комбо 3", 7990],
            ["Комбо", "Комбо Семейный", 12590],
            ["Комбо", "Комбо Жума", 2990],
            ["Комбо", "Ассорти 1. шашлыков", 7590],
            ["Комбо", "Ассорти 2. шашлыков", 21990],

            // ===== ДОПОЛНИТЕЛЬНО =====
            ["Дополнительно", "Казы", 500],
            ["Дополнительно", "Перепел. яйцо", 260],
            ["Дополнительно", "Перец чили", 200],

            // ===== АВТОРСКИЕ ЧАИ =====
            ["Авторские чаи", "Чай с молоком", 690],
            ["Авторские чаи", "Карак чай", 690],
            ["Авторские чаи", "Ташкентский", 790],
            ["Авторские чаи", "Марокканский", 790],
            ["Авторские чаи", "Имбирный", 790],
            ["Авторские чаи", "Ягодный", 790],
            ["Авторские чаи", "Тары", 790],
            ["Авторские чаи", "Клубника-какадзе", 790],
            ["Авторские чаи", "Мята-апельсин", 790],
            ["Авторские чаи", "Малиновый", 790],

            // ===== ЛИСТОВЫЕ ЧАИ =====
            ["Листовые чаи", "Чёрный", 590],
            ["Листовые чаи", "Зелёный", 590],
            ["Листовые чаи", "Бергамот", 590],
            ["Листовые чаи", "Жасмин", 590],
            ["Листовые чаи", "Молочный улун", 590],

            // ===== ЛИМОНАДЫ =====
            ["Лимонады", "Мохито", 890],
            ["Лимонады", "Манго-маракуйя", 890],
            ["Лимонады", "Ягодный", 890],
            ["Лимонады", "Классический", 890],
            ["Лимонады", "Тропический", 890],
            ["Лимонады", "Киви-лайм", 890],
            ["Лимонады", "Смородиновый", 890],
            ["Лимонады", "Вишнёвый", 890],
            ["Лимонады", "Мандариновый", 890],
            ["Лимонады", "Малина-лайм", 890],

            // ===== ICE-TEA =====
            ["Ice-tea", "Чёрный", 990],
            ["Ice-tea", "Зелёный", 990],
            ["Ice-tea", "Манго", 990],
            ["Ice-tea", "Вишнёвый", 990],
            ["Ice-tea", "Ананас", 990],

            // ===== ДЕСЕРТЫ =====
            ["Десерты", "Пахлава в асс. (2шт.)", 1200],
            ["Десерты", "Пахлава фисташки (2шт.)", 1200],
            ["Десерты", "Пахлава молочный (2шт.)", 1400],
            ["Десерты", "Десерты в асс.", 1590],

            // ===== НАПИТКИ =====
            ["Напитки", "Salam Cola (разливная) 0,5л", 790],
            ["Напитки", "Salam Cola баночная 0,5л", 790],
            ["Напитки", "Salam Cola", 1290],
            ["Напитки", "Ava разливной 0,5л", 690],
            ["Напитки", "Da-Da сок 0,2л", 590],
            ["Напитки", "Da-Da сок 1л", 1290],
            ["Напитки", "Компот 0,5л", 490],
            ["Напитки", "ASU 0,5л", 590],
            ["Напитки", "ASU 1л", 790],
            ["Напитки", "Айран 0,3л", 400],
            ["Напитки", "Кымыз 1л", 2000],

            // ===== ДОПОЛНИТЕЛЬНО — БАР =====
            ["Дополнительно", "Мята", 300],
            ["Дополнительно", "Лимон", 250],
            ["Дополнительно", "Апельсин", 250],
            ["Дополнительно", "Имбирь", 250],
            ["Дополнительно", "Молоко 3,2%", 250],
            ["Дополнительно", "Мёд", 350]
        ];

        let html = "<h2>МЕНЮ</h2>";

        let currentCategory = "";

        foods.forEach(item => {

            const category = item[0];
            const name = item[1];
            const price = item[2];

            if(category !== currentCategory){

                currentCategory = category;

                html += `
                    <h2 class="menu-category">${category}</h2>
                `;
            }

            html += `
                <div class="food-card">
                    <h3>${name}</h3>
                    <p>${price} ₸</p>
                    <button onclick="addToCart('${name}', ${price})">
                        Добавить
                    </button>
                </div>
            `;
        });

        menu.innerHTML = html;

    } else {

        // Остальные филиалы пока оставляем как есть
        menu.innerHTML = `
            <h2>МЕНЮ</h2>

            <div class="food-card">
                <h3>Плов</h3>
                <p>2500 ₸</p>
                <button onclick="addToCart('Плов',2500)">
                    Добавить
                </button>
            </div>

            <div class="food-card">
                <h3>Манты</h3>
                <p>2200 ₸</p>
                <button onclick="addToCart('Манты',2200)">
                    Добавить
                </button>
            </div>

            <div class="food-card">
                <h3>Лагман</h3>
                <p>2400 ₸</p>
                <button onclick="addToCart('Лагман',2400)">
                    Добавить
                </button>
            </div>
        `;
    }

}

// ---------------- КОРЗИНА ----------------
function addToCart(name, price){

    const existingItem = cart.find(item => item.name === name);

    if(existingItem){

        existingItem.quantity += 1;

    }else{

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

}
// ---------------- ПРОВЕРКА ЗАКАЗА ----------------

function openOrderCheck(){

    if(cart.length === 0){
        alert("Корзина пуста");
        return;
    }

    document.getElementById("menu-screen").classList.remove("active");
    document.getElementById("order-screen").classList.add("active");

    renderOrder();
}

    function renderOrder(){

    const orderList = document.getElementById("order-list");
    const totalPrice = document.getElementById("order-total-price");

    orderList.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        orderList.innerHTML += `
            <div class="food-card order-item">

                <div class="order-info">
                    <h3>${item.name}</h3>
                    <p>${item.price} ₸</p>
                </div>

                <div class="quantity">

                    <button type="button" onclick="decreaseItem(${index})">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button type="button" onclick="increaseItem(${index})">
                        +
                    </button>

                </div>

            </div>
        `;

    });

    totalPrice.innerText = total;
}


function increaseItem(index){

    cart[index].quantity += 1;

    renderOrder();

}


function decreaseItem(index){

    if(cart[index].quantity > 1){

        cart[index].quantity -= 1;

    }else{

        cart.splice(index, 1);

    }

    if(cart.length === 0){

        document.getElementById("order-screen").classList.remove("active");
        document.getElementById("menu-screen").classList.add("active");

        return;
    }

    renderOrder();

}


function backToMenu(){

    document.getElementById("order-screen").classList.remove("active");
    document.getElementById("menu-screen").classList.add("active");

}
// ---------------- WHATSAPP ----------------

function openCart(){

    if(cart.length===0){
        alert("Корзина пуста");
        return;
    }

    let text="Здравствуйте!%0A";
    text+="Филиал: "+selectedBranch+"%0A%0A";

    cart.forEach(item=>{
        text+=item.name+" - "+item.price+" ₸%0A";
    });

    window.open(
        "https://wa.me/77479370909?text="+text,
        "_blank"
    );

}
// ---------------- ОФОРМЛЕНИЕ ЗАКАЗА ----------------

function sendOrder(){

    const form = document.getElementById("customer-form");

    // Первый клик — показываем форму
    if(form.style.display === "none" || form.style.display === ""){

        form.style.display = "block";

        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const comment = document.getElementById("customer-comment").value.trim();

    if(!name){

        alert("Введите ваше имя");
        return;

    }

    if(!phone){

        alert("Введите номер телефона");
        return;

    }

    let total = 0;

    let text = "Здравствуйте! Хочу оформить заказ.%0A%0A";

    text += "🏪 Филиал: " + selectedBranch + "%0A";
    text += "👤 Имя: " + name + "%0A";
    text += "📞 Телефон: " + phone + "%0A";
    text += "📍 Адрес: " + document.getElementById("address").value + "%0A%0A";

    text += "🛒 ЗАКАЗ:%0A";

    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        text +=
            item.name +
            " × " +
            item.quantity +
            " — " +
            itemTotal +
            " ₸%0A";

    });

    text += "%0A💰 Итого: " + total + " ₸";

    if(comment){

        text += "%0A📝 Комментарий: " + comment;

    }

    window.open(
        "https://wa.me/77000000000?text=" + text,
        "_blank"
    );

}
// ---------------- НАЗАД ----------------

function backToBranches(){

    document.getElementById("menu-screen").classList.remove("active");
    document.getElementById("branch-screen").classList.add("active");

}

// ---------------- МОДАЛЬНОЕ ОКНО ----------------

function continueOrder(){

    document.getElementById("deliveryModal").classList.remove("show");

    showBranches();

}

function closeModal(){

    document.getElementById("deliveryModal").classList.remove("show");

}
// ---------------- ОФОРМЛЕНИЕ ЗАКАЗА ----------------

function sendOrder(){

    if(cart.length === 0){
        alert("Корзина пуста");
        return;
    }

    let total = 0;

    let text = "Здравствуйте! Хочу оформить заказ.%0A%0A";

    text += "Филиал: " + selectedBranch + "%0A%0A";

    text += "Заказ:%0A";

    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        text +=
            item.name +
            " × " +
            item.quantity +
            " — " +
            itemTotal +
            " ₸%0A";

    });

    text += "%0AИтого: " + total + " ₸";

    window.open(
        "https://wa.me/77000000000?text=" + text,
        "_blank"
    );

}