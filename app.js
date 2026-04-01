// Элементы DOM
const form = document.getElementById('note-form');
const input = document.getElementById('note-input');
const list = document.getElementById('notes-list');

// Загрузка заметок из localStorage при старте
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    if (notes.length === 0) {
        list.innerHTML = '<li style="color:#999; text-align:center;">Нет заметок. Добавьте первую!</li>';
        return;
    }
    list.innerHTML = notes.map(note => `<li>${escapeHtml(note)}</li>`).join('');
}

// Простая защита от XSS
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Сохранение заметки
function addNote(text) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.push(text);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

// Обработка отправки формы
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
        addNote(text);
        input.value = '';
    }
});

// Первоначальная загрузка
loadNotes();

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('ServiceWorker зарегистрирован: ' + registration.scope);
        } catch (err) {
            console.error('Ошибка регистрации ServiceWorker: ', err);
        }
    });
}