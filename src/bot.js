require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: false })

const GROUP_CHAT_ID_PENDING = "-1002804493258";

const pendingMessageMap = new Map();

const sendOrderToBot = (orderData) => {
  console.log("Sending order data:", orderData);
  const products = [];

  const formattedAmount = new Intl.NumberFormat("ru-RU", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(orderData?.totalPrice || 0);

  const statusSticker = orderData?.isPaid ? "✅" : "🟡";

  orderData?.products?.forEach((product) => {
    products.push(`
      🔸 <b>${product?.title}</b>
      🔸 <b>Цена:</b> ${product?.price} сум
      🔸 <b>Размер:</b> ${product?.size}
      🔸 <b>Вес:</b> ${product?.weight}
      🔸 <b>Материал:</b> ${product?.material}
    `);
  });

  const message = `
    🧾 <b>Заказ ${orderData?._id || ""}:</b>
    🔸 <b>Клиент:</b> ${orderData?.firstName} ${orderData?.lastName}
    🔸 <b>Телефон:</b> ${orderData?.phoneNumber}
    🔸 <b>Адрес:</b> ${orderData?.address}
    ${products.join("\n")}
    ${statusSticker} <b>Статус:</b> ${orderData?.isPaid ? "Оплачено" : "Не оплачено"}

    🇺🇿 <b>Сумма:</b> ${formattedAmount} сум
  `;

  bot
    .sendMessage(GROUP_CHAT_ID_PENDING, message, { parse_mode: "HTML" })
    .then((sentMessage) => {
      console.log("Message sent successfully");

      if (!orderData?.isPaid) {
        console.log(
          `Storing message ID ${sentMessage.message_id} for ${orderData?._id}`
        );
        pendingMessageMap.set(orderData?._id, sentMessage.message_id);
      }
    })
    .catch((error) => {
      console.error("Error sending message to bot:", error);
    });
};

const updateOrderStatus = (orderData) => {
  console.log("Updating order status:", orderData);
  if (orderData?.isPaid) {
    sendOrderToBot(orderData);

    const paidNotification = `
      ✅ <b>Заказ ${orderData?._id || ""}</b> Оплачен
    `;

    bot
      .sendMessage(GROUP_CHAT_ID_PENDING, paidNotification, {
        parse_mode: "HTML",
      })
      .then(() => console.log("Paid notification sent to PENDING group"))
      .catch((error) =>
        console.error(
          "Error sending paid notification to PENDING group:",
          error
        )
      );
  } else {
    sendOrderToBot(orderData);
  }
};

module.exports = { bot, sendOrderToBot, updateOrderStatus };
