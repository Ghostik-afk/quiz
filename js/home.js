import { loadQuestions, getTestsByLevel } from './modules/dataLoader.js';
import { saveToStorage, getFromStorage } from './utils/storage.js';

let allQuestions = [];
let selectedTest = null;

async function init() {
    try {
        allQuestions = await loadQuestions();
        renderTests();
        setupEventListeners();
    } catch (error) {
        console.error('Failed to load questions:', error);
        showError('Не удалось загрузить тесты. Попробуйте обновить страницу.');
    }
}

function renderTests() {
    const container = document.getElementById('tests-container');
    const testsByLevel = getTestsByLevel(allQuestions);

    container.innerHTML = '';

    Object.entries(testsByLevel).forEach(([level, questions]) => {
        const attempts = getTestAttempts(level);
        const card = createTestCard(level, questions.length, attempts);
        container.appendChild(card);
    });
}

function createTestCard(level, questionCount, attempts) {
    const card = document.createElement('div');
    card.className = 'test-card';
    card.dataset.level = level;

    const levelNames = {
        'A1': 'Начальный',
        'A2': 'Элементарный',
        'B1': 'Средний',
        'B2': 'Выше среднего',
        'C1': 'Продвинутый',
        'C2': 'Профессиональный'
    };

    card.innerHTML = `
        <div class="test-card-header">
            <div>
                <h4>${levelNames[level] || level}</h4>
            </div>
            <span class="test-level level-${level.toLowerCase()}">${level}</span>
        </div>
        <div class="test-card-info">
            <span>📝 ${questionCount} вопросов</span>
            <span>⏱️ ~15 минут</span>
        </div>
        <div class="test-card-footer">
            <span class="test-attempts">Пройден ${attempts} раз</span>
            <button class="btn btn-primary">Начать тест</button>
        </div>
    `;

    card.querySelector('.btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openTestModal(level);
    });

    return card;
}

function getTestAttempts(level) {
    const results = getFromStorage('testResults') || [];
    return results.filter(r => r.level === level).length;
}

function openTestModal(level) {
    selectedTest = level;
    const modal = document.getElementById('test-modal');
    modal.classList.remove('hidden');

    const nameInput = document.getElementById('student-name');
    const savedName = getFromStorage('studentName');
    if (savedName) {
        nameInput.value = savedName;
    }
}

function setupEventListeners() {
    const modal = document.getElementById('test-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const form = document.getElementById('test-setup-form');

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        startTest();
    });
}

function startTest() {
    const name = document.getElementById('student-name').value.trim();
    const questionsCount = parseInt(document.querySelector('input[name="questions-count"]:checked').value);
    const timerEnabled = document.getElementById('enable-timer').checked;

    if (!name) {
        alert('Пожалуйста, введите ваше имя');
        return;
    }

    saveToStorage('studentName', name);

    const testConfig = {
        level: selectedTest,
        name,
        questionsCount,
        timerEnabled,
        startTime: Date.now()
    };

    saveToStorage('currentTest', testConfig);
    window.location.href = 'pages/quiz.html';
}

function showError(message) {
    const container = document.getElementById('tests-container');
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--danger-color);">
            <p>${message}</p>
        </div>
    `;
}

init();
