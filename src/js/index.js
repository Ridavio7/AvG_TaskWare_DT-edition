/* общие */
import '../blocks/#common/common.styles.scss';
/* шапка */
import '../blocks/header/header.scss';
import '../blocks/header/header.js';
/* боковая панель */
import '../blocks/sidebar/sidebar.scss';
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
import '../blocks/input/__type-checkbox/input__type-checkbox.scss';
import '../blocks/input/__type-date/input__type-date.scss';
import '../blocks/input/__type-time/input__type-time.scss';
import '../blocks/input/__type-radio/input__type-radio.scss';
/* select */
import '../blocks/select/select.scss';
import '../blocks/select/select.js';
import '../blocks/select/_modal/select_modal.scss';
/* модальные окна */
import '../blocks/modal/modal.scss';
import '../blocks/modal/__shipment/modal__shipment.js';
/* таблицы */
import '../blocks/table/table.scss';
import '../blocks/table/__task/table__task.scss';

import {funcGetSets} from '../blocks/table/__shipment-sets/table__shipment-sets.js';
import {funcGetProducts} from '../blocks/table/__shipment-products/table__shipment-products.js';

window.onload = function(){
    funcGetSets();
    funcGetProducts();
    funcGetContragents();
}

import {funcCommand} from '../js/common/common.js.js';

function funcGetContragents(){
    let body  =  {"user":"demo", "meth":"view", "obj":"contragents", "count":"100"};
    funcCommand(body, funcProcessGetContragents);
}

function funcProcessGetContragents(result, respobj){
    if( result === 0 ) return;
    console.log("Контрагенты:", respobj);
    let select_id = "task_contragents";

    for (let key in respobj.answ) {
        let set = respobj.answ[key];
        let name = set.name;
        let del = set.del;
        let uin = set.uin;
        addToDropdownContragents(name, del, uin, select_id);
    }
}

function addToDropdownContragents(name, del, uin, select_id){
    let select = document.getElementById(select_id);
    if(del === 0){
        let newOption = new Option(name, uin);
        select.append(newOption);
    }
}