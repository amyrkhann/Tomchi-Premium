function checkAddress() {
    const address = document.getElementById("address").value.trim();

    if (address === "") {
        alert("Введите адрес доставки");
        return;
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
        container.appendChild(card);
    });
}

function setLanguage(lang){
    localStorage.setItem("language", lang);
}