import 'normalize.css';
/* общие */
import '../blocks/#common/common.styles.scss';
import '../blocks/table/__control-task-control/table__control-task-control.scss';
/* шапка */
import '../blocks/header/header.scss';
import '../blocks/header/header.js';
/* боковая панель */
import '../blocks/sidebar/sidebar.scss';
import '../blocks/sidebar/sidebar.js';
import '../blocks/sidebar/__task/sidebar__task.scss';
/* кнопки */
import '../blocks/button/__control/button__control.scss';
import '../blocks/button/__control/_modal/button__control_modal.scss';
import '../blocks/button/__tab/button__tab.scss';
import '../blocks/button/__tab/button__tab.js';
import '../blocks/button/__select/button__select.scss'
/* input */
import '../blocks/input/__type-text/input__type-text.scss';
import '../blocks/input/__type-text/_modal/input__type-text_modal.scss';
import '../blocks/input/__type-text/_task/input__type-text_task.scss';
import '../blocks/input/__type-checkbox/input__type-checkbox.scss';
import '../blocks/input/__type-date/input__type-date.scss';
import '../blocks/input/__type-time/input__type-time.scss';
import '../blocks/input/__type-radio/input__type-radio.scss';
/* select */
import '../blocks/select/select.scss';
import '../blocks/select/select.js';
import '../blocks/select/_modal/select_modal.scss';
import '../blocks/select/_task/select_task.scss';
/* модальные окна */
import '../blocks/modal/modal.scss';
import '../blocks/modal/__shipment/modal__shipment.js';
import '../blocks/modal/__notification/modal__notification.scss';
import '../blocks/modal/__notification/modal__notification.js';
/* таблицы */
import '../blocks/table/table.scss';


import {funcGetUserTasks} from '../blocks/table/__user-tasks/table__user-tasks.js';

window.onload = function(){
    funcGetUserTasks();
}