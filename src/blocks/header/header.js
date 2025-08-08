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
for (let i = 0; i < header_user_link_not.length; i++) {
    header_user_link_not[i].onclick = () => {
        window.location = 'notifications.html';
    }
}

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