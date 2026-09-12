const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const ROOT = path.join(__dirname, "public");
const DATA = path.join(__dirname, "data.json");
const UPLOADS = path.join(ROOT, "uploads");

if (!fs.existsSync(UPLOADS)) {
  fs.mkdirSync(UPLOADS, { recursive: true });
}

const PORT = process.env.PORT || 3000;

const ADMIN_TOKEN =
  process.env.ADMIN_TOKEN || "CHANGE_ME";

// =====================================================
// TOMCHI — НАСТРОЙКИ
// =====================================================

const DEFAULT_SETTINGS = {
  freeDeliveryMinimum: 5000,
  smallOrderDelivery: 500,
  deliveryStart: "11:00",
  deliveryEnd: "23:00",
  whatsapp: "+77479370909"
};

// =====================================================
// 5 ТОЧЕК ОТПРАВЛЕНИЯ
// =====================================================

const DEFAULT_PICKUP_POINTS = [
  {
    id: 1,
    name: "Абылай Хана 24",
    address: "Абылай Хана 24",
    lat: 43.2636,
    lon: 76.9399,
    workTime: "24/7",
    deliveryTime: "11:00-23:00",
    kaspi: "",
    kaspiName: "",
    whatsapp: ""
  },

  {
    id: 2,
    name: "Tomchi Premium",
    address: "Абылай Хана 34",
    lat: 43.2641,
    lon: 76.9406,
    workTime: "10:00-02:00",
    deliveryTime: "11:00-23:00",
    kaspi: "",
    kaspiName: "",
    whatsapp: ""
  },

  {
    id: 3,
    name: "Арбат",
    address: "Жибек Жолы 106",
    lat: 43.2624,
    lon: 76.9447,
    workTime: "10:00-02:00",
    deliveryTime: "11:00-23:00",
    kaspi: "",
    kaspiName: "",
    whatsapp: ""
  },

  {
    id: 4,
    name: "Абая 47",
    address: "Абая 47",
    lat: 43.2410,
    lon: 76.9126,
    workTime: "10:00-02:00",
    deliveryTime: "11:00-23:00",
    kaspi: "",
    kaspiName: "",
    whatsapp: ""
  },

  {
    id: 5,
    name: "Яссауи",
    address: "Яссауи 66А",
    lat: 43.2210,
    lon: 76.7950,
    workTime: "10:00-02:00",
    deliveryTime: "11:00-23:00",
    kaspi: "",
    kaspiName: "",
    whatsapp: ""
  }
];

