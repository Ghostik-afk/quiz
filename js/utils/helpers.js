export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export function getLevelByScore(percentage, currentLevel) {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(currentLevel);

    if (percentage >= 90) {
        return levels[Math.min(currentIndex + 1, levels.length - 1)] || currentLevel;
    } else if (percentage >= 70) {
        return currentLevel;
    } else if (percentage >= 50) {
        return currentLevel;
    } else {
        return levels[Math.max(currentIndex - 1, 0)] || currentLevel;
    }
}

export function getScoreMessage(percentage) {
    if (percentage >= 90) {
        return 'Отлично! Вы показали превосходный результат!';
    } else if (percentage >= 70) {
        return 'Хорошо! Вы на правильном пути!';
    } else if (percentage >= 50) {
        return 'Неплохо, но есть над чем поработать.';
    } else {
        return 'Нужно больше практики. Не сдавайтесь!';
    }
}
