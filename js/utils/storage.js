export function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to storage:', error);
    }
}

export function getFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from storage:', error);
        return null;
    }
}

export function clearFromStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error clearing storage:', error);
    }
}

export function clearAllStorage() {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing all storage:', error);
    }
}