// =====================================================
// МЕНЮ
// =====================================================
const DEFAULT_MENU = {
"1": [
  // =========================
  // ПЛОВ
  // =========================

  {
    category: "Плов",
    name: "Ташкентский",
    price: 1990
  },
  {
    category: "Плов",
    name: "Шипа плов",
    price: 2190
  },
  {
    category: "Плов",
    name: "Ханский",
    price: 2490
  },
  {
    category: "Плов",
    name: "По-казахски",
    price: 2590
  },
  {
    category: "Плов",
    name: "Мясо доп.",
    price: 690
  },

  // =========================
  // ПЛОВ 1 КГ
  // =========================

  {
    category: "Плов 1 кг",
    name: "Ташкентский",
    price: 4990
  },
  {
    category: "Плов 1 кг",
    name: "Ханский",
    price: 6490
  },

  // =========================
  // ПЛОВ ПРЕДЗАКАЗ
  // =========================

  {
    category: "Плов предзаказ",
    name: "Чайхана плов (1 кг)",
    price: 5090
  },
  {
    category: "Плов предзаказ",
    name: "Самаркандский (1 кг)",
    price: 6290
  },

  // =========================
  // САМСА
  // =========================

  {
    category: "Самса",
    name: "Куриный",
    price: 550
  },
  {
    category: "Самса",
    name: "Говядина",
    price: 600
  },
  {
    category: "Самса",
    name: "Лепешка",
    price: 300
  },

  // =========================
  // СУПЫ
  // =========================

  {
    category: "Супы",
    name: "Пельмени",
    price: 1790
  },
  {
    category: "Супы",
    name: "Тефтели",
    price: 1890
  },
  {
    category: "Супы",
    name: "Шорпа",
    price: 1890
  },

  // =========================
  // САЛАТЫ
  // =========================

  {
    category: "Салаты",
    name: "Солёные огурцы",
    price: 790
  },
  {
    category: "Салаты",
    name: "Морковча",
    price: 790
  },
  {
    category: "Салаты",
    name: "Чим-чи",
    price: 790
  },
  {
    category: "Салаты",
    name: "Ачичук",
    price: 1090
  },
  {
    category: "Салаты",
    name: "Свежий салат",
    price: 1290
  },

  // =========================
  // ГАРНИРЫ
  // =========================

  {
    category: "Гарниры",
    name: "Фри",
    price: 890
  },
  {
    category: "Гарниры",
    name: "Наггетсы",
    price: 1190
  },

  // =========================
  // ШАШЛЫК
  // =========================

  {
    category: "Шашлык",
    name: "Люля",
    price: 1190
  },
  {
    category: "Шашлык",
    name: "Крылышки",
    price: 1190
  },
  {
    category: "Шашлык",
    name: "Окорочка",
    price: 1190
  },
  {
    category: "Шашлык",
    name: "Утка",
    price: 1190
  },
  {
    category: "Шашлык",
    name: "Рулет",
    price: 1290
  },
  {
    category: "Шашлык",
    name: "Баранина",
    price: 1490
  },
  {
    category: "Шашлык",
    name: "Говядина",
    price: 1490
  },
  {
    category: "Шашлык",
    name: "Семечки",
    price: 1590
  },
  {
    category: "Шашлык",
    name: "Напалеон",
    price: 1790
  },
  {
    category: "Шашлык",
    name: "Антрикод",
    price: 2190
  },

  // =========================
  // СОУСЫ
  // =========================

  {
    category: "Соусы",
    name: "Кетчуп",
    price: 250
  },
  {
    category: "Соусы",
    name: "Майонез",
    price: 250
  },
  {
    category: "Соусы",
    name: "Сырный соус",
    price: 250
  },
  {
    category: "Соусы",
    name: "Красный соус",
    price: 250
  },
  {
    category: "Соусы",
    name: "Сметана",
    price: 350
  },

  // =========================
  // ЛИМОНАДЫ
  // =========================

  {
    category: "Лимонады",
    name: "Мохито 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Мохито 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Манго-маракуйя 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Манго-маракуйя 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Ягодный 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Ягодный 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Классический 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Классический 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Тропический 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Тропический 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Киви-лайм 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Киви-лайм 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Смородиновый 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Смородиновый 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Вишнёвый 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Вишнёвый 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Мандариновый 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Мандариновый 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Малина-лайм 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Малина-лайм 1 л",
    price: 1990
  },

  // =========================
  // НАПИТКИ
  // =========================

  {
    category: "Напитки",
    name: "Salam Cola (разливная) 0,5 л",
    price: 790
  },
  {
    category: "Напитки",
    name: "Salam Cola баночная 0,5 л",
    price: 790
  },
  {
    category: "Напитки",
    name: "Salam Cola 1 л",
    price: 1290
  },
  {
    category: "Напитки",
    name: "Ava разливной 0,5 л",
    price: 690
  },
  {
    category: "Напитки",
    name: "Da-Da сок 0,2 л",
    price: 590
  },
  {
    category: "Напитки",
    name: "Da-Da сок 1 л",
    price: 1290
  },
  {
    category: "Напитки",
    name: "Компот 0,5 л",
    price: 490
  },
  {
    category: "Напитки",
    name: "ASU 0,5 л",
    price: 590
  },
  {
    category: "Напитки",
    name: "ASU 1 л",
    price: 790
  },
  {
    category: "Напитки",
    name: "Айран 0,3 л",
    price: 400
  },
  {
    category: "Напитки",
    name: "Кымыз 1 л",
    price: 2000
  },

  // =========================
  // ДЕСЕРТЫ
  // =========================

  {
    category: "Десерты",
    name: "Пахлава в асс. (2шт.)",
    price: 1200
  },
  {
    category: "Десерты",
    name: "Пахлава фисташки (2шт.)",
    price: 1200
  },
  {
    category: "Десерты",
    name: "Пахлава молочный (2шт.)",
    price: 1400
  },
  {
    category: "Десерты",
    name: "Десерты в асс.",
    price: 1590
  },

  // =========================
  // КОМБО
  // =========================

  {
    category: "Комбо",
    name: "Комбо 1",
    price: 2590,
    description: "Суп с тефтелями, самса с гов., разлив. салам кола 0,5 л."
  },
  {
    category: "Комбо",
    name: "Комбо 2",
    price: 7990,
    description: "Плов таш 1 кг, ачучук 2 порц., люля 2 шт."
  },
  {
    category: "Комбо",
    name: "Комбо 3",
    price: 7990,
    description: "Плов хан 1 кг, ачучук 1 порц., салам кола 1 л."
  },
  {
    category: "Комбо",
    name: "Комбо Семейный",
    price: 12590,
    description: "Плов таш 1 кг, свежий сал., лепешка 2 шт., шашлык 4 шт., салам кола 1 л."
  },
  {
    category: "Комбо",
    name: "Комбо Пятка",
    price: 2990,
    description: "Плов 1 порц., ачучук 1 порц., салам кола разлив 0,5 л."
  },
  {
    category: "Комбо",
    name: "Ассорти 1. шашлыков",
    price: 7590,
    description: "Люля-3, баранина-1, говядина-1, крылышки-1, утка-1"
  },
  {
    category: "Комбо",
    name: "Ассорти 2. шашлыков",
    price: 21990,
    description: "Люля-6, баранина-2, говядина-2, крылышки-2, утка-2, рулет-2, овощи-1, фри-1, соус-2"
  }
],
  

  "2": [
  // =========================
  // ПЛОВ
  // =========================

  {
    category: "Плов",
    name: "Ташкентский",
    price: 1990
  },
  {
    category: "Плов",
    name: "Шипа плов",
    price: 2190
  },
  {
    category: "Плов",
    name: "Ханский",
    price: 2490
  },
  {
    category: "Плов",
    name: "По-казахски",
    price: 2590
  },
  {
    category: "Плов",
    name: "Мясо доп.",
    price: 690
  },

  // =========================
  // ПЛОВ 1 КГ
  // =========================

  {
    category: "Плов 1 кг",
    name: "Ташкентский",
    price: 4990
  },
  {
    category: "Плов 1 кг",
    name: "Ханский",
    price: 6490
  },

  // =========================
  // ПЛОВ ПРЕДЗАКАЗ
  // =========================

  {
    category: "Плов предзаказ",
    name: "Чайхана плов (1 кг)",
    price: 5090
  },
  {
    category: "Плов предзаказ",
    name: "Самаркандский (1 кг)",
    price: 6290
  },

  // =========================
  // ШАШЛЫК
  // =========================

  {
    category: "Шашлык",
    name: "Люля",
    price: 1190
  },
  {
    category: "Шашлык",
    name: "Крылышки",
    price: 1190
  },
  {
    category: "Шашлык",
    name: "Окорочка",
    price: 1190
  },
  {
    category: "Шашлык",
    name: "Утка",
    price: 1190
  },
  {
    category: "Шашлык",
    name: "Рулет",
    price: 1290
  },
  {
    category: "Шашлык",
    name: "Баранина",
    price: 1490
  },
  {
    category: "Шашлык",
    name: "Говядина",
    price: 1490
  },
  {
    category: "Шашлык",
    name: "Семечки",
    price: 1590
  },
  {
    category: "Шашлык",
    name: "Напалеон",
    price: 1790
  },
  {
    category: "Шашлык",
    name: "Антрикод",
    price: 2190
  },

  // =========================
  // САМСА
  // =========================

  {
    category: "Самса",
    name: "Куриный",
    price: 550
  },
  {
    category: "Самса",
    name: "Говядина",
    price: 600
  },
  {
    category: "Самса",
    name: "Лепешка",
    price: 300
  },
  {
    category: "Самса",
    name: "Лаваш",
    price: 250
  },

  // =========================
  // СУПЫ
  // =========================

  {
    category: "Супы",
    name: "Пельмени",
    price: 1790
  },
  {
    category: "Супы",
    name: "Тефтели",
    price: 1890
  },
  {
    category: "Супы",
    name: "Шорпа",
    price: 1890
  },
  {
    category: "Супы",
    name: "Куза шорпа",
    price: 2290
  },
  {
    category: "Супы",
    name: "Нарын",
    price: 2290
  },

  // =========================
  // ТРАДИЦИОННЫЕ БЛЮДА
  // =========================

  {
    category: "Традиционные блюда",
    name: "Манты (5 шт.)",
    price: 2290
  },
  {
    category: "Традиционные блюда",
    name: "Казан кебаб говяжий",
    price: 3490
  },
  {
    category: "Традиционные блюда",
    name: "Казан кебаб баранина",
    price: 3590
  },

  // =========================
  // САЛАТЫ
  // =========================

  {
    category: "Салаты",
    name: "Ачичук",
    price: 1090
  },
  {
    category: "Салаты",
    name: "Свежий салат",
    price: 1290
  },
  {
    category: "Салаты",
    name: "Оливье",
    price: 1790
  },
  {
    category: "Салаты",
    name: "Малибу",
    price: 1890
  },
  {
    category: "Салаты",
    name: "Цезарь с курицей",
    price: 2090
  },
  {
    category: "Салаты",
    name: "Хрустящий баклажан",
    price: 2090
  },

  // =========================
  // ЛАГМАН
  // =========================

  {
    category: "Лагман",
    name: "Домашний",
    price: 2290
  },
  {
    category: "Лагман",
    name: "Гуйру лагман",
    price: 2290
  },
  {
    category: "Лагман",
    name: "Гуйру цомян",
    price: 2290
  },
  {
    category: "Лагман",
    name: "Гуйру ган фан",
    price: 2390
  },
  {
    category: "Лагман",
    name: "Лин-дин цомян",
    price: 2390
  },
  {
    category: "Лагман",
    name: "Мируй лагман",
    price: 2390
  },
  {
    category: "Лагман",
    name: "Фри с мясом",
    price: 2690
  },
  {
    category: "Лагман",
    name: "Бешен нору кур.",
    price: 3190
  },
  {
    category: "Лагман",
    name: "Тебан нору гов.",
    price: 3290
  },
  {
    category: "Лагман",
    name: "Казан-кебаб с рисом",
    price: 3290
  },

  // =========================
  // ДОНЕР
  // =========================

  {
    category: "Донер",
    name: "Куриный 1",
    price: 1790
  },
  {
    category: "Донер",
    name: "Куриный 1,5",
    price: 2290
  },
  {
    category: "Донер",
    name: "Говяжий 1",
    price: 1790
  },
  {
    category: "Донер",
    name: "Говяжий 1,5",
    price: 2290
  },
  {
    category: "Донер",
    name: "Ассорти 1",
    price: 1790
  },
  {
    category: "Донер",
    name: "Ассорти 1,5",
    price: 2290
  },
  {
    category: "Донер",
    name: "Пицца-донер",
    price: 2590,
    description: "кур./гов."
  },

  // =========================
  // ПИЦЦА Ø 30 СМ
  // =========================

  {
    category: "Пицца Ø 30см",
    name: "Маргарита",
    price: 2290
  },
  {
    category: "Пицца Ø 30см",
    name: "Куриный",
    price: 2690
  },
  {
    category: "Пицца Ø 30см",
    name: "Пепперони",
    price: 2790
  },
  {
    category: "Пицца Ø 30см",
    name: "4 сезона",
    price: 2890
  },

  // =========================
  // ГАРНИРЫ
  // =========================

  {
    category: "Гарниры",
    name: "Рис",
    price: 690
  },
  {
    category: "Гарниры",
    name: "Фри",
    price: 890
  },
  {
    category: "Гарниры",
    name: "Наггетсы",
    price: 1190
  },
  {
    category: "Гарниры",
    name: "Сырные палочки (5 шт.)",
    price: 1190
  },

  // =========================
  // СОУСЫ
  // =========================

  {
    category: "Соусы",
    name: "Перчик",
    price: 200
  },
  {
    category: "Соусы",
    name: "Кетчуп",
    price: 250
  },
  {
    category: "Соусы",
    name: "Майонез",
    price: 250
  },
  {
    category: "Соусы",
    name: "Сырный соус",
    price: 250
  },
  {
    category: "Соусы",
    name: "Красный соус",
    price: 250
  },
  {
    category: "Соусы",
    name: "Тар-тар",
    price: 350
  },
  {
    category: "Соусы",
    name: "Сметана",
    price: 350
  },

  // =========================
  // ЧИЗБУРГЕР
  // =========================

  {
    category: "Чизбургер",
    name: "Чизбургер куриный",
    price: 1990
  },
  {
    category: "Чизбургер",
    name: "Чизбургер говяжий",
    price: 2190
  },
  {
    category: "Чизбургер",
    name: "Чизбургер ассорти",
    price: 2690
  },

  // =========================
  // КРЫЛЫШКИ
  // =========================

  {
    category: "Крылышки",
    name: "Баскет 1",
    price: 3590,
    description: "Две порции фри, самса с гов., 0,5 л. напиток"
  },
  {
    category: "Крылышки",
    name: "Баскет 2",
    price: 5190,
    description: "Крылышки 6 шт., фри 2 порц., соус 2 шт."
  },

  // =========================
  // КОФЕ
  // =========================

  {
    category: "Кофе",
    name: "Эспрессо",
    price: 1090,
    description: "60 мл"
  },
  {
    category: "Кофе",
    name: "Американо",
    price: 1190,
    description: "300 мл"
  },
  {
    category: "Кофе",
    name: "Американо",
    price: 1290,
    description: "400 мл"
  },
  {
    category: "Кофе",
    name: "Латте",
    price: 1690,
    description: "400 мл"
  },
  {
    category: "Кофе",
    name: "Капучино",
    price: 1590,
    description: "300 мл"
  },
  {
    category: "Кофе",
    name: "Раф",
    price: 1590,
    description: "300 мл"
  },
  {
    category: "Кофе",
    name: "Flat White",
    price: 1490,
    description: "200 мл"
  },
  {
    category: "Кофе",
    name: "Сироп в ассортименте",
    price: 250,
    description: "20 мл"
  },

  // =========================
  // ШОКОЛАД
  // =========================

  {
    category: "Шоколад",
    name: "Горячий шоколад",
    price: 1290,
    description: "300 мл"
  },
  {
    category: "Шоколад",
    name: "Какао",
    price: 1290,
    description: "300 мл"
  },

  // =========================
  // ЛИМОНАДЫ
  // =========================

  {
    category: "Лимонады",
    name: "Мохито 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Мохито 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Манго-маракуйя 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Манго-маракуйя 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Ягодный 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Ягодный 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Классический 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Классический 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Тропический 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Тропический 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Киви-лайм 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Киви-лайм 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Смородиновый 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Смородиновый 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Вишнёвый 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Вишнёвый 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Мандариновый 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Мандариновый 1 л",
    price: 1990
  },
  {
    category: "Лимонады",
    name: "Малина-лайм 0,4 л",
    price: 890
  },
  {
    category: "Лимонады",
    name: "Малина-лайм 1 л",
    price: 1990
  },

  // =========================
  // СМУЗИ
  // =========================

  {
    category: "Смузи",
    name: "Банановый",
    price: 2090,
    description: "400 мл"
  },
  {
    category: "Смузи",
    name: "Смородина-банан",
    price: 2090,
    description: "400 мл"
  },
  {
    category: "Смузи",
    name: "Киви-банан",
    price: 2090,
    description: "400 мл"
  },
  {
    category: "Смузи",
    name: "Тропический",
    price: 2090,
    description: "400 мл"
  },

  // =========================
  // МИЛКШЕЙКИ
  // =========================

  {
    category: "Милкшейки",
    name: "Шоколадный",
    price: 1490,
    description: "300 мл"
  },
  {
    category: "Милкшейки",
    name: "Клубничный",
    price: 1490,
    description: "300 мл"
  },
  {
    category: "Милкшейки",
    name: "Ванильный",
    price: 1490,
    description: "300 мл"
  },
  {
    category: "Милкшейки",
    name: "Орео",
    price: 1890,
    description: "300 мл"
  },
  {
    category: "Милкшейки",
    name: "Сникерс",
    price: 1890,
    description: "300 мл"
  },

  // =========================
  // НАПИТКИ
  // =========================

  {
    category: "Напитки",
    name: "Salam Cola (разливная)",
    price: 790,
    description: "0,5 л"
  },
  {
    category: "Напитки",
    name: "Salam Cola баночная",
    price: 790,
    description: "0,5 л"
  },
  {
    category: "Напитки",
    name: "Salam Cola",
    price: 1290,
    description: "1 л"
  },
  {
    category: "Напитки",
    name: "Ava разливной",
    price: 690,
    description: "0,5 л"
  },
  {
    category: "Напитки",
    name: "Da-Da сок",
    price: 590,
    description: "0,2 л"
  },
  {
    category: "Напитки",
    name: "Da-Da сок",
    price: 1290,
    description: "1 л"
  },
  {
    category: "Напитки",
    name: "Компот",
    price: 490,
    description: "0,5 л"
  },
  {
    category: "Напитки",
    name: "ASU",
    price: 590,
    description: "0,5 л"
  },
  {
    category: "Напитки",
    name: "ASU",
    price: 790,
    description: "1 л"
  },
  {
    category: "Напитки",
    name: "Айран",
    price: 400,
    description: "0,3 л"
  },
  {
    category: "Напитки",
    name: "Кымыз",
    price: 2000,
    description: "1 л"
  },

  // =========================
  // ДЕСЕРТЫ
  // =========================

  {
    category: "Десерты",
    name: "Чак-чак",
    price: 290
  },
  {
    category: "Десерты",
    name: "Пахлава в асс. (2шт.)",
    price: 1200
  },
  {
    category: "Десерты",
    name: "Пахлава фисташки (2шт.)",
    price: 1200
  },
  {
    category: "Десерты",
    name: "Пахлава молочный (2шт.)",
    price: 1400
  },
  {
    category: "Десерты",
    name: "Десерты в асс.",
    price: 1590
  },

  // =========================
  // КОМБО
  // =========================

  {
    category: "Комбо",
    name: "Комбо 1",
    price: 2590,
    description: "Суп с тефтелями, самса с гов., разлив. салам кола 0,5 л."
  },
  {
    category: "Комбо",
    name: "Комбо 2",
    price: 7990,
    description: "Плов таш 1 кг, ачучук 2 порц., акки 2 шт."
  },
  {
    category: "Комбо",
    name: "Комбо 3",
    price: 7990,
    description: "Плов хан 1 кг, ачучук 1 порц., салам кола 1 л."
  },
  {
    category: "Комбо",
    name: "Комбо Семейный",
    price: 12590,
    description: "Плов таш 1 кг, свежий сал., лепешка 2 шт., шашлык 4 шт., салам кола 1 л."
  },
  {
    category: "Комбо",
    name: "Комбо Жума",
    price: 2990,
    description: "Плов 1 порц., ачучук 1 порц., салам кола разлив 0,5 л."
  },
  {
    category: "Комбо",
    name: "Ассорти 1. шашлыков",
    price: 7590,
    description: "Люля-3, баранина-1, говядина-1, крылышки-1, утка-1"
  },
  {
    category: "Комбо",
    name: "Ассорти 2. шашлыков",
    price: 21990,
    description: "Люля-6, баранина-2, говядина-2, крылышки-2, утка-2, рулет-2, овощи-1, фри-1, соус-2"
  }
],
    

  "3": [
  // Жибек Жолы 106

  // Плов
  {
    id: 301,
    category: "Плов",
    name: "Ташкентский",
    price: 1990
  },
  {
    id: 302,
    category: "Плов",
    name: "Шипа плов",
    price: 2190
  },
  {
    id: 303,
    category: "Плов",
    name: "Ханский",
    price: 2490
  },
  {
    id: 304,
    category: "Плов",
    name: "По-казахски",
    price: 2590
  },
  {
    id: 305,
    category: "Плов",
    name: "Мясо доп.",
    price: 690
  },

  // Плов 1 кг
  {
    id: 306,
    category: "Плов 1 кг",
    name: "Ташкентский",
    price: 4990
  },
  {
    id: 307,
    category: "Плов 1 кг",
    name: "Ханский",
    price: 6490
  },

  // Самса
  {
    id: 308,
    category: "Самса",
    name: "Куриный",
    price: 550
  },
  {
    id: 309,
    category: "Самса",
    name: "Говядина",
    price: 600
  },
  {
    id: 310,
    category: "Самса",
    name: "Лепешка",
    price: 300
  },

  // Шашлык
  {
    id: 311,
    category: "Шашлык",
    name: "Люля",
    price: 1190
  },
  {
    id: 312,
    category: "Шашлык",
    name: "Крылышки",
    price: 1190
  },
  {
    id: 313,
    category: "Шашлык",
    name: "Окорочка",
    price: 1190
  },
  {
    id: 314,
    category: "Шашлык",
    name: "Утка",
    price: 1190
  },
  {
    id: 315,
    category: "Шашлык",
    name: "Рулет",
    price: 1290
  },
  {
    id: 316,
    category: "Шашлык",
    name: "Баранина",
    price: 1490
  },
  {
    id: 317,
    category: "Шашлык",
    name: "Говядина",
    price: 1490
  },
  {
    id: 318,
    category: "Шашлык",
    name: "Семечки",
    price: 1590
  },
  {
    id: 319,
    category: "Шашлык",
    name: "Наполеон",
    price: 1790
  },
  {
    id: 320,
    category: "Шашлык",
    name: "Антрикот",
    price: 2190
  },

  // Супы
  {
    id: 321,
    category: "Супы",
    name: "Пельмени",
    price: 1790
  },
  {
    id: 322,
    category: "Супы",
    name: "Тефтели",
    price: 1890
  },
  {
    id: 323,
    category: "Супы",
    name: "Шорпа",
    price: 1890
  },
  {
    id: 324,
    category: "Супы",
    name: "Манпар",
    price: 1890
  },
  {
    id: 325,
    category: "Супы",
    name: "Нарын",
    price: 2290
  },

  // Традиционные блюда
  {
    id: 326,
    category: "Традиционные блюда",
    name: "Манты (5 шт.)",
    price: 2290
  },
  {
    id: 327,
    category: "Традиционные блюда",
    name: "Казан кебаб говяжий",
    price: 3490
  },
  {
    id: 328,
    category: "Традиционные блюда",
    name: "Казан кебаб баранина",
    price: 3590
  },

  // Салаты
  {
    id: 329,
    category: "Салаты",
    name: "Морковча",
    price: 790
  },
  {
    id: 330,
    category: "Салаты",
    name: "Чим-чи",
    price: 790
  },
  {
    id: 331,
    category: "Салаты",
    name: "Ачичук",
    price: 1090
  },
  {
    id: 332,
    category: "Салаты",
    name: "Свежий салат",
    price: 1290
  },
  {
    id: 333,
    category: "Салаты",
    name: "Оливье",
    price: 1790
  },
  {
    id: 334,
    category: "Салаты",
    name: "Малибу",
    price: 1890
  },
  {
    id: 335,
    category: "Салаты",
    name: "Цезарь с курицей",
    price: 2090
  },
  {
    id: 336,
    category: "Салаты",
    name: "Хрустящий баклажан",
    price: 2090
  },

  // Лагман
  {
    id: 337,
    category: "Лагман",
    name: "Домашний",
    price: 2290
  },
  {
    id: 338,
    category: "Лагман",
    name: "Гуйру лагман",
    price: 2290
  },
  {
    id: 339,
    category: "Лагман",
    name: "Гуйру цомян",
    price: 2290
  },
  {
    id: 340,
    category: "Лагман",
    name: "Гуйру ган фан",
    price: 2390
  },
  {
    id: 341,
    category: "Лагман",
    name: "Дин-дин цомян",
    price: 2390
  },
  {
    id: 342,
    category: "Лагман",
    name: "Мошуру лагман",
    price: 2390
  },
  {
    id: 343,
    category: "Лагман",
    name: "Фри с мясом",
    price: 2690
  },
  {
    id: 344,
    category: "Лагман",
    name: "Бешеную юр.",
    price: 3190
  },
  {
    id: 345,
    category: "Лагман",
    name: "Тебан нюрю гов.",
    price: 3290
  },
  {
    id: 346,
    category: "Лагман",
    name: "Казан-кебаб с рисом",
    price: 3290
  },

  // Донер
  {
    id: 347,
    category: "Донер",
    name: "Куриный 1",
    price: 1790
  },
  {
    id: 348,
    category: "Донер",
    name: "Куриный 1,5",
    price: 2290
  },
  {
    id: 349,
    category: "Донер",
    name: "Пицца-донер",
    price: 2590
  },

  // Пицца
  {
    id: 350,
    category: "Пицца Ø 30см",
    name: "Маргарита",
    price: 2290
  },
  {
    id: 351,
    category: "Пицца Ø 30см",
    name: "Куриный",
    price: 2690
  },
  {
    id: 352,
    category: "Пицца Ø 30см",
    name: "Пепперони",
    price: 2790
  },
  {
    id: 353,
    category: "Пицца Ø 30см",
    name: "4 сезона",
    price: 2890
  },

  // Гарниры
  {
    id: 354,
    category: "Гарниры",
    name: "Рис",
    price: 690
  },
  {
    id: 355,
    category: "Гарниры",
    name: "Фри",
    price: 890
  },
  {
    id: 356,
    category: "Гарниры",
    name: "Наггетсы",
    price: 1190
  },
  {
    id: 357,
    category: "Гарниры",
    name: "Сырные палочки (5 шт.)",
    price: 1190
  },

  // Соусы
  {
    id: 358,
    category: "Соусы",
    name: "Перчик",
    price: 200
  },
  {
    id: 359,
    category: "Соусы",
    name: "Кетчуп",
    price: 250
  },
  {
    id: 360,
    category: "Соусы",
    name: "Майонез",
    price: 250
  },
  {
    id: 361,
    category: "Соусы",
    name: "Сырный соус",
    price: 250
  },
  {
    id: 362,
    category: "Соусы",
    name: "Красный соус",
    price: 250
  },
  {
    id: 363,
    category: "Соусы",
    name: "Тар-тар",
    price: 350
  },
  {
    id: 364,
    category: "Соусы",
    name: "Сметана",
    price: 350
  },

  // Чизбургер
  {
    id: 365,
    category: "Чизбургер",
    name: "Чизбургер куриный",
    price: 1990
  },
  {
    id: 366,
    category: "Чизбургер",
    name: "Чизбургер говяжий",
    price: 2190
  },
  {
    id: 367,
    category: "Чизбургер",
    name: "Чизбургер ассорти",
    price: 2690
  },

  // Крылышки
  {
    id: 368,
    category: "Крылышки",
    name: "Баскет 1",
    price: 3590
  },
  {
    id: 369,
    category: "Крылышки",
    name: "Баскет 2",
    price: 5190
  },

  // Выпечка
  {
    id: 370,
    category: "Выпечка",
    name: "Лепешка",
    price: 300
  },
  {
    id: 371,
    category: "Выпечка",
    name: "Баурсак",
    price: 1190
  },

  // Комбо
  {
    id: 372,
    category: "Комбо",
    name: "Комбо 1",
    price: 2590
  },
  {
    id: 373,
    category: "Комбо",
    name: "Комбо 2",
    price: 7990
  },
  {
    id: 374,
    category: "Комбо",
    name: "Комбо 3",
    price: 7990
  },
  {
    id: 375,
    category: "Комбо",
    name: "Комбо Семейный",
    price: 12590
  },
  {
    id: 376,
    category: "Комбо",
    name: "Комбо Жума",
    price: 2990
  },
  {
    id: 377,
    category: "Комбо",
    name: "Ассорти 1. шашлыков",
    price: 7590
  },
  {
    id: 378,
    category: "Комбо",
    name: "Ассорти 2. шашлыков",
    price: 21990
  },

  // Ice-tea
  {
    id: 379,
    category: "Ice-tea",
    name: "Черный",
    price: 990
  },
  {
    id: 380,
    category: "Ice-tea",
    name: "Зеленый",
    price: 990
  },
  {
    id: 381,
    category: "Ice-tea",
    name: "Манго",
    price: 990
  },
  {
    id: 382,
    category: "Ice-tea",
    name: "Вишневый",
    price: 990
  },
  {
    id: 383,
    category: "Ice-tea",
    name: "Ананас",
    price: 990
  },

  // Милкшейки
  {
    id: 384,
    category: "Милкшейки",
    name: "Шоколадный",
    price: 1490
  },
  {
    id: 385,
    category: "Милкшейки",
    name: "Клубничный",
    price: 1490
  },
  {
    id: 386,
    category: "Милкшейки",
    name: "Ванильный",
    price: 1490
  },
  {
    id: 387,
    category: "Милкшейки",
    name: "Орео",
    price: 1890
  },
  {
    id: 388,
    category: "Милкшейки",
    name: "Сникерс",
    price: 1890
  },

  // Напитки
  {
    id: 389,
    category: "Напитки",
    name: "Salam Cola (разливная) 0,5л",
    price: 790
  },
  {
    id: 390,
    category: "Напитки",
    name: "Salam Cola баночная 0,5л",
    price: 790
  },
  {
    id: 391,
    category: "Напитки",
    name: "Salam Cola 1л",
    price: 1290
  },
  {
    id: 392,
    category: "Напитки",
    name: "Ava разливной 0,5л",
    price: 690
  },
  {
    id: 393,
    category: "Напитки",
    name: "Da-Da сок 0,2л",
    price: 590
  },
  {
    id: 394,
    category: "Напитки",
    name: "Da-Da сок 1л",
    price: 1290
  },
  {
    id: 395,
    category: "Напитки",
    name: "Компот 0,5л",
    price: 490
  },
  {
    id: 396,
    category: "Напитки",
    name: "Компот 1л",
    price: 790
  },
  {
    id: 397,
    category: "Напитки",
    name: "ASU 0,5л",
    price: 590
  },
  {
    id: 398,
    category: "Напитки",
    name: "ASU 1л",
    price: 790
  },
  {
    id: 399,
    category: "Напитки",
    name: "Айран 0,3л",
    price: 400
  },
  {
    id: 400,
    category: "Напитки",
    name: "Кымыз 1л",
    price: 2000
  },

  // Десерты
  {
    id: 401,
    category: "Десерты",
    name: "Десерты в асс.",
    price: 1590
  }
],

  "4": [
  // Абая 47

  // Плов
  {
    id: 401,
    category: "Плов",
    name: "Ташкентский",
    price: 1990
  },
  {
    id: 402,
    category: "Плов",
    name: "Шипа плов",
    price: 2190
  },
  {
    id: 403,
    category: "Плов",
    name: "Ханский",
    price: 2490
  },
  {
    id: 404,
    category: "Плов",
    name: "По-казахски",
    price: 2590
  },
  {
    id: 405,
    category: "Плов",
    name: "Мясо доп.",
    price: 690
  },

  // Плов 1 кг
  {
    id: 406,
    category: "Плов 1 кг",
    name: "Ташкентский",
    price: 4990
  },
  {
    id: 407,
    category: "Плов 1 кг",
    name: "Ханский",
    price: 6490
  },

  // Плов подзаказ
  {
    id: 408,
    category: "Плов подзаказ",
    name: "Чайхана плов (6-7 персон)",
    price: 14990
  },

  // Самса
  {
    id: 409,
    category: "Самса",
    name: "Куриный",
    price: 550
  },
  {
    id: 410,
    category: "Самса",
    name: "Говядина",
    price: 600
  },
  {
    id: 411,
    category: "Самса",
    name: "Лепешка",
    price: 300
  },

  // Супы
  {
    id: 412,
    category: "Супы",
    name: "Окрошка",
    price: 1690
  },
  {
    id: 413,
    category: "Супы",
    name: "Суп из говядины",
    price: 1890
  },
  {
    id: 414,
    category: "Супы",
    name: "Суп с тефтелями",
    price: 1890
  },

  // Салаты
  {
    id: 415,
    category: "Салаты",
    name: "Капуста по-домашнему",
    price: 790
  },
  {
    id: 416,
    category: "Салаты",
    name: "Чим-чи",
    price: 790
  },
  {
    id: 417,
    category: "Салаты",
    name: "Ачучук",
    price: 990
  },
  {
    id: 418,
    category: "Салаты",
    name: "Свежий салат",
    price: 1190
  },
  {
    id: 419,
    category: "Салаты",
    name: "Крабовый",
    price: 1290
  },

  // Шашлык
  {
    id: 420,
    category: "Шашлык",
    name: "Люля",
    price: 1190
  },
  {
    id: 421,
    category: "Шашлык",
    name: "Крылышки",
    price: 1190
  },
  {
    id: 422,
    category: "Шашлык",
    name: "Окорочка",
    price: 1190
  },
  {
    id: 423,
    category: "Шашлык",
    name: "Утка",
    price: 1190
  },
  {
    id: 424,
    category: "Шашлык",
    name: "Рулет",
    price: 1290
  },
  {
    id: 425,
    category: "Шашлык",
    name: "Баранина",
    price: 1490
  },
  {
    id: 426,
    category: "Шашлык",
    name: "Говядина",
    price: 1490
  },
  {
    id: 427,
    category: "Шашлык",
    name: "Семечки",
    price: 1590
  },
  {
    id: 428,
    category: "Шашлык",
    name: "Наполеон",
    price: 1790
  },
  {
    id: 429,
    category: "Шашлык",
    name: "Антрикот",
    price: 2190
  },

  // Донер
  {
    id: 430,
    category: "Донер",
    name: "Куриный",
    price: 1790
  },
  {
    id: 431,
    category: "Донер",
    name: "Куриный 1,5",
    price: 2290
  },

  // Соусы
  {
    id: 432,
    category: "Соусы",
    name: "Кетчуп",
    price: 250
  },
  {
    id: 433,
    category: "Соусы",
    name: "Майонез",
    price: 250
  },
  {
    id: 434,
    category: "Соусы",
    name: "Сырный соус",
    price: 250
  },
  {
    id: 435,
    category: "Соусы",
    name: "Красный соус",
    price: 250
  },
  {
    id: 436,
    category: "Соусы",
    name: "Тар-тар",
    price: 350
  },
  {
    id: 437,
    category: "Соусы",
    name: "Сметана",
    price: 350
  },

  // Гарниры
  {
    id: 438,
    category: "Гарниры",
    name: "Фри",
    price: 890
  },
  {
    id: 439,
    category: "Гарниры",
    name: "Наггетсы",
    price: 1190
  },

  // Комбо
  {
    id: 440,
    category: "Комбо",
    name: "Комбо 1",
    price: 2590
  },
  {
    id: 441,
    category: "Комбо",
    name: "Комбо 2",
    price: 7990
  },
  {
    id: 442,
    category: "Комбо",
    name: "Комбо 3",
    price: 7990
  },
  {
    id: 443,
    category: "Комбо",
    name: "Комбо Семейный",
    price: 12590
  },
  {
    id: 444,
    category: "Комбо",
    name: "Комбо Жұма",
    price: 2990
  },
  {
    id: 445,
    category: "Комбо",
    name: "Ассорти 1. шашлыков",
    price: 7590
  },
  {
    id: 446,
    category: "Комбо",
    name: "Ассорти 2. шашлыков",
    price: 21990
  },

  // Лимонады
  {
    id: 447,
    category: "Лимонады",
    name: "Мохито",
    price: 890
  },
  {
    id: 448,
    category: "Лимонады",
    name: "Манго-маракуйя",
    price: 890
  },
  {
    id: 449,
    category: "Лимонады",
    name: "Ягодный",
    price: 890
  },
  {
    id: 450,
    category: "Лимонады",
    name: "Классический",
    price: 890
  },
  {
    id: 451,
    category: "Лимонады",
    name: "Тропический",
    price: 890
  },
  {
    id: 452,
    category: "Лимонады",
    name: "Киви-лайм",
    price: 890
  },
  {
    id: 453,
    category: "Лимонады",
    name: "Смородиновый",
    price: 890
  },
  {
    id: 454,
    category: "Лимонады",
    name: "Вишнёвый",
    price: 890
  },
  {
    id: 455,
    category: "Лимонады",
    name: "Мандариновый",
    price: 890
  },
  {
    id: 456,
    category: "Лимонады",
    name: "Малина-лайм",
    price: 890
  },

  // Ice-tea
  {
    id: 457,
    category: "Ice-tea",
    name: "Чёрный",
    price: 990
  },
  {
    id: 458,
    category: "Ice-tea",
    name: "Зелёный",
    price: 990
  },
  {
    id: 459,
    category: "Ice-tea",
    name: "Манго",
    price: 990
  },
  {
    id: 460,
    category: "Ice-tea",
    name: "Вишнёвый",
    price: 990
  },
  {
    id: 461,
    category: "Ice-tea",
    name: "Ананас",
    price: 990
  },

  // Напитки
  {
    id: 462,
    category: "Напитки",
    name: "Salam Cola (разливная) 0,5л",
    price: 790
  },
  {
    id: 463,
    category: "Напитки",
    name: "Salam Cola баночная 0,5л",
    price: 790
  },
  {
    id: 464,
    category: "Напитки",
    name: "Salam Cola 1л",
    price: 1290
  },
  {
    id: 465,
    category: "Напитки",
    name: "Ava разливной 0,5л",
    price: 690
  },
  {
    id: 466,
    category: "Напитки",
    name: "Da-Da сок 0,2л",
    price: 590
  },
  {
    id: 467,
    category: "Напитки",
    name: "Da-Da сок 1л",
    price: 1290
  },
  {
    id: 468,
    category: "Напитки",
    name: "Компот 0,5л",
    price: 490
  },
  {
    id: 469,
    category: "Напитки",
    name: "Компот 1л",
    price: 990
  },
  {
    id: 470,
    category: "Напитки",
    name: "ASU 0,5л",
    price: 590
  },
  {
    id: 471,
    category: "Напитки",
    name: "ASU 1л",
    price: 790
  },
  {
    id: 472,
    category: "Напитки",
    name: "Айран 0,3л",
    price: 400
  },
  {
    id: 473,
    category: "Напитки",
    name: "Кымыз 1л",
    price: 2000
  },

  // Десерты
  {
    id: 474,
    category: "Десерты",
    name: "Пахлава в асс. (2шт.)",
    price: 1200
  },
  {
    id: 475,
    category: "Десерты",
    name: "Пахлава фисташки (2шт.)",
    price: 1200
  },
  {
    id: 476,
    category: "Десерты",
    name: "Пахлава молочный (2шт.)",
    price: 1400
  },
  {
    id: 477,
    category: "Десерты",
    name: "Десерты в асс.",
    price: 1590
  }
],

  "5": [
  // Яссауи 66А

  // Плов
  {
    id: 501,
    category: "Плов",
    name: "Ташкентский",
    price: 1990
  },
  {
    id: 502,
    category: "Плов",
    name: "Чайхана плов",
    price: 2190
  },
  {
    id: 503,
    category: "Плов",
    name: "Шипа плов",
    price: 2190
  },
  {
    id: 504,
    category: "Плов",
    name: "Самаркандский",
    price: 2490
  },
  {
    id: 505,
    category: "Плов",
    name: "Ханский",
    price: 2490
  },
  {
    id: 506,
    category: "Плов",
    name: "По-казахски",
    price: 2590
  },
  {
    id: 507,
    category: "Плов",
    name: "Мясо доп.",
    price: 690
  },

  // Плов 1 кг
  {
    id: 508,
    category: "Плов 1 кг",
    name: "Ташкентский",
    price: 4990
  },
  {
    id: 509,
    category: "Плов 1 кг",
    name: "Ханский",
    price: 6490
  },

  // Плов предзаказ
  {
    id: 510,
    category: "Плов предзаказ",
    name: "Самаркандский (1 кг)",
    price: 6290
  },
  {
    id: 511,
    category: "Плов предзаказ",
    name: "Чайхана плов (6-7 персон)",
    price: 14990
  },

  // Самса
  {
    id: 512,
    category: "Самса",
    name: "Куриный",
    price: 550
  },
  {
    id: 513,
    category: "Самса",
    name: "Говядина",
    price: 600
  },

  // Супы
  {
    id: 514,
    category: "Супы",
    name: "Пельмени",
    price: 1790
  },
  {
    id: 515,
    category: "Супы",
    name: "Суп из говядины",
    price: 1890
  },
  {
    id: 516,
    category: "Супы",
    name: "Суп с тефтелями",
    price: 1890
  },
  {
    id: 517,
    category: "Супы",
    name: "Нарын",
    price: 2290
  },

  // Традиционные блюда
  {
    id: 518,
    category: "Традиционные блюда",
    name: "Манты (5 шт.)",
    price: 2290
  },
  {
    id: 519,
    category: "Традиционные блюда",
    name: "Бешбармак",
    price: 3490
  },

  // Салаты
  {
    id: 520,
    category: "Салаты",
    name: "Морковча",
    price: 790
  },
  {
    id: 521,
    category: "Салаты",
    name: "Чим-чи",
    price: 790
  },
  {
    id: 522,
    category: "Салаты",
    name: "Ачучук",
    price: 1090
  },
  {
    id: 523,
    category: "Салаты",
    name: "Бахор",
    price: 1190
  },
  {
    id: 524,
    category: "Салаты",
    name: "Свежий салат",
    price: 1290
  },
  {
    id: 525,
    category: "Салаты",
    name: "Оливье",
    price: 1790
  },
  {
    id: 526,
    category: "Салаты",
    name: "Малибу",
    price: 1890
  },
  {
    id: 527,
    category: "Салаты",
    name: "Цезарь с курицей",
    price: 2090
  },
  {
    id: 528,
    category: "Салаты",
    name: "Хрустящий баклажан",
    price: 2090
  },

  // Шашлык
  {
    id: 529,
    category: "Шашлык",
    name: "Люля",
    price: 1190
  },
  {
    id: 530,
    category: "Шашлык",
    name: "Крылышки",
    price: 1190
  },
  {
    id: 531,
    category: "Шашлык",
    name: "Окорочка",
    price: 1190
  },
  {
    id: 532,
    category: "Шашлык",
    name: "Утка",
    price: 1190
  },
  {
    id: 533,
    category: "Шашлык",
    name: "Рулет",
    price: 1290
  },
  {
    id: 534,
    category: "Шашлык",
    name: "Баранина",
    price: 1490
  },
  {
    id: 535,
    category: "Шашлык",
    name: "Говядина",
    price: 1490
  },
  {
    id: 536,
    category: "Шашлык",
    name: "Семечки",
    price: 1590
  },
  {
    id: 537,
    category: "Шашлык",
    name: "Наполеон",
    price: 1790
  },
  {
    id: 538,
    category: "Шашлык",
    name: "Антрикот",
    price: 2190
  },

  // Пицца
  {
    id: 539,
    category: "Пицца",
    name: "Маргарита",
    price: 2290
  },
  {
    id: 540,
    category: "Пицца",
    name: "Куриный",
    price: 2690
  },
  {
    id: 541,
    category: "Пицца",
    name: "Пепперони",
    price: 2790
  },
  {
    id: 542,
    category: "Пицца",
    name: "4 сезона",
    price: 2890
  },

  // Лагман
  {
    id: 543,
    category: "Лагман",
    name: "Домашний",
    price: 2290
  },
  {
    id: 544,
    category: "Лагман",
    name: "Суйру лагман",
    price: 2290
  },
  {
    id: 545,
    category: "Лагман",
    name: "Гуйру лагман",
    price: 2290
  },
  {
    id: 546,
    category: "Лагман",
    name: "Гуйру цомян",
    price: 2390
  },
  {
    id: 547,
    category: "Лагман",
    name: "Дин-дин цомян",
    price: 2390
  },
  {
    id: 548,
    category: "Лагман",
    name: "Мошуру лагман",
    price: 2390
  },
  {
    id: 549,
    category: "Лагман",
    name: "Мясо по-тайски",
    price: 2690
  },
  {
    id: 550,
    category: "Лагман",
    name: "Фри с мясом",
    price: 2690
  },
  {
    id: 551,
    category: "Лагман",
    name: "Фри с мясом",
    price: 2690
  },
  {
    id: 552,
    category: "Лагман",
    name: "Казан-кебаб с рисом",
    price: 3290
  },

  // Донер
  {
    id: 553,
    category: "Донер",
    name: "Куриный",
    price: 1790
  },
  {
    id: 554,
    category: "Донер",
    name: "Куриный 1,5",
    price: 2290
  },
  {
    id: 555,
    category: "Донер",
    name: "Пицца-донер",
    price: 2590
  },

  // Соусы
  {
    id: 556,
    category: "Соусы",
    name: "Кетчуп",
    price: 250
  },
  {
    id: 557,
    category: "Соусы",
    name: "Майонез",
    price: 250
  },
  {
    id: 558,
    category: "Соусы",
    name: "Сырный соус",
    price: 250
  },
  {
    id: 559,
    category: "Соусы",
    name: "Красный соус",
    price: 250
  },
  {
    id: 560,
    category: "Соусы",
    name: "Тар-тар",
    price: 350
  },
  {
    id: 561,
    category: "Соусы",
    name: "Сметана",
    price: 350
  },

  // Крылышки
  {
    id: 562,
    category: "Крылышки",
    name: "Баскет 1",
    price: 3590
  },
  {
    id: 563,
    category: "Крылышки",
    name: "Баскет 2",
    price: 5190
  },

  // Выпечка
  {
    id: 564,
    category: "Выпечка",
    name: "Лепешка",
    price: 300
  },
  {
    id: 565,
    category: "Выпечка",
    name: "Баурсак",
    price: 1190
  },

  // Гарниры
  {
    id: 566,
    category: "Гарниры",
    name: "Рис",
    price: 690
  },
  {
    id: 567,
    category: "Гарниры",
    name: "Фри",
    price: 890
  },
  {
    id: 568,
    category: "Гарниры",
    name: "Наггетсы",
    price: 1190
  },
  {
    id: 569,
    category: "Гарниры",
    name: "Сырные палочки (5 шт.)",
    price: 1190
  },

  // Комбо
  {
    id: 570,
    category: "Комбо",
    name: "Комбо 1",
    price: 2590
  },
  {
    id: 571,
    category: "Комбо",
    name: "Комбо 2",
    price: 7990
  },
  {
    id: 572,
    category: "Комбо",
    name: "Комбо 3",
    price: 7990
  },
  {
    id: 573,
    category: "Комбо",
    name: "Комбо Семейный",
    price: 12590
  },
  {
    id: 574,
    category: "Комбо",
    name: "Комбо Жұма",
    price: 2990
  },
  {
    id: 575,
    category: "Комбо",
    name: "Ассорти 1. шашлыков",
    price: 7590
  },
  {
    id: 576,
    category: "Комбо",
    name: "Ассорти 2. шашлыков",
    price: 21990
  },

  // Кофе
  {
    id: 577,
    category: "Кофе",
    name: "Эспрессо",
    price: 1090
  },
  {
    id: 578,
    category: "Кофе",
    name: "Американо",
    price: 1190
  },
  {
    id: 579,
    category: "Кофе",
    name: "Латте",
    price: 1690
  },
  {
    id: 580,
    category: "Кофе",
    name: "Капучино",
    price: 1590
  },
  {
    id: 581,
    category: "Кофе",
    name: "Раф",
    price: 1590
  },
  {
    id: 582,
    category: "Кофе",
    name: "Flat White",
    price: 1490
  },
  {
    id: 583,
    category: "Кофе",
    name: "Сироп в ассортименте 20мл",
    price: 250
  },

  // Шоколад
  {
    id: 584,
    category: "Шоколад",
    name: "Горячий шоколад",
    price: 1290
  },
  {
    id: 585,
    category: "Шоколад",
    name: "Какао",
    price: 1290
  },

  // Лимонады
  {
    id: 586,
    category: "Лимонады",
    name: "Мохито",
    price: 890
  },
  {
    id: 587,
    category: "Лимонады",
    name: "Манго-маракуйя",
    price: 890
  },
  {
    id: 588,
    category: "Лимонады",
    name: "Ягодный",
    price: 890
  },
  {
    id: 589,
    category: "Лимонады",
    name: "Классический",
    price: 890
  },
  {
    id: 590,
    category: "Лимонады",
    name: "Тропический",
    price: 890
  },
  {
    id: 591,
    category: "Лимонады",
    name: "Киви-лайм",
    price: 890
  },
  {
    id: 592,
    category: "Лимонады",
    name: "Смородиновый",
    price: 890
  },
  {
    id: 593,
    category: "Лимонады",
    name: "Вишнёвый",
    price: 890
  },
  {
    id: 594,
    category: "Лимонады",
    name: "Мандариновый",
    price: 890
  },
  {
    id: 595,
    category: "Лимонады",
    name: "Малина-лайм",
    price: 890
  },

  // Смузи
  {
    id: 596,
    category: "Смузи",
    name: "Банановый",
    price: 2090
  },
  {
    id: 597,
    category: "Смузи",
    name: "Смородина-банан",
    price: 2090
  },
  {
    id: 598,
    category: "Смузи",
    name: "Киви-банан",
    price: 2090
  },
  {
    id: 599,
    category: "Смузи",
    name: "Тропический",
    price: 2090
  },

  // Напитки
  {
    id: 600,
    category: "Напитки",
    name: "Salam Cola (разливная) 0,5л",
    price: 790
  },
  {
    id: 601,
    category: "Напитки",
    name: "Salam Cola баночная 0,5л",
    price: 790
  },
  {
    id: 602,
    category: "Напитки",
    name: "Salam Cola 1л",
    price: 1290
  },
  {
    id: 603,
    category: "Напитки",
    name: "Ava разливной 0,5л",
    price: 690
  },
  {
    id: 604,
    category: "Напитки",
    name: "Da-Da сок 0,2л",
    price: 590
  },
  {
    id: 605,
    category: "Напитки",
    name: "Da-Da сок 1л",
    price: 1290
  },
  {
    id: 606,
    category: "Напитки",
    name: "Компот 0,5л",
    price: 490
  },
  {
    id: 607,
    category: "Напитки",
    name: "Компот 1л",
    price: 1290
  },
  {
    id: 608,
    category: "Напитки",
    name: "ASU 0,5л",
    price: 590
  },
  {
    id: 609,
    category: "Напитки",
    name: "ASU 1л",
    price: 790
  },
  {
    id: 610,
    category: "Напитки",
    name: "Айран",
    price: 400
  },
  {
    id: 611,
    category: "Напитки",
    name: "Кымыз",
    price: 2000
  },

  // Десерты
  {
    id: 612,
    category: "Десерты",
    name: "Чак-чак",
    price: 290
  },
  {
    id: 613,
    category: "Десерты",
    name: "Пахлава в асс. (2шт.)",
    price: 1200
  },
  {
    id: 614,
    category: "Десерты",
    name: "Пахлава фисташки (2шт.)",
    price: 1200
  },
  {
    id: 615,
    category: "Десерты",
    name: "Пахлава молочный (2шт.)",
    price: 1400
  },
  {
    id: 616,
    category: "Десерты",
    name: "Десерты в асс.",
    price: 1590
  }
],

// =====================================================
// ЗОНА ДОСТАВКИ
//
// Точки идут по кругу:
// 1 — Сейфуллина / Алматы-2
// 2 — Пушкина / Алматы-2
// 3 — Достык / Сатпаева
// 4 — Сейфуллина / Сатпаева
// =====================================================

const DEFAULT_ZONES = [
  {
    id: "zone1",
    name: "Зона 1",

    points: [
      {
        lat: 43.273766,
        lon: 76.930407
      },

      {
        lat: 43.276133,
        lon: 76.948280
      },

      {
        lat: 43.239663,
        lon: 76.957169
      },

      {
        lat: 43.237826,
        lon: 76.935170
      }
    ]
  }
];

// =====================================================
// DEFAULT DATA
// =====================================================

const DEFAULT = {
  nextOrderId: 1001,

  // true = сайт принимает заказы
  // false = сайт закрыт
  siteOpen: true,

  settings: DEFAULT_SETTINGS,

  pickupPoints: DEFAULT_PICKUP_POINTS,

  zones: DEFAULT_ZONES,

  menuByBranch: DEFAULT_MENU,

  orders: []
};

// =====================================================
// DATA
// =====================================================

if (!fs.existsSync(DATA)) {
  fs.writeFileSync(
    DATA,
    JSON.stringify(DEFAULT, null, 2),
    "utf8"
  );
}

// =====================================================
// READ DATA
// =====================================================

function read() {
  let data;

  try {
    data = JSON.parse(
      fs.readFileSync(DATA, "utf8")
    );
  } catch (error) {
    console.error(
      "Ошибка чтения data.json:",
      error
    );

    data = JSON.parse(
      JSON.stringify(DEFAULT)
    );
  }

  let changed = false;

  // ---------------------------------------------------
  // SITE OPEN
  // ---------------------------------------------------

  if (
    typeof data.siteOpen !== "boolean"
  ) {
    data.siteOpen = true;
    changed = true;
  }

  // ---------------------------------------------------
  // SETTINGS
  // ---------------------------------------------------

  if (
    !data.settings ||
    typeof data.settings !== "object"
  ) {
    data.settings =
      JSON.parse(
        JSON.stringify(DEFAULT_SETTINGS)
      );

    changed = true;
  } else {
    for (
      const key of Object.keys(DEFAULT_SETTINGS)
    ) {
      if (
        data.settings[key] === undefined
      ) {
        data.settings[key] =
          DEFAULT_SETTINGS[key];

        changed = true;
      }
    }
  }

  // ---------------------------------------------------
  // PICKUP POINTS
  // ---------------------------------------------------

  if (
    !Array.isArray(data.pickupPoints)
  ) {
    data.pickupPoints =
      JSON.parse(
        JSON.stringify(DEFAULT_PICKUP_POINTS)
      );

    changed = true;
  }

  // ---------------------------------------------------
  // ZONES
  // ---------------------------------------------------

  if (
    !Array.isArray(data.zones)
  ) {
    data.zones =
      JSON.parse(
        JSON.stringify(DEFAULT_ZONES)
      );

    changed = true;
  }

  // ---------------------------------------------------
  // MENU
  // ---------------------------------------------------

  if (
    !data.menuByBranch ||
    typeof data.menuByBranch !== "object"
  ) {
    data.menuByBranch =
      JSON.parse(
        JSON.stringify(DEFAULT_MENU)
      );

    changed = true;
  }

  for (
    const id of ["1", "2", "3", "4", "5"]
  ) {
    if (
      !Array.isArray(data.menuByBranch[id])
    ) {
      data.menuByBranch[id] = [];
      changed = true;
    }
  }

  // ---------------------------------------------------
  // ORDERS
  // ---------------------------------------------------

  if (
    !Array.isArray(data.orders)
  ) {
    data.orders = [];
    changed = true;
  }

  // ---------------------------------------------------
  // NEXT ORDER ID
  // ---------------------------------------------------

  if (
    typeof data.nextOrderId !== "number"
  ) {
    data.nextOrderId = 1001;
    changed = true;
  }

  // ---------------------------------------------------
  // FIX OLD ZONE FORMAT
  // ---------------------------------------------------

  if (
    data.zones.length === 0
  ) {
    data.zones =
      JSON.parse(
        JSON.stringify(DEFAULT_ZONES)
      );

    changed = true;
  }

  if (changed) {
    save(data);
  }

  return data;
}

// =====================================================
// SAVE DATA
// =====================================================

function save(data) {
  fs.writeFileSync(
    DATA,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

// =====================================================
// HELPERS
// =====================================================

function json(res, code, data) {
  res.writeHead(code, {
    "Content-Type":
      "application/json; charset=utf-8",

    "Access-Control-Allow-Origin":
      "*",

    "Access-Control-Allow-Headers":
      "Content-Type,Authorization",

    "Access-Control-Allow-Methods":
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  });

  res.end(
    JSON.stringify(data)
  );
}

function auth(req) {
  return (
    req.headers.authorization ===
    `Bearer ${ADMIN_TOKEN}`
  );
}

function getBody(req) {
  return new Promise(
    (resolve, reject) => {
      let body = "";

      req.on(
        "data",
        chunk => {
          body += chunk;

          if (
            body.length >
            2 * 1024 * 1024
          ) {
            reject(
              Error(
                "Запрос слишком большой."
              )
            );

            req.destroy();
          }
        }
      );

      req.on(
        "end",
        () => {
          try {
            resolve(
              body
                ? JSON.parse(body)
                : {}
            );
          } catch (error) {
            reject(
              Error(
                "Неверный JSON."
              )
            );
          }
        }
      );

      req.on(
        "error",
        reject
      );
    }
  );
}

// =====================================================
// MULTIPART FILE
// =====================================================

function getMultipartFile(req) {
  return new Promise(
    (resolve, reject) => {
      const contentType =
        req.headers["content-type"] || "";

      if (
        !contentType.includes(
          "multipart/form-data"
        )
      ) {
        return reject(
          Error(
            "Неверный формат загрузки."
          )
        );
      }

      const match =
        contentType.match(
          /boundary=(?:"([^"]+)"|([^;]+))/
        );

      if (!match) {
        return reject(
          Error(
            "Boundary не найден."
          )
        );
      }

      const boundary =
        "--" +
        (match[1] || match[2]);

      const chunks = [];
      let size = 0;

      req.on(
        "data",
        chunk => {
          size += chunk.length;

          if (
            size >
            8 * 1024 * 1024
          ) {
            req.destroy();

            return reject(
              Error(
                "Файл слишком большой. Максимум 8 МБ."
              )
            );
          }

          chunks.push(chunk);
        }
      );

      req.on(
        "end",
        () => {
          try {
            const buffer =
              Buffer.concat(chunks);

            const startMarker =
              Buffer.from(
                boundary + "\r\n"
              );

            const start =
              buffer.indexOf(
                startMarker
              );

            if (start === -1) {
              return reject(
                Error(
                  "Файл не найден."
                )
              );
            }

            const headerStart =
              start +
              startMarker.length;

            const headerEnd =
              buffer.indexOf(
                Buffer.from(
                  "\r\n\r\n"
                ),
                headerStart
              );

            if (headerEnd === -1) {
              return reject(
                Error(
                  "Ошибка файла."
                )
              );
            }

            const headers =
              buffer
                .slice(
                  headerStart,
                  headerEnd
                )
                .toString();

            const filenameMatch =
              headers.match(
                /filename="([^"]*)"/i
              );

            const typeMatch =
              headers.match(
                /Content-Type:\s*([^\r\n]+)/i
              );

            if (!filenameMatch) {
              return reject(
                Error(
                  "Название файла не найдено."
                )
              );
            }

            const originalName =
              filenameMatch[1];

            const mime =
              typeMatch
                ? typeMatch[1]
                    .trim()
                    .toLowerCase()
                : "";

            const allowedTypes = [
              "image/jpeg",
              "image/png",
              "image/webp"
            ];

            if (
              !allowedTypes.includes(mime)
            ) {
              return reject(
                Error(
                  "Можно загрузить только JPG, PNG или WEBP."
                )
              );
            }

            const extension =
              mime === "image/png"
                ? ".png"
                : mime === "image/webp"
                  ? ".webp"
                  : ".jpg";

            const fileName =
              crypto
                .randomBytes(16)
                .toString("hex") +
              extension;

            const fileStart =
              headerEnd + 4;

            const endMarker =
              Buffer.from(
                "\r\n" + boundary
              );

            const fileEnd =
              buffer.indexOf(
                endMarker,
                fileStart
              );

            if (fileEnd === -1) {
              return reject(
                Error(
                  "Конец файла не найден."
                )
              );
            }

            const fileBuffer =
              buffer.slice(
                fileStart,
                fileEnd
              );

            const fullPath =
              path.join(
                UPLOADS,
                fileName
              );

            fs.writeFileSync(
              fullPath,
              fileBuffer
            );

            resolve({
              originalName,
              mime,
              fileName,

              url:
                "/uploads/" +
                fileName
            });
          } catch (error) {
            reject(error);
          }
        }
      );

      req.on(
        "error",
        reject
      );
    }
  );
}

