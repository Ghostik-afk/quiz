import { getFromStorage, clearFromStorage } from './utils/storage.js';
import { formatTime, getLevelByScore } from './utils/helpers.js';
import { createConfetti } from './utils/confetti.js';

let result = null;

function init() {
    result = getFromStorage('lastResult');

    if (!result) {
        window.location.href = '../index.html';
        return;
    }

    renderResults();
    setupEventListeners();

    const percentage = (result.score / result.total) * 100;
    if (percentage >= 80) {
        createConfetti();
    }
}

function renderResults() {
    const scoreValue = document.getElementById('score-value');
    const totalQuestions = document.getElementById('total-questions');
    const levelResult = document.getElementById('level-result');
    const scorePercentage = document.getElementById('score-percentage');
    const timeSpent = document.getElementById('time-spent');

    const percentage = Math.round((result.score / result.total) * 100);
    const level = getLevelByScore(percentage, result.level);

    scoreValue.textContent = result.score;
    totalQuestions.textContent = result.total;
    levelResult.textContent = `Ваш уровень: ${level}`;
    scorePercentage.textContent = `${percentage}%`;
    timeSpent.textContent = `Время: ${formatTime(result.timeSpent)}`;

    drawScoreChart(result.score, result.total);
    renderQuestionsBreakdown();
}

function drawScoreChart(score, total) {
    const canvas = document.getElementById('score-chart');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;

    const percentage = score / total;
    const correctAngle = percentage * 2 * Math.PI;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#f3f4f6';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + correctAngle);
    ctx.closePath();
    ctx.fillStyle = '#2563eb';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
}

function renderQuestionsBreakdown() {
    const container = document.getElementById('questions-breakdown');
    container.innerHTML = '';

    result.questions.forEach((question, index) => {
        const answer = result.answers[index];
        const isCorrect = answer.correct;

        const item = document.createElement('div');
        item.className = `breakdown-item ${isCorrect ? 'correct' : 'incorrect'}`;

        const userAnswerText = getUserAnswerText(question, answer);
        const correctAnswerText = getCorrectAnswerText(question);

        item.innerHTML = `
            <div class="breakdown-header">
                <div class="breakdown-icon">${isCorrect ? '✓' : '✗'}</div>
                <div class="breakdown-question">${question.question}</div>
            </div>
            <div class="breakdown-answers">
                <div class="breakdown-answer user-answer">
                    Ваш ответ: ${userAnswerText}
                </div>
                ${!isCorrect ? `
                    <div class="breakdown-answer correct-answer">
                        Правильный ответ: ${correctAnswerText}
                    </div>
                ` : ''}
            </div>
            ${question.explanation && !isCorrect ? `
                <div class="breakdown-explanation">
                    ${question.explanation}
                </div>
            ` : ''}
        `;

        container.appendChild(item);
    });
}

function getUserAnswerText(question, answer) {
    if (question.type === 'single') {
        return question.options[answer.userAnswer] || 'Не выбрано';
    } else if (question.type === 'input') {
        return answer.userAnswer || 'Не указано';
    } else if (question.type === 'boolean') {
        return answer.userAnswer === 0 ? 'Верно' : 'Неверно';
    } else if (question.type === 'matching') {
        return 'Сопоставление';
    }
    return 'Не указано';
}

function getCorrectAnswerText(question) {
    if (question.type === 'single') {
        return question.options[question.correct];
    } else if (question.type === 'input') {
        return question.correctAnswer;
    } else if (question.type === 'boolean') {
        return question.correct === 0 ? 'Верно' : 'Неверно';
    } else if (question.type === 'matching') {
        return 'Правильное сопоставление';
    }
    return '';
}

function setupEventListeners() {
    const shareBtn = document.getElementById('share-btn');
    const retryBtn = document.getElementById('retry-btn');

    shareBtn.addEventListener('click', generateShareImage);
    retryBtn.addEventListener('click', retryTest);
}

function generateShareImage() {
    const canvas = document.getElementById('share-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 400;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#2563eb');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('EnglishCheck', canvas.width / 2, 80);

    ctx.font = '32px Arial';
    ctx.fillText(`Результат: ${result.score}/${result.total}`, canvas.width / 2, 160);

    const percentage = Math.round((result.score / result.total) * 100);
    ctx.font = 'bold 64px Arial';
    ctx.fillText(`${percentage}%`, canvas.width / 2, 250);

    ctx.font = '24px Arial';
    ctx.fillText(`Уровень: ${result.level}`, canvas.width / 2, 310);

    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `englishcheck-result-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

function retryTest() {
    clearFromStorage('lastResult');
    window.location.href = '../index.html';
}

init();
