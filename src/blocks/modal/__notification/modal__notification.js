export const showNotification = (type, title, message, duration = 5000) => {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    notification.innerHTML = `
        <button class="notification-close">&times;</button>
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
    `;

    container.appendChild(notification);

    // Закрытие по клику
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    })

    // Автоматическое закрытие
    if (duration > 0) {
        setTimeout(() => {
            hideNotification(notification);
        }, duration);
    }
}

const hideNotification = (notification) => {
    notification.classList.add('hide');
    notification.addEventListener('transitionend', () => {
        notification.remove();
    })
}