// =====================================================
// 2GIS API
// =====================================================

const DGIS_API_KEY =
  process.env["2GIS_API_KEY"] || "";

// -----------------------------------------------------
// ПОИСК АДРЕСА — 2GIS
// -----------------------------------------------------

async function geocode(query) {

  const cleanQuery =
    String(query || "").trim();

  if (!cleanQuery) {
    return null;
  }

  if (!DGIS_API_KEY) {
    throw Error(
      "Не указан 2GIS API ключ."
    );
  }

  const url =
    "https://catalog.api.2gis.com/3.0/items/geocode?" +
    new URLSearchParams({
      q:
        cleanQuery +
        ", Алматы, Казахстан",

      fields:
        "items.point,items.geometry.centroid,items.address",

      page_size: "1",

      key:
        DGIS_API_KEY
    });

  const response =
    await fetch(url);

  if (!response.ok) {
    throw Error(
      "Ошибка 2GIS API: " +
      response.status
    );
  }

  const data =
    await response.json();

  const item =
    data?.result?.items?.[0];

  if (!item) {
    return null;
  }

  const point =
    item.point ||
    item.geometry?.centroid;

  if (
    !point ||
    point.lat === undefined ||
    point.lon === undefined
  ) {
    return null;
  }

  return {
    lat: Number(point.lat),

    lon: Number(point.lon),

    address:
      item.address_name ||
      item.full_name ||
      cleanQuery,

    fullAddress:
      item.full_name ||
      item.address_name ||
      cleanQuery
  };
}
// =====================================================
// 2GIS GEOCODING
// =====================================================

