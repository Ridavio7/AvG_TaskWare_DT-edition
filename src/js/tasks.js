import 'normalize.css';
/* общие */
import '../blocks/#common/common.styles.scss';
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

import {funcGetSets} from '../blocks/table/__shipment-sets/table__shipment-sets.js';
import {funcGetProducts} from '../blocks/table/__shipment-products/table__shipment-products.js';
import {funcGetUserTasks} from '../blocks/table/__user-tasks/table__user-tasks.js';

window.onload = function(){
    funcGetUserTasks();
    //funcGetSets();
    //funcGetProducts();
    //funcGetContragents();
    //funcGetUsers();
    //funcGetProductpp();

    document.getElementById("mount_date").value = new Date().toISOString().split('T')[0];
    document.getElementById("mount_time").value = new Date().toLocaleTimeString();
}

import {funcCommand, removeOptionsSetValue, funcProcessOnlyInfo, responseProcessor} from './common/common.js.js';

const funcGetContragents = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"contragents", "count":"1000"};
    funcCommand(body, funcProcessGetContragents);
}

const funcProcessGetContragents = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    console.log("Контрагенты:", respobj);

    let select_id = "task_contragents";
    for (let key in respobj.answ) {
        let obj  = respobj.answ[key];
        let name = obj.name;
        let buy  = obj.buy
        let del  = obj.del;
        let uin  = obj.uin;
        addToDropdownTaskSelect(name, buy, del, uin, select_id);
    }
}

const funcGetUsers = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"users", "count":"1000"};
    funcCommand(body, funcProcessGetUsers);
}

const funcProcessGetUsers = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    console.log("Пользователи:", respobj);

    let select_id = "mount_users";
    for (let key in respobj.answ) {
        let obj  = respobj.answ[key];
        let name = obj.name;
        let buy  = 1;
        let del  = obj.del;
        let uin  = obj.uin;
        addToDropdownTaskSelect(name, buy, del, uin, select_id);
    }
}

const addToDropdownTaskSelect = (name, buy, del, uin, select_id) => {
    let select = document.getElementById(select_id);
    if(del === 0 && buy === 1){
        let newOption = new Option(name, uin);
        select.append(newOption);
    }
}

const funcGetProductpp = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"getproductpp", "count":"1000", "sort":"name"};
    funcCommand(body, funcProcessGetProductpp);
}

const funcProcessGetProductpp = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    console.log("Изделия монтаж:", respobj);
    
    let select_id = "mount_prod";
    for (let key in respobj.answ) {
        let obj  = respobj.answ[key];
        let name = obj.name;
        let buy  = 1;
        let del  = 0;
        let uin  = obj.uinproduct;
        addToDropdownTaskSelect(name, buy, del, uin, select_id);
    }
}

document.getElementById("mount_prod").addEventListener("change", (event) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"getprocpp", "uinproduct":`${event.target.value}`};
    funcCommand(body, funcProcessGetProc);
})

const funcProcessGetProc = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    console.log("Тех.проц.:", respobj);

    let select_id = "mount_procc";
    removeOptionsSetValue(select_id, "-- Тех. процесс --")
    for (let key in respobj.answ) {
        let obj  = respobj.answ[key];
        let name = obj.name;
        let buy  = 1;
        let del  = 0;
        let uin  = obj.uintechproc;
        addToDropdownTaskSelect(name, buy, del, uin, select_id);
    }
}

document.getElementById("mount_button").addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"fixprocpp", "uinuser":"", "uinproduct":"", "uintechproc":"", "count":"", "datetm":"", "prim":""};

    let uinuser     = document.getElementById("mount_users").value;
    let uinproduct  = document.getElementById("mount_prod").value;
    let uintechproc = document.getElementById("mount_procc").value;
    let count       = document.getElementById("mount_count").value;
    let prim        = document.getElementById("mount_prim").value;
    let date        = document.getElementById("mount_date").value.split('-').join("");
    let time        = document.getElementById("mount_time").value;

    if(uinuser === '' || uinproduct === '' || uintechproc === '' || count === ''){
        alert('Вы не заполнили все необходимые поля!');
    } else {
        body.uinuser     = uinuser;
        body.uinproduct  = uinproduct;
        body.uintechproc = uintechproc;
        body.count       = count;
        body.prim        = prim;
        body.datetm      = `${date} ${time}`;

        funcCommand(body, funcProcessOnlyInfo);

        removeOptionsSetValue("mount_users", "Пользователи");
        funcGetUsers();
        removeOptionsSetValue("mount_prod", "Изделия");
        funcGetProductpp();
        removeOptionsSetValue("mount_procc", "Тех. процесс");
        document.getElementById("mount_count").value = "";
        document.getElementById("mount_prim").value  = "";
        document.getElementById("mount_date").value  = new Date().toISOString().split('T')[0];
        document.getElementById("mount_time").value  = new Date().toLocaleTimeString();
    }
})

document.getElementById("mount_count_minus").addEventListener("click", () => {
    document.getElementById("mount_count").stepDown();
})

document.getElementById("mount_count_plus").addEventListener("click", () => {
    document.getElementById("mount_count").stepUp();
})