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
  "1": [],
  "2": [],
  "3": [],
  "4": [],
  "5": []
};

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