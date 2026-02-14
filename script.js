// Функция, которую нужно вызвать при клике на стрелку
function scrollDown() {
    window.scrollTo({top: window.innerHeight, behavior: 'smooth' });
}

// Исправь ошибки, допущенные при обработке события
let button = document.querySelector('.arrow-next');
if (button) {
    button.addEventListener("click", scrollDown);
}

let score = 0;
const scoreDisplay = document.getElementById('score');
const gameField = document.getElementById('game-field');

function createHeart() {
    if (!gameField) return;
    
    const heart = document.createElement('div');
    heart.classList.add('heart-target');
    
    // Проверяем, что родительский элемент существует
    const parentElement = gameField.parentElement;
    if (!parentElement) return;
    
    // Случайная позиция внутри контейнера
    const parentWidth = parentElement.clientWidth - 50;
    const parentHeight = parentElement.clientHeight - 50;
    
    // Проверяем, что размеры валидны
    if (parentWidth <= 0 || parentHeight <= 0) return;
    
    const x = Math.random() * parentWidth;
    const y = Math.random() * parentHeight;
    
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    
    // Удаление сердечка при клике
    heart.addEventListener('click', (e) => {
        e.stopPropagation(); // Предотвращаем всплытие события
        score++;
        if (scoreDisplay) {
            scoreDisplay.innerText = score;
        }
        heart.remove();
    });
    
    // Сердечко исчезает само через 1.5 секунды, если не нажали
    setTimeout(() => {
        if (heart.parentElement) {
            heart.remove();
        }
    }, 1500);
    
    gameField.appendChild(heart);
}

// Создавать новое сердечко каждую секунду, только если gameField существует
if (gameField) {
    setInterval(createHeart, 1000);
}

// ИСПРАВЛЕННЫЙ КОД СЛАЙДЕРА
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем существование элементов слайдера
    const track = document.querySelector('.playlist-track');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    
    if (!track || !leftArrow || !rightArrow) {
        console.log('Элементы слайдера не найдены');
        return;
    }
    
    const items = Array.from(track.children);
    if (items.length === 0) {
        console.log('Нет элементов в слайдере');
        return;
    }
    
    let currentIndex = 0;
    const visibleItems = 3; // Сколько видимых элементов помещается в слайдер
    
    // Объявляем переменные с let, так как они будут меняться
    let itemWidth = 0;
    
    // Функция для пересчета размеров
    function updateDimensions() {
        if (items.length > 0) {
            const firstItem = items[0];
            const style = getComputedStyle(firstItem);
            // Получаем ширину элемента включая margin
            itemWidth = firstItem.offsetWidth + parseInt(style.marginLeft || 0) + parseInt(style.marginRight || 0);
        }
    }
    
    // Функция для обновления состояния кнопок
    function updateArrows() {
        if (currentIndex === 0) {
            leftArrow.classList.add('disabled');
        } else {
            leftArrow.classList.remove('disabled');
        }
        
        if (currentIndex >= items.length - visibleItems) {
            rightArrow.classList.add('disabled');
        } else {
            rightArrow.classList.remove('disabled');
        }
    }
    
    // Функция для обновления позиции слайдера
    function updateTrackPosition() {
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }
    
    // Обработчик клика по правой стрелке
    rightArrow.addEventListener('click', () => {
        if (currentIndex < items.length - visibleItems) {
            currentIndex++;
            updateTrackPosition();
            updateArrows();
        }
    });
    
    // Обработчик клика по левой стрелке
    leftArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateTrackPosition();
            updateArrows();
        }
    });
    
    // Функция для обработки изменения размера окна
    function handleResize() {
        updateDimensions();
        // Корректируем currentIndex, если он выходит за пределы после ресайза
        const maxIndex = Math.max(0, items.length - visibleItems);
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        updateTrackPosition();
        updateArrows();
    }
    
    // Инициализация
    updateDimensions();
    updateArrows();
    
    // Добавляем обработчик ресайза с дебаунсингом
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Также обновляем размеры при полной загрузке страницы
    window.addEventListener('load', handleResize);
});

// Дополнительная функция для плавного скролла по клику на навигацию
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        // Убираем inline обработчики из HTML и добавляем через JS
        const originalOnClick = item.getAttribute('onclick');
        if (originalOnclick) {
            item.removeAttribute('onclick');
            
            item.addEventListener('click', () => {
                // Парсим ID из оригинального обработчика
                const match = originalOnclick.match(/getElementById\('([^']+)'\)/);
                if (match && match[1]) {
                    const targetId = match[1];
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        }
    });
});
