# senler-integration-bot


Библиотека для связи вашей интеграции с Senler


```sh
npm i senler-integration-bot
```

Документация [Интеграций Senler](https://help.senler.ru/senler/dev/prilozheniya).


## Чтение настроек
При открытии модального окна и загрузки интеграции через iframe. Событие onload. Senler отправляет запрос `setData` c настройками из шага.

Интеграция обрабатывает запрос следующим образом:
```js
import IntegrationConnect from "senler-integration-bot/src/index.js";

integrationConnect.route('setData', (message) => {
        let settings = message.request.payload;
        if ('private' in settings) {
            setPrivateSettings(JSON.parse(settings.private));
        }
        if ('public' in settings) {
            setPublicSettings(JSON.parse(settings.public))
        }
        message.response.success = true;
        message.send();//Отправим ответ timeout 50 сек
});
```

## Сохранение настроек
При нажатии кнопки "Сохранить" в модальном окне настроек интеграции, Senler отправляет запрос `getData`

Интеграция обрабатывает запрос следующим образом:
```js
 integrationConnect.route('getData', (message) => {
    message['response'] = {
        payload: {},
        success: true
    };

    message.response.payload['public'] =  JSON.parse(localStorage.getItem('public_settings'));
    message.response.payload['private'] = JSON.parse(localStorage.getItem('private_settings'));

    message.response.payload['command'] = 'Отправить сообщение';
    message.response.payload['description'] = 'ChatId 1000000';

    message.send();//Отправим ответ timeout 50 сек
});
```
## Cтруктра данных  Window.postMessage() сообщения
```json
{
  "payload": {
    "public": "user name %first_nmae% user fam %last_name% \nvkid= %vk_id%",
    "private": [
      {
        "id": "342173_268775_1668242955756",
        "chat_id": "1000000",
        "token": "mytoken123",
        "user_id": "342173_268775_1668242955756"
      }
    ],
    "command": "Отправить сообщение",
    "description": "ChatId 1000000"
  }
}
```
- `public` - публичные настройки
- `private` - приватные настройки, очищаются при копировании бота
- `command` - название команды в шаге бота
- `description` - описание команды в шаге бота

Для браузера [`dist/bundle.js`](https://unpkg.com/senler-integration-bot/dist/bundle.js)

```html
<script src="https://unpkg.com/senler-integration-bot/dist/bundle.js"></script>
```