# Парсинг

1. Выполняется GET запрос по `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx&id=${SHEET_ID}`.
2. В результате запроса отдаётся xlsx файл. Данную ссылку можно получить, используя экспортирование google-таблиц и через вкладку Network Dev Tools
3. Используется не Google Sheet API по причине строгих лимитов

# Обработка

1. Для начала необходимо убрать объединённые ячейки, заменив их ячейками, входивших в объединение, в которых продублировано значение объединённой ячейки
Данную операцию выполняет код:
```js
let workSheet = file.Sheets[latestName]
    const mergedCells = workSheet['!merges'];
    if (typeof mergedCells !== "undefined") {
      for (let mergedCell of mergedCells) {
        const {s, e} = mergedCell;
        if (typeof workSheet[utils.encode_cell(s)] !== "undefined") {

          const mergedValue = workSheet[utils.encode_cell(s)].v;
          for (let row = s.r; row <= e.r; row++) {
            for (let col = s.c; col <= e.c; col++) {
              const cellAddress = utils.encode_cell({r: row, c: col});
              if (typeof workSheet[cellAddress] === "undefined") {
                workSheet[cellAddress] = {}
              }
              workSheet[cellAddress].v = mergedValue;
            }
          }
        }
      }
      workSheet['!merges'] = []
    }
```
2. Удаляем строки, которые не являются расписанием.
```js
for(let i = 0; i < removeRows; i++) {
      workSheet = deleteRow(workSheet, 0)
    }
```
3. Достаём названия групп и специальностей
4. Записываем пары

# Конвертирование в JSON для удобства дальнейшей работы

1. В [файле](./utils/xlsxToJson.js) описано использование стороннего API, которое выполняет данную задачу.
2. Запрос был получен путём ревенс-инжеринга фронтенда

На выходе получаем вот такую структуру для каждой недели (страницы excel)
```js
{
  week: {
    number: Number,
    start: Date,
    end: Date
  },
  course: Number,
  classes: [{
    day: String,
    classNumber: Number,
    classTime: String,
    speciality: String,
    group: String,
    name: String
  }]
}
```
