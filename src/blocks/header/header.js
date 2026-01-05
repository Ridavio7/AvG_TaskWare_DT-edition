import {funcCommand, funcProcessOnlyInfo} from '../../js/common/common.js';

/* переключение темы */
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

let header__user__switch = document.querySelectorAll(".header__user__switch-theme-input");
for (let i = 0; i < header__user__switch.length; i++) {
    header__user__switch[i].addEventListener("click", ()=>{
        if (localStorage.getItem('theme') === 'theme-dark') {
            setTheme('theme-light');
        } else {
            setTheme('theme-dark');
        }
    })
}

(function () {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-dark');
        for (let i = 0; i < header__user__switch.length; i++){
            header__user__switch[i].checked = false;
        }
    } else {
        setTheme('theme-light');
        for (let i = 0; i < header__user__switch.length; i++){
            header__user__switch[i].checked = true;
        }
    }
})();

let header_user_link_not = document.querySelectorAll(".header__user__link_notifications");
/*for (let i = 0; i < header_user_link_not.length; i++) {
    header_user_link_not[i].onclick = () => {
        window.location = 'notifications.html';
    }
}*/

const funcUserLogOff = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"logoff"};
    funcCommand(body, funcProcessOnlyInfo);
}

let header_user_link_leave = document.querySelectorAll(".header__user__link_leave-site");
for (let i = 0; i < header_user_link_not.length; i++) {
    header_user_link_leave[i].onclick = () => {
        let result = confirm("Вы уверены, что хотите выйти?");
        if(result === true){
            funcUserLogOff();
            window.location = 'index.html';
            localStorage.removeItem('srtf');
            localStorage.removeItem('user_name');
        }
    }
}

let header__user__name = document.querySelectorAll(".header__user__name");
for (let i = 0; i < header__user__name.length; i++) {
    header__user__name[i].textContent = localStorage.getItem('user_name');
}

const icon  = document.querySelector('.notification-widget__icon');
const popup = document.querySelector('.notification-widget__popup');
const list  = document.querySelector('.notification-widget__list');
const badge = document.querySelector('.notification-widget__badge');

let notifications = [];

function updateBadge(unreadCount) {
    if (unreadCount > 0) {
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
        badge.removeAttribute('hidden');
    } else {
        badge.setAttribute('hidden', '');
    }
}

function renderNotifications(data) {
    list.innerHTML = '';
    notifications = data;

    if(data != ''){
        data.forEach(item => {
                const el = document.createElement('div');
                el.className = `notification-item notification-item--${item.read ? 'read' : 'unread'}`;
                el.dataset.uin = item.uin;

                const dateStr = new Date(item.date).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                el.innerHTML = `
                    <div class="notification-item__header">
                        <button class="notification-item__delete" type="button">×</button>
                    </div>
                    <div class="notification-item__name">${item.name}</div>
                    <div class="notification-item__task-block">
                        <div class="notification-item__task${item.task.name != '' ? '' : " notification-item__task_no-task"}">Задача: ${item.task.name}</div>
                        <div class="notification-item__step${item.step.name != '' ? '' : " notification-item__step_no-task"}">Этап: ${item.step.name}</div>
                    </div>
                    <div class="notification-item__header">
                        <span class="notification-item__date">${dateStr}</span>
                    </div>
                `;

                // Клик по уведомлению → пометить как прочитанное
                el.addEventListener('click', (e) => {
                    if (e.target.classList.contains('notification-item__delete')) return;
                    if (!item.read) {
                        markAsRead(item.uin);
                        item.read = 1;
                        el.classList.replace('notification-item--unread', 'notification-item--read');
                        // Пересчитать и обновить бейдж
                        const newUnreadCount = notifications.filter(n => !n.read).length;
                        updateBadge(newUnreadCount);
                    }
                });

                // Удаление
                el.querySelector('.notification-item__delete').addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteNotification(item.uin);
                    // Удаляем из локального массива
                    notifications = notifications.filter(n => n.uin !== item.uin);
                    el.remove();
                    // Обновляем бейдж
                    const newUnreadCount = notifications.filter(n => !n.read).length;
                    updateBadge(newUnreadCount);
                });

                list.appendChild(el);
        });
    }
}

function markAsRead(uin) {
    console.log('API: отметка прочитанного', uin);

    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"read", "obj":"notif", "uinuser":`${localStorage.getItem('user_uin')}`, "uins":`${[uin]}`};
    funcCommand(body, funcProcessOnlyInfo);
}

function deleteNotification(uin) {
    console.log('API: удаление уведомления', uin);

    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"fulldel", "obj":"notif", "uinuser":`${localStorage.getItem('user_uin')}`, "uins":`${uin}`};
    funcCommand(body, funcProcessOnlyInfo);
}

export const fetchNotifications = () => {
    let body_1 = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"notif", "uinuser":`${localStorage.getItem('user_uin')}`, "count":"1000", "asort":"date"};
    funcCommand(body_1, funcProcessGetNotif);

    function funcProcessGetNotif(result, respobj) {
        console.log(respobj)
        renderNotifications(respobj.answ);
        updateBadge(respobj.noread);
    }
}

//setInterval(fetchNotifications, 10000);

icon.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = !popup.hasAttribute('hidden');
    if (isVisible) {
        popup.setAttribute('hidden', '');
    } else {
        popup.removeAttribute('hidden');
    }
})

document.addEventListener('click', (e) => {
    if (!icon.contains(e.target) && !popup.contains(e.target)) {
        popup.setAttribute('hidden', '');
    }
})