const DGIS_API_KEY =
  process.env["2GIS_API_KEY"] || "";

async function geocode(query) {

  const cleanQuery =
    String(query || "").trim();

  if (!cleanQuery) {
    return null;
  }

  if (!DGIS_API_KEY) {
    throw Error(
      "2GIS API ключ не найден."
    );
  }

  const url =
    "https://catalog.api.2gis.com/3.0/items/geocode?" +
    new URLSearchParams({
      q:
        cleanQuery +
        ", Алматы, Казахстан",

      fields:
        "items.point,items.address",

      page_size: "1",

      key:
        DGIS_API_KEY
    });

  const response =
    await fetch(url);

  if (!response.ok) {
    throw Error(
      "Ошибка 2GIS API: " +
      response.status
    );
  }

  const data =
    await response.json();

  const item =
    data?.result?.items?.[0];

  if (!item) {
    return null;
  }

  const point =
    item.point;

  if (
    !point ||
    point.lat === undefined ||
    point.lon === undefined
  ) {
    return null;
  }

  return {
    lat: Number(point.lat),

    lon: Number(point.lon),

    address:
      item.address_name ||
      item.full_name ||
      cleanQuery
  };
}
// =====================================================
// POINT IN POLYGON
// =====================================================
//
// Проверяем, находится ли координата
// внутри нашей четырёхугольной зоны.
// =====================================================

