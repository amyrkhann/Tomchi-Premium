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
        "Tomchi Premium",
        "Арбат",
        "Абая 47",
        "Яссауи"
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

    selectedBranch=branch;

    document.getElementById("branch-screen").classList.remove("active");
    document.getElementById("menu-screen").classList.add("active");

    document.getElementById("branch-title").innerText=branch;

    const menu=document.getElementById("menu-list");

menu.innerHTML=`

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

    <h2>ДОПОЛНИТЕЛЬНО</h2>

    <div class="food-card">
        <h3>Посуда для шорпы</h3>
        <p>150 ₸</p>
        <button onclick="addToCart('Посуда для шорпы',150)">
            Добавить
        </button>
    </div>

    <div class="food-card">
        <h3>Казанчик</h3>
        <p>500 ₸</p>
        <button onclick="addToCart('Казанчик',500)">
            Добавить
        </button>
    </div>

    <div class="food-card">
        <h3>Посуда одноразовая</h3>
        <p>100 ₸</p>
        <button onclick="addToCart('Посуда одноразовая',100)">
            Добавить
        </button>
    </div>

    <div class="food-card">
        <h3>Контейнер алю</h3>
        <p>200 ₸</p>
        <button onclick="addToCart('Контейнер алю',200)">
            Добавить
        </button>
    </div>

`;

}

// ---------------- КОРЗИНА ----------------

function addToCart(name, price){

    cart.push({
        name,
        price
    });

    document.getElementById("cart-count").innerText = cart.length;

    renderCart();

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
        "https://wa.me/77000000000?text="+text,
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
function renderCart(){

    const items = document.getElementById("cartItems");
    const total = document.getElementById("totalPrice");

    items.innerHTML = "";

    let sum = 0;

    cart.forEach(item => {

        sum += item.price;

        items.innerHTML += `
            <div class="branch-card">
                <b>${item.name}</b>
                <br>
                ${item.price} ₸
            </div>
        `;

    });

    total.innerText = sum;

}