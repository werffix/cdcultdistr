// Глобальный объект для хранения выбранных значений всех групп
const selectedValues = {};

// Функция для управления прямоугольными кнопками выбора
function setupButtonGroup(buttonGroupClass, hiddenInputId) {
    const buttonGroup = document.querySelector(`${buttonGroupClass}`);
    const buttons = buttonGroup.querySelectorAll('.btn-choice');
    const hiddenInput = document.getElementById(hiddenInputId);

    const groupId = buttonGroup.getAttribute('data-group');

    if (!selectedValues[groupId]) {
        selectedValues[groupId] = '';
    }

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedValues[groupId] = this.dataset.value;
            hiddenInput.value = this.dataset.value;

            handleSelection(groupId, this.dataset.value);
        });
    });
}

// Специальная функция для обработки изменений выбора
function handleSelection(groupId, value) {
    if (groupId === 'releaseType') {
        const trackFields = document.getElementById('trackFields');
        if (value === 'EP' || value === 'Album') {
            trackFields.style.display = 'block';
            if (document.getElementById('tracksList').children.length === 0) {
                addTrack();
            }
        } else {
            trackFields.style.display = 'none';
        }
    }

    if (groupId === 'transfer') {
        const transferFields = document.getElementById('transferFields');
        transferFields.style.display = value === 'Да' ? 'block' : 'none';
    }

    if (groupId === 'spotifyProfile') {
        document.getElementById('spotifyInput').style.display = value === 'Есть' ? 'block' : 'none';
    }

    if (groupId === 'appleProfile') {
        document.getElementById('appleInput').style.display = value === 'Есть' ? 'block' : 'none';
    }
}

// Инициализация всех групп кнопок
setupButtonGroup('.button-group[data-group="releaseType"]', 'releaseType');
setupButtonGroup('.button-group[data-group="transfer"]', 'transfer');
setupButtonGroup('.button-group[data-group="profanity"]', 'profanity');
setupButtonGroup('.button-group[data-group="spotifyProfile"]', 'spotifyProfile');
setupButtonGroup('.button-group[data-group="appleProfile"]', 'appleProfile');

// Функция добавления трека
function addTrack() {
    const tracksList = document.getElementById('tracksList');
    const trackCounter = tracksList.children.length + 1;
    if (trackCounter > 5) return; // Ограничение до 5 треков

    const trackItem = document.createElement('div');
    trackItem.className = 'track-item';
    trackItem.innerHTML = `
        <div class="form-group">
            <label for="trackName${trackCounter}" class="required">Название трека ${trackCounter}</label>
            <input type="text" id="trackName${trackCounter}" name="trackName[]" placeholder="Название трека" required>
        </div>
        <div class="form-group">
            <label for="trackVersion${trackCounter}">Версия</label>
            <input type="text" id="trackVersion${trackCounter}" name="trackVersion[]" placeholder="Версия (speed up, slowed и т.д.)">
        </div>
        <div class="form-group">
            <label for="isrc${trackCounter}">ISRC (если вы переносите релиз)</label>
            <input type="text" id="isrc${trackCounter}" name="isrc[]" placeholder="ISRC">
        </div>
        <div class="form-group">
            <label for="trackArtist${trackCounter}" class="required">Артист(ы) трека ${trackCounter}</label>
            <input type="text" id="trackArtist${trackCounter}" name="trackArtist[]" placeholder="Артист(ы)" required>
        </div>
        <div class="form-group">
            <label for="trackComposer${trackCounter}" class="required">ФИО автора(-ов) инструментала трека ${trackCounter}</label>
            <input type="text" id="trackComposer${trackCounter}" name="trackComposer[]" placeholder="ФИО автора инструментала" required>
        </div>
        <div class="form-group">
            <label for="trackLyricist${trackCounter}" class="required">ФИО автора(-ов) текста трека ${trackCounter} (поставьте "-" если трек инструментал)</label>
            <input type="text" id="trackLyricist${trackCounter}" name="trackLyricist[]" placeholder="ФИО автора текста" required>
        </div>
        <div class="form-group">
            <label class="required">Ненормативная лексика</label>
            <div class="button-group" data-group="trackProfanity${trackCounter}">
                <div class="btn-choice" data-value="Есть">Есть</div>
                <div class="btn-choice" data-value="Нету">Нету</div>
            </div>
            <input type="hidden" id="trackProfanity${trackCounter}" name="trackProfanity${trackCounter}" required>
        </div>
        <div class="track-controls">
            <button type="button" class="remove-track-btn" onclick="removeTrack(this)">Удалить трек</button>
        </div>
    `;
    tracksList.appendChild(trackItem);
    
    setupButtonGroup(`.button-group[data-group="trackProfanity${trackCounter}"]`, `trackProfanity${trackCounter}`);
}

// Функция удаления трека
function removeTrack(button) {
    const trackItem = button.closest('.track-item');
    trackItem.remove();
}

// Обработчик кнопки "Добавить трек"
document.getElementById('addTrackBtn').addEventListener('click', addTrack);

// Обработчик отправки формы
document.getElementById('distributionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Проверяем обязательные поля
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'red';
        } else {
            field.style.borderColor = '#444';
        }
    });
    
    // Проверяем треки
    const releaseType = document.getElementById('releaseType').value;
    if ((releaseType === 'EP' || releaseType === 'Album') && document.getElementById('tracksList').children.length === 0) {
        isValid = false;
        alert('Для EP и Album необходимо добавить хотя бы один трек.');
    }
    
    if (isValid) {
        // Собираем данные формы
        const formData = new FormData(this);
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }

        // Отправляем данные (теперь через обновленную функцию sendEmail)
        sendEmail(data);
    } else {
        alert('Пожалуйста, заполните все обязательные поля.');
    }
});

