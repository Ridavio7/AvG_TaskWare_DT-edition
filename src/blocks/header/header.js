/* переключение темы */
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

let header__user__switch = document.getElementsByClassName("header__user__switch-input");
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

let header_user_arrow = document.getElementsByClassName("header__user__arrow");
header_user_arrow[0].addEventListener("click", (e)=>{
    let arrowParent = e.target.parentElement.parentElement;
    arrowParent.classList.toggle("header__user__container_menu-visibale");
});

let header_user_link_leave = document.getElementsByClassName("header__user__link_leave-site");
header_user_link_leave[0].addEventListener("click", (e)=>{
    let result = confirm("Вы уверены, что хотите выйти?");
    if(result === true){
        window.location = 'https://dev.proektit.ru';
    }
});