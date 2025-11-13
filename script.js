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

        // Отправляем данные на Google Apps Script
        sendEmail(data);
    } else {
        alert('Пожалуйста, заполните все обязательные поля.');
    }
});

// Функция отправки данных в Google Таблицу через Apps Script
function sendEmail(formData) {
    // ВАЖНО: ЗАМЕНИТЕ ЭТОТ URL НА СКОПИРОВАННЫЙ ИЗ ШАГА 2!
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwyzf5lL5bbm9_axxDtstW5iG-ut8xXpozsHLjaoL_TW-2uBLzBd3NJGaGbSVcDFcY/exec';

    // Подготовим данные к отправке. FormData нужно преобразовать в объект.
    const plainFormData = {};
    for (let [key, value] of Object.entries(formData)) {
        if (Array.isArray(value)) {
            plainFormData[key] = value.join(', '); // Преобразуем массивы в строки
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
        alert('Спасибо за заполнение анкеты! Ваша заявка успешно отправлена.');
        resetForm(); // Вызываем функцию сброса формы
    })
    .catch(error => {
        console.error('Ошибка при отправке данных в Google Таблицу:', error);
        alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.');
    });
}

// Функция сброса формы
function resetForm() {
    document.getElementById('distributionForm').reset();
    document.querySelectorAll('.btn-choice.selected').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('transferFields').style.display = 'none';
    document.getElementById('spotifyInput').style.display = 'none';
    document.getElementById('appleInput').style.display = 'none';
    // trackFields больше нет, строка удалена
    Object.keys(selectedValues).forEach(key => selectedValues[key] = '');
}
/* Меню */
.menu-container {
    position: relative;
    display: inline-block;
}

.menu-toggle {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 24px;
    height: 24px;
    margin-left: 10px;
}

.bar {
    height: 3px;
    width: 100%;
    background-color: #fff;
    transition: 0.3s;
    border-radius: 1px;
}

.menu-toggle:hover .bar {
    background-color: #4a90e2;
}

/* Выпадающее меню */
.menu-dropdown {
    display: none;
    position: absolute;
    right: 0;
    top: 40px;
    background-color: #222;
    min-width: 160px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    z-index: 1000;
    border-radius: 8px;
    overflow: hidden;
}

.menu-dropdown a {
    color: white;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    font-size: 16px;
    transition: background-color 0.3s;
}

.menu-dropdown a:hover {
    background-color: #333;
}

/* Показываем/скрываем меню */
.menu-container.show .menu-dropdown {
    display: block;
}

