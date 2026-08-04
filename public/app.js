let language = "ru";
let selectedBranch = "";
let cart = [];

// ---------- Язык ----------
function setLanguage(lang) {
  language = lang;

  document.getElementById("language-screen").classList.remove("active");
  document.getElementById("address-screen").classList.add("active");

  if (lang === "kz") {
    document.querySelector("#address-screen h2").innerText = "Жеткізу мекенжайын енгізіңіз";
    document.getElementById("address").placeholder = "Мысалы: Абай 47";
  } else {
    document.querySelector("#address-screen h2").innerText = "Введите адрес доставки";
    document.getElementById("address").placeholder = "Например: Абая 47";
  }
}

// ---------- Проверка адреса ----------


    const data = await res.json();

    if (!data.found) {
      alert(data.message);
      return;
    }

    alert(data.message);

    showBranches();

  } catch (e) {
    alert("Ошибка подключения");
  }

}

// ---------- Филиалы ----------
function showBranches() {

  document.getElementById("address-screen").classList.remove("active");
  document.getElementById("branch-screen").classList.add("active");

  const branches = [
    "Абылай Хана 24",
    "Абылай Хана 34",
    "Жибек Жолы 106",
    "Абая 47",
    "Яссауи 66А"
  ];

  const container = document.getElementById("branches");
  container.innerHTML = "";

  branches.forEach(branch => {

    const div = document.createElement("div");

    div.className = "branch-card";
    div.innerHTML = branch;

    div.onclick = () => openMenu(branch);

    container.appendChild(div);

  });

}

// ---------- Меню ----------
function openMenu(branch){

  selectedBranch = branch;

  document.getElementById("branch-screen").classList.remove("active");
  document.getElementById("menu-screen").classList.add("active");

  document.getElementById("branch-title").innerHTML = branch;

  const menu = document.getElementById("menu-list");

  menu.innerHTML = "";

  const foods = [

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

    menu.innerHTML += `
      <div class="branch-card">
        <h3>${food.name}</h3>
        <p>${food.price} ₸</p>
        <button class="btn" onclick="addToCart('${food.name}',${food.price})">
          Добавить
        </button>
      </div>
    `;

  });

}

// ---------- Корзина ----------
function addToCart(name,price){

  cart.push({
    name,
    price
  });

  document.getElementById("cart-count").innerHTML = cart.length;

}

// ---------- WhatsApp ----------
function openCart(){

  if(cart.length===0){

    alert("Корзина пуста");

    return;

  }

  let text="Здравствуйте!%0A%0A";

  text+="Филиал: "+selectedBranch+"%0A%0A";

  cart.forEach(item=>{

    text+=item.name+" — "+item.price+" ₸%0A";

  });

  window.open(
    "https://wa.me/77000000000?text="+text,
    "_blank"
  );

}

// ---------- Назад ----------
function backToBranches(){

  document.getElementById("menu-screen").classList.remove("active");
  document.getElementById("branch-screen").classList.add("active");

}