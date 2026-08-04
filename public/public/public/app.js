const branches = [
  {
    id: 1,
    name: "Абылай хана 24"
  },
  {
    id: 2,
    name: "Абая 47"
  },
  {
    id: 3,
    name: "Яссауи"
  },
  {
    id: 4,
    name: "Арбат"
  },
  {
    id: 5,
    name: "Келинка"
  }
];

function checkAddress() {
  document.getElementById("address-screen").classList.remove("active");
  document.getElementById("branch-screen").classList.add("active");

  const container = document.getElementById("branches");
  container.innerHTML = "";

  branches.forEach(branch => {
    const button = document.createElement("button");
    button.className = "btn";
    button.innerText = branch.name;
    button.onclick = () => openBranch(branch);
    container.appendChild(button);
  });
}

function openBranch(branch) {
  document.getElementById("branch-screen").classList.remove("active");
  document.getElementById("menu-screen").classList.add("active");

  document.getElementById("branch-title").innerText = branch.name;
  document.getElementById("menu-list").innerHTML =
    "<h3>Меню этого филиала скоро появится.</h3>";
}

function backToBranches() {
  document.getElementById("menu-screen").classList.remove("active");
  document.getElementById("branch-screen").classList.add("active");
}

function openCart() {
  alert("Корзина пока в разработке.");
}