# Подготовка
1. Установите [MongoDB] (https://www.mongodb.com/docs/manual/installation/)
2. Установите (лучше LTC) [node.js](https://nodejs.org/en)
3. Склонируйте репозиторий и перейдите по пути
   `cd /path/to/scheduler`
4. Выполните
   `npm i`
5. Создайте Telegram Bot с использованием [BotFather](https://t.me/BotFather)
6. Установите redis
# Configuration

1. Откройте файл по пути `./src/config/config.js`
2. Заполните массив. Скопируйте ссылку на страницу расписания, достаньте строку между `https://docs.google.com/spreadsheets/d/` и `/edit`
3. Значение `needSpliceToIndex` установите равной строке после которой строится таблица расписания
4. Повторите пункты 2 - 4 для таблиц всех курсов. !!!БОТ ПОДДЕРЖИВАЕТ ТОЛЬКО ТАБЛИЦЫ СО СТРУКТУРОЙ СХОЖЕЙ С https://docs.google.com/spreadsheets/d/10uiLYlRt8ml6uj43x1VyncJo8sgnD8dpABwbshKXSmM/edit#gid=108141678
5. Создайте `.env` файл в корне проекта

```dotenv
#MongoDB connection url
MONGO_DB="mongodb://127.0.0.1:27017/scheduleBot"
#bot token from botFather
BOT_TOKEN=""
```
# Запуск

1. `cd /path/to/scheduler`
2. `node src/index.js`


# Документация по каждому пункту

1. [Парсинг и обработка](./src/modules/googlesheet-parser/README.md) таблицы расписания
2. [Рассылка по пользователям](./src/modules/rsmq/README.md)
3. [Telegram Bot](./src/modules/telegram/README.md)

# Общая информация

1. Данная система парсит Google - таблицы с расписанием и отслеживает в них изменения
2. Если на месте пары (ячейка) пусто - пара удалена. Если на месте пустоты появилось что-то - пара добавлена
3. После получение данной информации выполняет рассылка по всем пользователям с указанием, на какое время были изменения. Пример сообщения:

Обнаружено добавление новой пары!
```json
{
    "day": "понедельник",
    "classNumber": 3,
    "classTime": "12:00 - 13:20",
    "speciality": "ПРИКЛАДНАЯ ИНФОРМАТИКА",
    "group": "5 кафедра",
    "name": "Цифровая обработка сигналов, лаб.,\nподгр.2\nдоц. Микулович А.В.,\nауд. 49"
}
```

Бот был написан как проект по предмету `Мультиагентные интеллектуальные системы`, преподаватель: Чуйко В.А.
