# EnglishCheck - Платформа для тестирования английского языка

Современная веб-платформа для проверки уровня английского языка с интерактивными тестами, детальной статистикой и красивым интерфейсом.

## Возможности

- **Интерактивные тесты** - 4 типа вопросов (выбор, ввод, верно/неверно, сопоставление)
- **Уровни сложности** - A2, B1, B2 с автоматическим определением уровня
- **Таймер** - Опциональный обратный отсчет с визуальными предупреждениями
- **Детальные результаты** - Круговая диаграмма, разбор каждого вопроса с объяснениями
- **Анимации** - Плавные переходы, конфетти при отличном результате
- **Поделиться результатом** - Генерация картинки для соцсетей
- **Админ-панель** - Просмотр статистики, фильтрация, экспорт в CSV
- **Офлайн-режим** - Работает без интернета после первой загрузки
- **Адаптивный дизайн** - Отлично работает на всех устройствах

## Структура проекта

```
Quiz/
├── index.html              # Главная страница
├── pages/
│   ├── quiz.html          # Страница прохождения теста
│   ├── results.html       # Страница результатов
│   └── admin.html         # Админ-панель
├── css/
│   ├── main.css           # Общие стили
│   ├── home.css           # Стили главной страницы
│   ├── quiz.css           # Стили теста
│   ├── results.css        # Стили результатов
│   └── admin.css          # Стили админки
├── js/
│   ├── home.js            # Логика главной страницы
│   ├── quiz.js            # Логика теста
│   ├── results.js         # Логика результатов
│   ├── admin.js           # Логика админки
│   ├── modules/
│   │   └── dataLoader.js  # Загрузка и обработка вопросов
│   └── utils/
│       ├── storage.js     # Работа с localStorage
│       ├── helpers.js     # Вспомогательные функции
│       └── confetti.js    # Анимация конфетти
├── data/
│   └── questions.json     # База вопросов
├── sw.js                  # Service Worker для офлайн-режима
└── README.md
```

## Быстрый старт

### 1. Локальный запуск

Просто откройте [index.html](index.html) в браузере или используйте локальный сервер:

```bash
# С помощью Python
python -m http.server 8000

# С помощью Node.js
npx serve

# С помощью PHP
php -S localhost:8000
```

Затем откройте http://localhost:8000

### 2. Деплой на GitHub Pages

```bash
# Инициализируйте git репозиторий
git init
git add .
git commit -m "Initial commit"

# Создайте репозиторий на GitHub и загрузите код
git remote add origin https://github.com/ваш-username/englishcheck.git
git branch -M main
git push -u origin main

# Включите GitHub Pages в настройках репозитория
# Settings → Pages → Source: main branch
```

### 3. Деплой на Netlify

1. Перетащите папку проекта на https://app.netlify.com/drop
2. Или подключите GitHub репозиторий для автоматического деплоя

## Работа с вопросами

### Формат вопроса

Все вопросы хранятся в [data/questions.json](data/questions.json). Поддерживаются 4 типа:

#### 1. Одиночный выбор (single)

```json
{
  "id": 1,
  "level": "B1",
  "type": "single",
  "question": "Choose the correct form: She ___ to school every day.",
  "options": ["go", "goes", "going", "gone"],
  "correct": 1,
  "explanation": "'Goes' используется с he/she/it в Present Simple"
}
```

#### 2. Ввод текста (input)

```json
{
  "id": 5,
  "level": "A2",
  "type": "input",
  "question": "Complete: I ___ (be) happy.",
  "correctAnswer": "am",
  "explanation": "'Am' используется с 'I'"
}
```

#### 3. Верно/Неверно (boolean)

```json
{
  "id": 4,
  "level": "A2",
  "type": "boolean",
  "question": "The sentence 'He don't like coffee' is correct.",
  "options": ["true", "false"],
  "correct": 1,
  "explanation": "Правильно: 'He doesn't like coffee'"
}
```

#### 4. Сопоставление (matching)

```json
{
  "id": 20,
  "level": "B2",
  "type": "matching",
  "question": "Match the words with their definitions.",
  "pairs": [
    {"left": "Happy", "right": "Счастливый"},
    {"left": "Sad", "right": "Грустный"}
  ],
  "explanation": "Базовые эмоции"
}
```

### Добавление новых вопросов

1. Откройте [data/questions.json](data/questions.json)
2. Добавьте новый объект в массив
3. Убедитесь, что `id` уникален
4. Укажите `level`: A1, A2, B1, B2, C1 или C2
5. Выберите `type`: single, input, boolean или matching
6. Сохраните файл

### Добавление нового теста

Тесты автоматически группируются по уровням. Чтобы добавить новый уровень:

1. Добавьте вопросы с нужным `level` в [data/questions.json](data/questions.json)
2. Тест появится автоматически на главной странице

## Админ-панель

### Вход

- **Скрытый доступ**: Кликните 5 раз по логотипу "EnglishCheck" на главной странице
- Прямой URL: `/pages/admin.html` (не отображается в интерфейсе)
- Пароль по умолчанию: `admin123`

### Изменение пароля

Откройте [js/admin.js](js/admin.js) и измените константу:

```javascript
const ADMIN_PASSWORD = 'ваш_новый_пароль';
```

### Функции админки

- Просмотр всех результатов тестов
- Фильтрация по тесту и дате
- Статистика: общее количество, средний балл, тесты за сегодня
- Экспорт данных в CSV

## Настройка

### Изменение времени таймера

В [js/quiz.js](js/quiz.js#L24):

```javascript
timeRemaining = 15 * 60; // 15 минут в секундах
```

### Изменение количества вопросов

В [index.html](index.html) найдите радио-кнопки:

```html
<label><input type="radio" name="questions-count" value="10"> 10 вопросов</label>
<label><input type="radio" name="questions-count" value="20" checked> 20 вопросов</label>
<label><input type="radio" name="questions-count" value="30"> 30 вопросов</label>
```

### Изменение цветовой схемы

В [css/main.css](css/main.css) измените CSS-переменные:

```css
:root {
    --primary-color: #2563eb;      /* Основной цвет */
    --secondary-color: #10b981;    /* Вторичный цвет */
    --success-color: #22c55e;      /* Цвет успеха */
    --danger-color: #ef4444;       /* Цвет ошибки */
}
```

## Хранение данных

Все данные хранятся в `localStorage` браузера:

- `currentTest` - Настройки текущего теста
- `lastResult` - Последний результат
- `testResults` - История всех результатов
- `studentName` - Имя ученика

### Очистка данных

Откройте консоль браузера (F12) и выполните:

```javascript
localStorage.clear();
```

## Браузерная поддержка

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Технологии

- Vanilla JavaScript (ES6+)
- CSS3 с CSS Variables
- HTML5 Canvas для графиков
- Service Worker для офлайн-режима
- LocalStorage для хранения данных

## Возможные улучшения

- [ ] Режим «Марафон» - 50 вопросов подряд
- [ ] Таблица лидеров
- [ ] Звуковые эффекты
- [ ] Тёмная тема
- [ ] Экспорт результатов в PDF
- [ ] Интеграция с Google Sheets
- [ ] Мультиязычность интерфейса
- [ ] Система достижений

## Лицензия

MIT License - используйте свободно для личных и коммерческих проектов.

## Автор

Создано для Сергея - преподавателя английского языка.

## Поддержка

При возникновении проблем:
1. Проверьте консоль браузера (F12)
2. Убедитесь, что [data/questions.json](data/questions.json) корректен
3. Очистите кэш браузера и localStorage
4. Проверьте, что все файлы загружены правильно

---

**Приятного использования! 🎓**
