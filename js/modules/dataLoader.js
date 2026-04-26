export async function loadQuestions() {
    try {
        // Определяем базовый путь в зависимости от окружения
        const basePath = window.location.pathname.includes('/pages/')
            ? '../data/questions.json'
            : './data/questions.json';

        const response = await fetch(basePath);
        if (!response.ok) {
            throw new Error('Failed to load questions');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading questions:', error);
        throw error;
    }
}

export function getQuestionsByLevel(questions, level) {
    return questions.filter(q => q.level === level);
}

export function getTestsByLevel(questions) {
    const testsByLevel = {};

    questions.forEach(question => {
        if (!testsByLevel[question.level]) {
            testsByLevel[question.level] = [];
        }
        testsByLevel[question.level].push(question);
    });

    return testsByLevel;
}

export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
