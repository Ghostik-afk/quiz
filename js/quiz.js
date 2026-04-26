import { loadQuestions, getQuestionsByLevel, shuffleArray } from './modules/dataLoader.js';
import { getFromStorage, saveToStorage } from './utils/storage.js';
import { formatTime } from './utils/helpers.js';

let currentTest = null;
let questions = [];
let currentQuestionIndex = 0;
let answers = [];
let timerInterval = null;
let timeRemaining = 0;

async function init() {
    currentTest = getFromStorage('currentTest');

    if (!currentTest) {
        window.location.href = '../index.html';
        return;
    }

    try {
        const allQuestions = await loadQuestions();
        const levelQuestions = getQuestionsByLevel(allQuestions, currentTest.level);
        questions = shuffleArray(levelQuestions).slice(0, currentTest.questionsCount);

        if (currentTest.timerEnabled) {
            timeRemaining = 15 * 60;
            startTimer();
        }

        renderQuestion();
    } catch (error) {
        console.error('Failed to load quiz:', error);
        alert('Ошибка загрузки теста');
        window.location.href = '../index.html';
    }
}

function startTimer() {
    const timerEl = document.getElementById('timer');
    timerEl.classList.remove('hidden');

    timerInterval = setInterval(() => {
        timeRemaining--;

        timerEl.textContent = formatTime(timeRemaining);

        if (timeRemaining <= 60) {
            timerEl.classList.add('warning');
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            finishTest();
        }
    }, 1000);
}

function renderQuestion() {
    const question = questions[currentQuestionIndex];
    const container = document.getElementById('question-container');
    const counter = document.getElementById('question-counter');
    const progress = document.getElementById('progress-fill');
    const nextBtn = document.getElementById('next-btn');

    counter.textContent = `Вопрос ${currentQuestionIndex + 1} из ${questions.length}`;
    progress.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

    nextBtn.disabled = true;

    container.innerHTML = `
        <div class="question-text">${question.question}</div>
        ${renderQuestionType(question)}
    `;

    setupQuestionListeners(question);
}

function renderQuestionType(question) {
    switch (question.type) {
        case 'single':
            return renderSingleChoice(question);
        case 'input':
            return renderInputQuestion(question);
        case 'boolean':
            return renderTrueFalse(question);
        case 'matching':
            return renderMatching(question);
        default:
            return renderSingleChoice(question);
    }
}

function renderSingleChoice(question) {
    return `
        <div class="options-container">
            ${question.options.map((option, index) => `
                <div class="option" data-index="${index}">
                    ${option}
                </div>
            `).join('')}
        </div>
    `;
}

function renderInputQuestion(question) {
    return `
        <div class="options-container">
            <input type="text" class="input-answer" placeholder="Введите ваш ответ" />
        </div>
    `;
}

function renderTrueFalse(question) {
    return `
        <div class="true-false-container">
            <div class="option" data-value="true">Верно</div>
            <div class="option" data-value="false">Неверно</div>
        </div>
    `;
}

function renderMatching(question) {
    const pairs = question.pairs || [];
    return `
        <div class="matching-container">
            ${pairs.map((pair, index) => `
                <div class="matching-pair">
                    <div class="matching-item">${pair.left}</div>
                    <select class="matching-select" data-index="${index}">
                        <option value="">Выберите...</option>
                        ${pairs.map((p, i) => `<option value="${i}">${p.right}</option>`).join('')}
                    </select>
                </div>
            `).join('')}
        </div>
    `;
}

function setupQuestionListeners(question) {
    const nextBtn = document.getElementById('next-btn');

    if (question.type === 'single' || question.type === 'boolean') {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                if (option.classList.contains('disabled')) return;

                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                nextBtn.disabled = false;
            });
        });

        nextBtn.onclick = () => handleSingleChoiceAnswer(question);
    } else if (question.type === 'input') {
        const input = document.querySelector('.input-answer');
        input.addEventListener('input', () => {
            nextBtn.disabled = input.value.trim() === '';
        });

        nextBtn.onclick = () => handleInputAnswer(question);
    } else if (question.type === 'matching') {
        const selects = document.querySelectorAll('.matching-select');
        const checkAllSelected = () => {
            const allSelected = Array.from(selects).every(s => s.value !== '');
            nextBtn.disabled = !allSelected;
        };

        selects.forEach(select => {
            select.addEventListener('change', checkAllSelected);
        });

        nextBtn.onclick = () => handleMatchingAnswer(question);
    }
}

function handleSingleChoiceAnswer(question) {
    const selected = document.querySelector('.option.selected');
    const selectedIndex = question.type === 'boolean'
        ? (selected.dataset.value === 'true' ? 0 : 1)
        : parseInt(selected.dataset.index);

    const isCorrect = selectedIndex === question.correct;

    answers.push({
        questionId: question.id,
        userAnswer: selectedIndex,
        correct: isCorrect
    });

    showFeedback(selected, isCorrect, question);
}

function handleInputAnswer(question) {
    const input = document.querySelector('.input-answer');
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = question.correctAnswer.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    answers.push({
        questionId: question.id,
        userAnswer: input.value.trim(),
        correct: isCorrect
    });

    input.disabled = true;

    if (!isCorrect) {
        input.style.borderColor = 'var(--danger-color)';
        setTimeout(() => {
            alert(`Правильный ответ: ${question.correctAnswer}`);
            nextQuestion();
        }, 500);
    } else {
        input.style.borderColor = 'var(--success-color)';
        setTimeout(nextQuestion, 1500);
    }
}

function handleMatchingAnswer(question) {
    const selects = document.querySelectorAll('.matching-select');
    const userAnswers = Array.from(selects).map(s => parseInt(s.value));
    const correctAnswers = question.pairs.map((_, i) => i);
    const isCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);

    answers.push({
        questionId: question.id,
        userAnswer: userAnswers,
        correct: isCorrect
    });

    setTimeout(nextQuestion, 1500);
}

function showFeedback(element, isCorrect, question) {
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.add('disabled'));

    if (isCorrect) {
        element.classList.add('correct');
        setTimeout(nextQuestion, 1500);
    } else {
        element.classList.add('incorrect');
        const correctOption = options[question.correct];
        if (correctOption) {
            correctOption.classList.add('correct');
        }

        if (question.explanation) {
            const container = document.getElementById('question-container');
            const explanation = document.createElement('div');
            explanation.className = 'explanation';
            explanation.textContent = question.explanation;
            container.appendChild(explanation);
        }

        setTimeout(nextQuestion, 2500);
    }
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
        finishTest();
    } else {
        renderQuestion();
    }
}

function finishTest() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    const timeSpent = currentTest.timerEnabled
        ? (15 * 60 - timeRemaining)
        : Math.floor((Date.now() - currentTest.startTime) / 1000);

    const result = {
        name: currentTest.name,
        level: currentTest.level,
        questions,
        answers,
        timeSpent,
        date: new Date().toISOString(),
        score: answers.filter(a => a.correct).length,
        total: questions.length
    };

    saveToStorage('lastResult', result);

    const results = getFromStorage('testResults') || [];
    results.push({
        name: result.name,
        level: result.level,
        score: result.score,
        total: result.total,
        percentage: Math.round((result.score / result.total) * 100),
        date: result.date,
        timeSpent: result.timeSpent
    });
    saveToStorage('testResults', results);

    window.location.href = 'results.html';
}

init();
