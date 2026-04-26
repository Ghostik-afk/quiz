import { getFromStorage } from './utils/storage.js';
import { formatTime, formatDate } from './utils/helpers.js';

const ADMIN_PASSWORD = 'myNewPassword123';

function init() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');

    if (isLoggedIn) {
        showAdminContent();
    } else {
        setupLogin();
    }
}

function setupLogin() {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const password = document.getElementById('admin-password').value;

        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showAdminContent();
        } else {
            alert('Неверный пароль');
        }
    });
}

function showAdminContent() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('admin-content').classList.remove('hidden');

    loadStatistics();
    loadResults();
    setupFilters();
}

function loadStatistics() {
    const results = getFromStorage('testResults') || [];

    const totalTests = results.length;
    const avgScore = results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
        : 0;

    const today = new Date().toDateString();
    const todayTests = results.filter(r => new Date(r.date).toDateString() === today).length;

    document.getElementById('total-tests').textContent = totalTests;
    document.getElementById('avg-score').textContent = `${avgScore}%`;
    document.getElementById('today-tests').textContent = todayTests;
}

function loadResults(filter = {}) {
    const results = getFromStorage('testResults') || [];
    const tbody = document.getElementById('results-tbody');

    let filteredResults = results;

    if (filter.test) {
        filteredResults = filteredResults.filter(r => r.level === filter.test);
    }

    if (filter.date) {
        filteredResults = filteredResults.filter(r => {
            const resultDate = new Date(r.date).toDateString();
            const filterDate = new Date(filter.date).toDateString();
            return resultDate === filterDate;
        });
    }

    filteredResults.sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = '';

    if (filteredResults.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Нет результатов</td></tr>';
        return;
    }

    filteredResults.forEach(result => {
        const row = document.createElement('tr');

        const scoreClass = getScoreClass(result.percentage);

        row.innerHTML = `
            <td>${result.name}</td>
            <td>${result.level}</td>
            <td>
                <span class="score-badge ${scoreClass}">
                    ${result.score}/${result.total} (${result.percentage}%)
                </span>
            </td>
            <td>${formatDate(result.date)}</td>
            <td>${formatTime(result.timeSpent)}</td>
        `;

        tbody.appendChild(row);
    });

    populateTestFilter(results);
}

function getScoreClass(percentage) {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage >= 50) return 'average';
    return 'poor';
}

function populateTestFilter(results) {
    const select = document.getElementById('test-filter');
    const currentValue = select.value;

    const levels = [...new Set(results.map(r => r.level))].sort();

    select.innerHTML = '<option value="">Все тесты</option>';
    levels.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level;
        select.appendChild(option);
    });

    select.value = currentValue;
}

function setupFilters() {
    const testFilter = document.getElementById('test-filter');
    const dateFilter = document.getElementById('date-filter');
    const resetBtn = document.getElementById('reset-filters');
    const exportBtn = document.getElementById('export-csv');

    const applyFilters = () => {
        loadResults({
            test: testFilter.value,
            date: dateFilter.value
        });
    };

    testFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);

    resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        testFilter.value = '';
        dateFilter.value = '';
        loadResults();
    });

    exportBtn.addEventListener('click', exportToCSV);
}

function exportToCSV() {
    const results = getFromStorage('testResults') || [];

    if (results.length === 0) {
        alert('Нет данных для экспорта');
        return;
    }

    const headers = ['Имя', 'Тест', 'Результат', 'Процент', 'Дата', 'Время'];
    const rows = results.map(r => [
        r.name,
        r.level,
        `${r.score}/${r.total}`,
        `${r.percentage}%`,
        formatDate(r.date),
        formatTime(r.timeSpent)
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `englishcheck-results-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

init();
