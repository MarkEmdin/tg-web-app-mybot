const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const axios = require("axios");

const token = '5779845670:AAG4ln-vlOTp5ACrdepZtkZsKKuQfm4K6UA';
//const webAppUrl = 'https://classy-praline-3a8d92.netlify.app';
const webAppUrl = 'http://77.244.221.156:3000';
const PORT = 8000;

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json())
app.use(cors());


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {

        await bot.sendMessage(chatId, 'Для просмотра всех вещей', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Посмотреть всё', web_app: {url: webAppUrl}}]
                ]
            }
        })

        await bot.sendMessage(chatId, 'отдать свою вещь', {
            reply_markup: {
                keyboard: [
                    [{text: 'Отдать вещь', web_app: {url: webAppUrl + '/form'}}]
                ]
            }
        })
    }
    // bot.onText(/\/ads (.+)/, (msg, match) => {
    //      bot.sendMessage(chatId, 'Вы хотите отдать: ' + match[1]);
    // })

        // добавление пользователя и его вещи
    if(msg?.web_app_data?.data) {
        // console.log(msg);
        try {
            const userData = {
                tg_id: msg.from.id,
                name: msg.from.first_name,
                city: "TLV"
            }
            /// обратить внимание, что когда пользователь делает что-то первый раз выходит не очень(
            //axios.post(` http://localhost:8080/api/users/`, userData )
            axios.post(` http://77.244.221.156:8080/api/users/`, userData )
                .then(res => {

                }).catch(error => console.log(error));


            const data = JSON.parse(msg?.web_app_data?.data)

            const adsData = {
                title: data?.title,
                picture_url: "https://klike.net/uploads/posts/2020-04/1587719791_1.jpg",
                location: data?.city,
                telephone: data?.telephone,
                description: data?.description
            }
            // поправить id того, кто отправляет посылку!!!
            const apiUrlAds = `http://77.244.221.156:8080/api/ads?id=${msg.from.id}`
            axios.post(apiUrlAds,adsData)
                .then(res => {
                    // console.log(res.data);
                }).catch(error => console.log(error));
             console.log(msg);


            await bot.sendMessage(chatId, 'Вы хотите отдать: ' + data?.title);
            // await bot.sendMessage(chatId, 'Город: ' + data?.city);
            // await bot.sendMessage(chatId, 'Описание: ' + data?.description);
            // await bot.sendMessage(chatId, 'способ связи: ' + data?.telephone);

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Спасибо за вашу помощь!');
            }, 3000)
        } catch (e) {
            console.log(e, msg);
        }
    }
});
app.post('/web-data', async (req, res) => {
    const {queryId, product} = req.body;
    console.log(queryId, product);
    try {
        // await bot.answerWebAppQuery(queryId, {
        //     type: 'article',
        //     id: queryId,
        //     title: 'Вы хотите забрать',
        //     input_message_content: {
        //         message_text: ` Для получения товара  ${product.title},напишите ${product.user_id}`
        //     }
        // })
        // await bot.sendMessage(chatId, 'Вы хотите отдать: ' + data?.title);
        return res.status(200).json("ok");
    } catch (e) {
        return res.status(500).json(e)
    }
})

app.listen(PORT, () => console.log('server started on PORT ' + PORT))