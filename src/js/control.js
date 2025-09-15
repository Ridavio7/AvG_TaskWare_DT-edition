import 'normalize.css';
/* общие */
import '../blocks/#common/common.styles.scss';
import '../blocks/table/__control-task-control/table__control-task-control.scss';
import '../blocks/hamburger-menu/hamburger.scss';
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
import '../blocks/input/__type-time/input__type-time.scss';
import '../blocks/input/__type-radio/input__type-radio.scss';
import '../blocks/table/__analysis-products/table__analysis-products.scss';
/* select */
import '../blocks/select/select.scss';
import '../blocks/select/select.js';
import '../blocks/select/_modal/select_modal.scss';
/* модальные окна */
import '../blocks/modal/modal.scss';
import '../blocks/modal/__notification/modal__notification.scss';
import '../blocks/modal/__notification/modal__notification.js';
import '../blocks/modal/__chat-task/modal__chat-task.scss';
/* таблицы */
import '../blocks/table/table.scss';
/* дерево */
import '../blocks/_tree/tree.js';
import '../blocks/_tree/tree.scss';

import {addEventButtonTab,updateDirectory} from '../js/common/common.js.js';

/* пользователи */
import {funcGetUsers} from '../blocks/table/__users-main/table__users-main.js';
import {funcGetJobs} from '../blocks/table/__users-jobs/table__users-jobs.js';
import {funcGetRights} from '../blocks/table/__users-rights/table__users-rights.js';
import {funcGetProf} from '../blocks/table/__dev-prof/table__dev-prof.js';

/* настройки */
import {funcGetSysopt} from '../blocks/table/__settings-server/table__settings-server.js';
import {funcGetWebopt} from '../blocks/table/__settings-user/table__settings-user.js';

/* шаблоны */
import {funcGetShablons} from '../blocks/table/__template-task-shablons/table__template-task-shablons.js';
import {funcGetContents} from '../blocks/table/__template-task-contents/table__template-task-contents.js';
import {funcGetStartstep} from '../blocks/table/__template-task-startstep/table__template-task-startstep.js';

/* контроль */
import {funcGetTasks} from '../blocks/table/__control-task-control/table__control-task-control.js';
import {funcGetStatustask} from '../blocks/table/__control-task-statustask/table__control-task-statustask.js';
import {funcGetTasksArchive} from '../blocks/table/__control-task-archive/table__control-task-archive.js';

import {returnTabs} from '../js/common/common.js.js';

window.onload = function(){
    returnTabs();
    updateDirectory();

    setTimeout(() => {
        let buttons = document.querySelectorAll(".button__control_action_status.button__control_modal-tasks-catTask");
        let uin     = localStorage.getItem('button-active__tasks-catTask');
        buttons.forEach(button => {
            if (button.value === uin) {
                button.click();
            }
        })
    }, 100)
}

/* пользователи */
addEventButtonTab(document.querySelectorAll(".button__tab__first_user_main"), funcGetUsers);
addEventButtonTab(document.querySelectorAll(".button__tab__first_users_jobs"), funcGetJobs);
addEventButtonTab(document.querySelectorAll(".button__tab__first_users_rights"), funcGetRights);
addEventButtonTab(document.querySelectorAll(".button__tab__first_users_prof"), funcGetProf);

/* настройки */
addEventButtonTab(document.querySelectorAll(".button__tab__first_settings_server"), funcGetSysopt);
addEventButtonTab(document.querySelectorAll(".button__tab__first_settings_user"), funcGetWebopt);

/* задачи */
addEventButtonTab(document.querySelectorAll(".button__tab__first_tasks_control"), funcGetTasks);
addEventButtonTab(document.querySelectorAll(".button__tab__first_tasks_shablons"), funcGetShablons);
addEventButtonTab(document.querySelectorAll(".button__tab__first_tasks_status"), funcGetStatustask);
addEventButtonTab(document.querySelectorAll(".button__tab__first_tasks_contents"), funcGetContents);
addEventButtonTab(document.querySelectorAll(".button__tab__first_tasks_startstep"), funcGetStartstep);
addEventButtonTab(document.querySelectorAll(".button__tab__first_tasks_archive"), funcGetTasksArchive);

/* обновление контроля задач 
setInterval(function() {
    funcGetTasks();

    setTimeout(() => {
        let buttons = document.querySelectorAll(".button__control_action_status.button__control_modal-tasks-catTask");
        let uin     = localStorage.getItem('button-active__tasks-catTask');
        buttons.forEach(button => {
            if (button.value === uin) {
                button.click();
            }
        })
    }, 100)
}, 10000)*/