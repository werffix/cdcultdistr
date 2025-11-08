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

       // Функция отправки данных в Google Таблицу через Apps Script
function sendEmail(formData) {
    // ВАЖНО: ЗАМЕНИТЕ ЭТОТ URL НА СКОПИРОВАННЫЙ ИЗ ШАГА 2!
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbytaiN_B_Qri2nxT8wLkwIq_2yGjw4fR1LM0cy0A4aTcoEk2Pot9AmAWifbIB10fN4/exec';

    // Подготовим данные к отправке. FormData нужно преобразовать в объект.
    const plainFormData = {};
    for (let [key, value] of Object.entries(formData)) {
        if (Array.isArray(value)) {
            plainFormData[key] = value; // Оставляем как массив для треков
        } else {
            plainFormData[key] = value;
        }
    }

    // Отправляем данные на Google Apps Script
    fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Обход CORS - важно для внешнего запроса
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(plainFormData),
    })
    .then(response => {
        // mode: 'no-cors' не позволяет получить детали ответа, но успешная отправка работает
        // Обычно в реальных проектах mode не используется, но для клиентской отправки в GAS - workaround
        alert('Спасибо за заполнение анкеты! Ваша заявка успешно отправлена.');
        resetForm(); // Вызываем функцию сброса формы
    })
    .catch(error => {
        console.error('Ошибка при отправке данных в Google Таблицу:', error);
        alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.');
    });
}
    } else {
        alert('Пожалуйста, заполните все обязательные поля.');
    }
});

// Функция отправки данных (демонстрация)
function sendEmail(formData) {
    // Для демонстрации используем alert
    alert('Спасибо за заполнение анкеты! Ваши данные были отправлены (в реальном проекте они пошли бы на сервер).');
    
    console.log('Отправленные данные:', formData);
    
    // Сбрасываем форму
    resetForm();
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