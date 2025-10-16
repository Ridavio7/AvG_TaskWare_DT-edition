const mainImage = document.getElementById('mainImage');
const thumbnailContainer = document.getElementById('thumbnailContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');


let productImages = null;
let currentIndex = 0;

export const createCarousel = (arr) => {
    productImages = arr;

    setCurrentImage(0);
    thumbnailContainer.innerHTML = '';
    
    productImages.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `Thumbnail ${index + 1}`;
        thumbnail.classList.add('carousel__thumbnail');
        
        if (index === currentIndex) {
            thumbnail.classList.add('active');
        }
        
        thumbnail.addEventListener('click', () => {
            setCurrentImage(index);
        });
        
        thumbnailContainer.appendChild(thumbnail);
    });
}

// Устанавливаем текущее изображение
function setCurrentImage(index) {
    currentIndex = index;
    mainImage.src = productImages[currentIndex] == undefined ? "https://imgholder.ru/700x400/fff/212121&text=Фото+отсутствует" : productImages[currentIndex];
    
    // Обновляем активную миниатюру
    const thumbnails = document.querySelectorAll('.carousel__thumbnail');
    thumbnails.forEach((thumb, i) => {
        if (i === currentIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
    
    // Прокручиваем миниатюры к активной
    if (thumbnails[currentIndex]) {
        thumbnails[currentIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
}

// Переход к предыдущему изображению
function prevImage() {
    currentIndex = (currentIndex - 1 + productImages.length) % productImages.length;
    setCurrentImage(currentIndex);
}

// Переход к следующему изображению
function nextImage() {
    currentIndex = (currentIndex + 1) % productImages.length;
    setCurrentImage(currentIndex);
}

// Обработчики событий для кнопок
prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);

// Добавляем обработчики для свайпов (на мобильных устройствах)
let touchStartX = 0;
let touchEndX = 0;

mainImage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

mainImage.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        nextImage(); // Свайп влево
    }
    
    if (touchEndX > touchStartX + 50) {
        prevImage(); // Свайп вправо
    }
}