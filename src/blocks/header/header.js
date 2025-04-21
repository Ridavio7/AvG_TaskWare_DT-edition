/* переключение темы */
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

let header__user__switch = document.getElementsByClassName("header__user__switch-theme-input");
header__user__switch[0].addEventListener("click", (e)=>{
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }
});

(function () {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-dark');
        header__user__switch[0].checked = false;
    } else {
        setTheme('theme-light');
        header__user__switch[0].checked = true;
    }
})();

let header_user_link_not = document.getElementsByClassName("header__user__link_notifications");
header_user_link_not[0].addEventListener("click", ()=>{
    window.location = 'notifications.html';
});

let header_user_link_leave = document.getElementsByClassName("header__user__link_leave-site");
header_user_link_leave[0].addEventListener("click", ()=>{
    let result = confirm("Вы уверены, что хотите выйти?");
    if(result === true){
        window.location = 'https://dev.proektit.ru';
    }
});