function pointInPolygon(point, polygon) {

  if (
    !Array.isArray(polygon) ||
    polygon.length < 3
  ) {
    return false;
  }

  const x = Number(point.lon);
  const y = Number(point.lat);

  let inside = false;

  for (
    let i = 0, j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {

    const xi =
      Number(polygon[i].lon);

    const yi =
      Number(polygon[i].lat);

    const xj =
      Number(polygon[j].lon);

    const yj =
      Number(polygon[j].lat);

    const intersect =
      (
        (yi > y) !== (yj > y)
      ) &&
      (
        x <
        (
          (xj - xi) *
          (y - yi) /
          (yj - yi) +
          xi
        )
      );

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

// =====================================================
// ZONE
// =====================================================

function insideZone(point, zone) {

  // Новый формат зоны
  if (
    zone &&
    Array.isArray(zone.points)
  ) {

    return pointInPolygon(
      point,
      zone.points
    );
  }

  // Старый формат зоны
  // оставляем для совместимости
  if (
    zone &&
    zone.minLat !== undefined &&
    zone.maxLat !== undefined &&
    zone.minLon !== undefined &&
    zone.maxLon !== undefined
  ) {

    return (
      point.lat >= Number(zone.minLat) &&
      point.lat <= Number(zone.maxLat) &&
      point.lon >= Number(zone.minLon) &&
      point.lon <= Number(zone.maxLon)
    );
  }

  return false;
}

function findZone(point, zones) {

  for (
    const zone of zones
  ) {

    if (
      insideZone(
        point,
        zone
      )
    ) {
      return zone;
    }
  }

  return null;
}

// =====================================================
// DELIVERY
// =====================================================

function calculateDelivery(
  amount,
  inZone,
  settings
) {

  const minimum =
    Number(
      settings.freeDeliveryMinimum
    ) || 5000;

  const smallDelivery =
    Number(
      settings.smallOrderDelivery
    ) || 500;

  // ВНЕ ЗОНЫ
  if (!inZone) {

    return {
      deliveryPrice: null,
      total: null,
      externalCourier: true
    };
  }

  // БЕСПЛАТНО
  if (
    amount >= minimum
  ) {

    return {
      deliveryPrice: 0,
      total: amount,
      externalCourier: false
    };
  }

  // 500 ₸
  return {
    deliveryPrice:
      smallDelivery,

    total:
      amount + smallDelivery,

    externalCourier:
      false
  };
}

// =====================================================
// CHECK ZONE
// =====================================================

async function checkZone(
  address,
  amount = 0
) {

  const data =
    read();

  const destination =
    await geocode(address);

  if (!destination) {

    return {
      found: false,

      inZone: false,

      message:
        "Не удалось найти этот адрес. Уточните адрес."
    };
  }

  const zone =
    findZone(
      destination,
      data.zones
    );

  const inZone =
    Boolean(zone);

  const delivery =
    calculateDelivery(
      Number(amount) || 0,
      inZone,
      data.settings
    );

  // ВНЕ ЗОНЫ
  if (!zone) {

    return {
      found: true,

      inZone: false,

      zone: null,

      coordinates:
        destination,

      deliveryPrice: null,

      total: null,

      externalCourier: true,

      message:
        "Адрес вне зоны бесплатной доставки. После оформления заказа потребуется вызвать курьера через Яндекс Go или inDrive."
    };
  }

  // ВНУТРИ ЗОНЫ
  return {

    found: true,

    inZone: true,

    zone:
      zone.name,

    coordinates:
      destination,

    deliveryPrice:
      delivery.deliveryPrice,

    total:
      delivery.total,

    externalCourier:
      false,

    message:
      delivery.deliveryPrice === 0

        ? "Адрес входит в зону. Доставка бесплатная — 0 ₸."

        : `Адрес входит в зону. Доставка — ${delivery.deliveryPrice} ₸.`
  };
}

// =====================================================
// SERVER
// =====================================================

const server =
  http.createServer(
    async (req, res) => {

      const u =
        new URL(
          req.url,
          `http://${req.headers.host}`
        );

      const method =
        req.method;

      // =================================================
      // OPTIONS
      // =================================================

      if (
        method === "OPTIONS"
      ) {

        res.writeHead(
          204,
          {
            "Access-Control-Allow-Origin":
              "*",

            "Access-Control-Allow-Headers":
              "Content-Type,Authorization",

            "Access-Control-Allow-Methods":
              "GET,POST,PUT,PATCH,DELETE,OPTIONS"
          }
        );

        return res.end();
      }

      try {

        // =================================================
        // UPLOAD RECEIPT
        // =================================================

        if (
          u.pathname ===
            "/api/upload-receipt" &&
          method === "POST"
        ) {

          const file =
            await getMultipartFile(req);

          return json(
            res,
            201,
            {
              success: true,

              receipt:
                file.url
            }
          );
        }

        // =================================================
        // SITE STATUS GET
        // =================================================

        if (
          u.pathname ===
            "/api/site-status" &&
          method === "GET"
        ) {

          const data =
            read();

          return json(
            res,
            200,
            {
              siteOpen:
                data.siteOpen,

              settings:
                data.settings
            }
          );
        }

        // =================================================
        // SITE STATUS PATCH
        // =================================================

        if (
          u.pathname ===
            "/api/site-status" &&
          method === "PATCH"
        ) {

          if (!auth(req)) {

            return json(
              res,
              401,
              {
                error:
                  "Нет доступа"
              }
            );
          }

          const body =
            await getBody(req);

          const data =
            read();

          data.siteOpen =
            Boolean(
              body.siteOpen
            );

          save(data);

          return json(
            res,
            200,
            {
              success: true,

              siteOpen:
                data.siteOpen
            }
          );
        }

        // =================================================
        // CONFIG
        // =================================================

        if (
          u.pathname ===
            "/api/config" &&
          method === "GET"
        ) {

          const data =
            read();

          return json(
            res,
            200,
            {
              siteOpen:
                data.siteOpen,

              settings:
                data.settings,

              pickupPoints:
                data.pickupPoints,

              zones:
                data.zones,

              menuByBranch:
                data.menuByBranch
            }
          );
        }

        // =================================================
        // CHECK ZONE
        // =================================================

        if (
          u.pathname ===
            "/api/check-zone" &&
          method === "POST"
        ) {

          const body =
            await getBody(req);

          const data =
            read();

          if (
            !data.siteOpen
          ) {

            return json(
              res,
              403,
              {
                error:
                  "Сейчас заказы не принимаются. Заказы принимаются с 11:00 до 23:00."
              }
            );
          }

          if (
            !body.address
          ) {

            return json(
              res,
              400,
              {
                found: false,

                message:
                  "Введите адрес доставки."
              }
            );
          }

          try {

            return json(
              res,
              200,
              await checkZone(
                String(
                  body.address
                ),
                Number(
                  body.amount || 0
                )
              )
            );

          } catch (error) {

            console.error(
              "Ошибка проверки адреса:",
              error
            );

            return json(
              res,
              500,
              {
                found: false,

                error:
                  "Не удалось проверить адрес. Попробуйте ещё раз."
              }
            );
          }
        }

        // =================================================
        // CREATE ORDER
        // =================================================

        if (
          u.pathname ===
            "/api/orders" &&
          method === "POST"
        ) {

          const body =
            await getBody(req);

          const data =
            read();

          if (
            !data.siteOpen
          ) {

            return json(
              res,
              403,
              {
                error:
                  "Сейчас заказы не принимаются. Заказы принимаются с 11:00 до 23:00."
              }
            );
          }

          if (
            !body.name ||
            !body.phone ||
            !body.pickup ||
            !body.address
          ) {

            return json(
              res,
              400,
              {
                error:
                  "Заполните обязательные поля."
              }
            );
          }

          const pickupExists =
            data.pickupPoints.some(
              point =>
                point.address ===
                body.pickup
            );

          if (
            !pickupExists
          ) {

            return json(
              res,
              400,
              {
                error:
                  "Недопустимая точка отправления."
              }
            );
          }

          const amount =
            Number(
              body.amount || 0
            );

          if (
            amount <= 0
          ) {

            return json(
              res,
              400,
              {
                error:
                  "Введите сумму заказа."
              }
            );
          }

          let zone;

          try {

            zone =
              await checkZone(
                String(
                  body.address
                ),
                amount
              );

          } catch (error) {

            console.error(
              "Ошибка проверки адреса:",
              error
            );

            return json(
              res,
              500,
              {
                error:
                  "Не удалось проверить адрес."
              }
            );
          }

          if (
            !zone.found
          ) {

            return json(
              res,
              400,
              {
                error:
                  zone.message
              }
            );
          }

          const order = {

            id:
              data.nextOrderId++,

            createdAt:
              new Date().toISOString(),

            name:
              String(
                body.name
              ),

            phone:
              String(
                body.phone
              ),

            pickup:
              String(
                body.pickup
              ),

            address:
              String(
                body.address
              ),

            amount:
              amount,

            item:
              String(
                body.item || ""
              ),

            comment:
              String(
                body.comment || ""
              ),

            receipt:
              String(
                body.receipt || ""
              ),

            paymentStatus:
              body.receipt
                ? "Оплата ожидает проверки"
                : "Не оплачено",

            inZone:
              zone.inZone,

            zone:
              zone.zone || null,

            deliveryPrice:
              zone.deliveryPrice,

            total:
              zone.total,

            externalCourier:
              zone.externalCourier,

            coordinates:
              zone.coordinates,

            status:
              "Новый"
          };

          data.orders.unshift(
            order
          );

          save(data);

          return json(
            res,
            201,
            order
          );
        }

        // =================================================
        // ADMIN ORDERS
        // =================================================

        if (
          u.pathname ===
            "/api/orders" &&
          method === "GET"
        ) {

          if (!auth(req)) {

            return json(
              res,
              401,
              {
                error:
                  "Нет доступа"
              }
            );
          }

          return json(
            res,
            200,
            read().orders
          );
        }

        // =================================================
        // ADMIN ORDER PATCH
        // =================================================

        if (
          u.pathname.startsWith(
            "/api/orders/"
          ) &&
          method === "PATCH"
        ) {

          if (!auth(req)) {

            return json(
              res,
              401,
              {
                error:
                  "Нет доступа"
              }
            );
          }

          const id =
            Number(
              u.pathname
                .split("/")
                .pop()
            );

          const body =
            await getBody(req);

          const data =
            read();

          const order =
            data.orders.find(
              item =>
                item.id === id
            );

          if (!order) {

            return json(
              res,
              404,
              {
                error:
                  "Заказ не найден."
              }
            );
          }

          if (
            body.status
          ) {

            order.status =
              String(
                body.status
              );
          }

          if (
            "deliveryPrice" in body
          ) {

            order.deliveryPrice =
              body.deliveryPrice;

            if (
              order.inZone
            ) {

              order.total =
                Number(
                  order.amount || 0
                ) +
                Number(
                  body.deliveryPrice || 0
                );
            }
          }

          if (
            "paymentStatus" in body
          ) {

            order.paymentStatus =
              String(
                body.paymentStatus
              );
          }

          save(data);

          return json(
            res,
            200,
            order
          );
        }

        // =================================================
        // ADMIN SETTINGS GET
        // =================================================

        if (
          u.pathname ===
            "/api/settings" &&
          method === "GET"
        ) {

          if (!auth(req)) {

            return json(
              res,
              401,
              {
                error:
                  "Нет доступа"
              }
            );
          }

          const data =
            read();

          return json(
            res,
            200,
            {
              settings:
                data.settings,

              siteOpen:
                data.siteOpen
            }
          );
        }

        // =================================================
        // ADMIN SETTINGS PUT
        // =================================================

        if (
          u.pathname ===
            "/api/settings" &&
          method === "PUT"
        ) {

          if (!auth(req)) {

            return json(
              res,
              401,
              {
                error:
                  "Нет доступа"
              }
            );
          }

          const body =
            await getBody(req);

          const data =
            read();

          data.settings = {

            freeDeliveryMinimum:
              Number(
                body.freeDeliveryMinimum
              ) || 5000,

            smallOrderDelivery:
              Number(
                body.smallOrderDelivery
              ) || 500,

            deliveryStart:
              String(
                body.deliveryStart ||
                "11:00"
              ),

            deliveryEnd:
              String(
                body.deliveryEnd ||
                "23:00"
              ),

            whatsapp:
              String(
                body.whatsapp ||
                ""
              )
          };

          save(data);

          return json(
            res,
            200,
            {
              success: true,

              settings:
                data.settings
            }
          );
        }

        // =================================================
        // ADMIN BRANCHES GET
        // =================================================

        if (
          u.pathname ===
            "/api/branches" &&
          method === "GET"
        ) {

          if (!auth(req)) {

            return json(
              res,
              401,
              {
                error:
                  "Нет доступа"
              }
            );
          }

          return json(
            res,
            200,
            {
              pickupPoints:
                read().pickupPoints
            }
          );
        }

        // =================================================
        // ADMIN BRANCHES PUT
        // =================================================

        if (
          u.pathname ===
            "/api/branches" &&
          method === "PUT"
        ) {

          if (!auth(req)) {

            return json(
              res,
              401,
              {
                error:
                  "Нет доступа"
              }
            );
          }

          const body =
            await getBody(req);

          if (
            !Array.isArray(
              body.pickupPoints
            )
          ) {

            return json(
              res,
              400,
              {
                error:
                  "Неверный формат филиалов."
              }
            );
          }

          const data =
            read();

          data.pickupPoints =
            body.pickupPoints.map(
              (branch, index) => ({

                id:
                  branch.id ||
                  Date.now() +
                  index,

                name:
                  String(
                    branch.name || ""
                  ),

                address:
                  String(
                    branch.address || ""
                  ),

                lat:
                  Number(
                    branch.lat || 0
                  ),

                lon:
                  Number(
                    branch.lon || 0
                  ),

                workTime:
                  String(
                    branch.workTime || ""
                  ),

                deliveryTime:
                  String(
                    branch.deliveryTime ||
                    "11:00-23:00"
                  ),

                kaspi:
                  String(
                    branch.kaspi || ""
                  ),

                kaspiName:
                  String(
                    branch.kaspiName || ""
                  ),

                whatsapp:
                  String(
                    branch.whatsapp || ""
                  )
              })
            );

          save(data);

          return json(
            res,
            200,
            {
              success: true,

              pickupPoints:
                data.pickupPoints
            }
          );
        }

        // =================================================
        // ADMIN MENU GET
        // =================================================

        if (
          u.pathname ===
            "/api/menu" &&
          method === "GET"
        ) {

          if (!auth(req)) {

            return json(
              res,
              401,
              {
                error:
                  "Нет доступа"
              }
            );
          }

          return json(
            res,
            200,
            {
              menuByBranch:
                read().menuByBranch
            }
          );
        }

        // =================================================
        // ADMIN MENU PUT
        // =================================================

        if (
          u.pathname ===
            "/api/menu" &&
          method === "PUT"
        ) {

          if (!auth(req)) {

            return json(
              res,
              401,
              {
                error:
                  "Нет доступа"
              }
            );
          }

          const body =
            await getBody(req);

          const branchId =
            String(
              body.branchId
            );

          if (
            ![
              "1",
              "2",
              "3",
              "4",
              "5"
            ].includes(
              branchId
            )
          ) {

            return json(
              res,
              400,
              {
                error:
                  "Недопустимый филиал."
              }
            );
          }

          if (
            !Array.isArray(
              body.menu
            )
          ) {

            return json(
              res,
              400,
              {
                error:
                  "Неверный формат меню."
              }
            );
          }

          const data =
            read();

          data.menuByBranch[
            branchId
          ] =
            body.menu.map(
              (item, index) => ({

                id:
                  item.id ||
                  Date.now() +
                  index,

                category:
                  String(
                    item.category || ""
                  ),

                name:
                  String(
                    item.name || ""
                  ),

                price:
                  Number(
                    item.price || 0
                  )
              })
            );

          save(data);

          return json(
            res,
            200,
            {
              success: true,

              branchId,

              menu:
                data.menuByBranch[
                  branchId
                ]
            }
          );
        }

        // =================================================
        // ADMIN ZONES GET
        // =================================================

        if (
          u.pathname ===
            "/api/zones" &&
          method === "GET"
        ) {

          if (!auth(req)) {

            return json(
              res,
              401,
              {
                error:
                  "Нет доступа"
              }
            );
          }

          return json(
            res,
            200,
            {
              zones:
                read().zones
            }
          );
        }

        // =================================================
        // ADMIN ZONES PUT
        // =================================================

        if (
          u.pathname ===
            "/api/zones" &&
          method === "PUT"
        ) {

          if (!auth(req)) {

            return json(
              res,
              401,
              {
                error:
                  "Нет доступа"
              }
            );
          }

          const body =
            await getBody(req);

          if (
            !Array.isArray(
              body.zones
            )
          ) {

            return json(
              res,
              400,
              {
                error:
                  "Неверный формат зон."
              }
            );
          }

          const data =
            read();

          data.zones =
            body.zones.map(
              (zone, index) => {

                // Новый формат
                if (
                  Array.isArray(
                    zone.points
                  )
                ) {

                  return {
                    id:
                      String(
                        zone.id ||
                        `zone${index + 1}`
                      ),

                    name:
                      String(
                        zone.name ||
                        `Зона ${index + 1}`
                      ),

                    points:
                      zone.points.map(
                        point => ({
                          lat:
                            Number(
                              point.lat
                            ),

                          lon:
                            Number(
                              point.lon
                            )
                        })
                      )
                  };
                }

                // Старый формат
                return {
                  id:
                    String(
                      zone.id ||
                      `zone${index + 1}`
                    ),

                  name:
                    String(
                      zone.name ||
                      `Зона ${index + 1}`
                    ),

                  minLat:
                    Number(
                      zone.minLat
                    ),

                  maxLat:
                    Number(
                      zone.maxLat
                    ),

                  minLon:
                    Number(
                      zone.minLon
                    ),

                  maxLon:
                    Number(
                      zone.maxLon
                    )
                };
              }
            );

          save(data);

          return json(
            res,
            200,
            {
              success: true,

              zones:
                data.zones
            }
          );
        }

        // =================================================
        // STATIC FILES
        // =================================================

        let file =
          u.pathname === "/"
            ? "/index.html"
            : u.pathname;

        if (
          file === "/admin"
        ) {
          file =
            "/admin.html";
        }

        const full =
          path.normalize(
            path.join(
              ROOT,
              file
            )
          );

        if (
          !full.startsWith(ROOT)
        ) {

          return json(
            res,
            403,
            {
              error:
                "Forbidden"
            }
          );
        }

        fs.readFile(
          full,
          (error, content) => {

            if (error) {

              res.writeHead(
                404
              );

              return res.end(
                "Not found"
              );
            }

            const ext =
              path.extname(
                full
              ).toLowerCase();

            const types = {

              ".html":
                "text/html; charset=utf-8",

              ".js":
                "text/javascript; charset=utf-8",

              ".css":
                "text/css; charset=utf-8",

              ".jpg":
                "image/jpeg",

              ".jpeg":
                "image/jpeg",

              ".png":
                "image/png",

              ".webp":
                "image/webp",

              ".svg":
                "image/svg+xml",

              ".json":
                "application/json; charset=utf-8"
            };

            res.writeHead(
              200,
              {
                "Content-Type":
                  types[ext] ||
                  "text/plain; charset=utf-8"
              }
            );

            res.end(
              content
            );
          }
        );

      } catch (error) {

        console.error(
          error
        );

        if (!res.headersSent) {

          return json(
            res,
            500,
            {
              error:
                error.message ||
                "Ошибка сервера."
            }
          );
        }
      }
    }
  );

// =====================================================
// START
// =====================================================

server.listen(
  PORT,
  () => {
    console.log(
      `Tomchi: http://localhost:${PORT}`
    );
  }
);