// Функция отправки данных через mailto (открывает почтовый клиент)
function sendEmail(formData) {
    // Формируем текст письма
    let subject = "Новая заявка на дистрибуцию";
    let body = "📦 Новая заявка\n\n";
    body += `Основные артист(-ы): ${formData.artists || 'Не указано'}\n`;
    body += `Тип релиза: ${formData.releaseType || 'Не указано'}\n`;
    body += `Название релиза: ${formData.releaseName || 'Не указано'}\n`;
    body += `Подзаголовок: ${formData.subtitle || 'Не указано'}\n`;
    body += `Перенос/заливка: ${formData.transfer || 'Не указано'}\n`;
    if (formData.upc) body += `UPC: ${formData.upc}\n`;
    if (formData.originalReleaseDate) body += `Оригинальная дата релиза: ${formData.originalReleaseDate}\n`;
    body += `Жанр: ${formData.genre || 'Не указано'}\n`;
    body += `Дата выхода: ${formData.releaseDate || 'Не указано'}\n`;
    body += `ФИО автора текста: ${formData.lyricist || 'Не указано'}\n`;
    body += `ФИО автора инструментала: ${formData.composer || 'Не указано'}\n`;
    body += `Ненормативная лексика: ${formData.profanity || 'Не указано'}\n`;
    body += `Ссылка на архив: ${formData.archiveLink || 'Не указана'}\n`;
    body += `Spotify: ${formData.spotifyProfile || 'Не указано'}\n`;
    if (formData.spotifyProfileUrl) body += `Spotify URL: ${formData.spotifyProfileUrl}\n`;
    body += `Apple Music: ${formData.appleProfile || 'Не указано'}\n`;
    if (formData.appleProfileUrl) body += `Apple Music URL: ${formData.appleProfileUrl}\n`;
    body += `Telegram: ${formData.telegram || 'Не указано'}\n`;
    body += `Комментарий: ${formData.comments || 'Не указано'}\n`;

    // Добавляем информацию о треках (если есть)
    if (formData['trackName[]'] && Array.isArray(formData['trackName[]'])) {
      body += '\nТреки:\n';
      for (let i = 0; i < formData['trackName[]'].length; i++) {
        const trackNum = i + 1;
        body += `\nТрек ${trackNum}:\n`;
        body += `- Название: ${formData['trackName[]'][i] || 'Не указано'}\n`;
        body += `- Версия: ${formData['trackVersion[]'] ? formData['trackVersion[]'][i] : 'Не указана'}\n`;
        body += `- ISRC: ${formData['isrc[]'] ? formData['isrc[]'][i] : 'Не указан'}\n`;
        body += `- Артист(ы): ${formData['trackArtist[]'] ? formData['trackArtist[]'][i] : 'Не указано'}\n`;
        body += `- Автор инструментала: ${formData['trackComposer[]'] ? formData['trackComposer[]'][i] : 'Не указано'}\n`;
        body += `- Автор текста: ${formData['trackLyricist[]'] ? formData['trackLyricist[]'][i] : 'Не указано'}\n`;
        body += `- Лексика: ${formData[`trackProfanity${trackNum}`] || 'Не указана'}\n`;
      }
    }

    // Кодировка для mailto
    const encodedBody = encodeURIComponent(body);
    const encodedSubject = encodeURIComponent(subject);

    // Создаем ссылку mailto
    const mailtoLink = `mailto:ilyokserg@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

    // Открываем почтовый клиент
    window.location.href = mailtoLink;

    // Показываем всплывающее окно об успехе
    showPopup('Ваш релиз успешно отправлен!', true);
    resetForm(); // Сбрасываем форму
}

// Функция сброса формы
function resetForm() {
    document.getElementById('distributionForm').reset();
    document.querySelectorAll('.btn-choice.selected').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('transferFields').style.display = 'none';
    document.getElementById('spotifyInput').style.display = 'none';
    document.getElementById('appleInput').style.display = 'none';
    document.getElementById('tracksList').innerHTML = '';
    document.getElementById('trackFields').style.display = 'none';
    Object.keys(selectedValues).forEach(key => selectedValues[key] = '');
}

// Функция для показа модального окна
function showPopup(message, isFinal = false) {
    const existingPopup = document.getElementById('custom-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'custom-popup';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: 'Segoe UI', sans-serif;
    `;

    const popup = document.createElement('div');
    popup.style.cssText = `
        background-color: #111;
        color: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        max-width: 80%;
        width: 400px;
        box-shadow: 0 4px 20px rgba(255,255,255,0.1);
        animation: fadeIn 0.3s ease-out;
    `;
    popup.innerHTML = `<p style="margin: 0; font-size: 18px;">${message}</p>`;

    if (isFinal) {
        const button = document.createElement('button');
        button.textContent = 'ОК';
        button.style.cssText = `
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #4a90e2;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
        `;
        button.onclick = () => hidePopup();
        popup.appendChild(button);
    }

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// Функция для скрытия модального окна
function hidePopup() {
    const popup = document.getElementById('custom-popup');
    if (popup) {
        popup.remove();
    }
}

// Добавляем анимацию в CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(style);

