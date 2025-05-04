import 'normalize.css';
/* общие */
import '../blocks/#common/common.styles.scss';
/* шапка */
import '../blocks/header/header.scss';
import '../blocks/header/header.js';
/* боковая панель */
import '../blocks/sidebar/sidebar.scss';
import '../blocks/sidebar/sidebar.js';
/* кнопки */
import '../blocks/button/__control/button__control.scss';
import '../blocks/button/__control/_modal/button__control_modal.scss';
import '../blocks/button/__tab/button__tab.scss';
import '../blocks/button/__tab/button__tab.js';
import '../blocks/button/__select/button__select.scss'
/* input */
import '../blocks/input/__type-text/input__type-text.scss';
import '../blocks/input/__type-checkbox/input__type-checkbox.scss';
import '../blocks/input/__type-text/_modal/input__type-text_modal.scss';
import '../blocks/input/__type-date/input__type-date.scss';
/* select */
import '../blocks/select/select.scss';
import '../blocks/select/select.js';
import '../blocks/select/_modal/select_modal.scss';
/* модальные окна */
import '../blocks/modal/modal.scss';
/* таблицы */
import '../blocks/table/table.scss';

import {addEventButtonTab} from '../js/common/common.js.js';

import {funcGetUsers} from '../blocks/table/__users-main/table__users-main.js';
import {funcGetJobs} from '../blocks/table/__users-jobs/table__users-jobs.js';
import {funcGetRights} from '../blocks/table/__users-rights/table__users-rights.js';

window.onload = function(){
    returnTabsBuisness();
}

const returnTabsBuisness = () => {
    let sidebar_tab_first_active = document.getElementById(localStorage.getItem("buisness_sidebar_tab_first_active"));
    sidebar_tab_first_active.click();
    if(sidebar_tab_first_active.className.includes("sidebar__link_no-child")){localStorage.removeItem("buisness_sidebar_tab_second_active"); localStorage.removeItem("buisness_tabcontent_tab_active")};

    let sidebar_tab_second_active = document.getElementById(localStorage.getItem("buisness_sidebar_tab_second_active"));
    if(sidebar_tab_second_active != null){
        sidebar_tab_second_active.parentElement.parentElement.previousElementSibling.click();
        sidebar_tab_second_active.click();

        if(sidebar_tab_second_active.className.includes("sidebar__menu__link_no-child")){localStorage.removeItem("buisness_tabcontent_tab_active")};
    
        let buisness_sidebar_arrow_active = localStorage.getItem("buisness_sidebar_arrow_active");
        document.getElementById(buisness_sidebar_arrow_active).className += " sidebar__wrapper_menu-visibale";
    }

    let tabcontent_tab_active = document.getElementsByClassName(localStorage.getItem("buisness_tabcontent_tab_active"));
    tabcontent_tab_active[0].click();
}

addEventButtonTab(document.querySelectorAll(".button__tab__first_user_main"), funcGetUsers);
addEventButtonTab(document.querySelectorAll(".button__tab__first_users_jobs"), funcGetJobs);
addEventButtonTab(document.querySelectorAll(".button__tab__first_users_rights"), funcGetRights);