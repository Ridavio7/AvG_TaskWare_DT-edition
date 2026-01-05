import {funcCommand, clearTable, makeSelect, addToDropdownOneOption, funcProcessOnlyInfo, removeOptionsSetValue, addToDropdown, findForUpdateSelect} from '../../../js/common/common.js';
import {DropdownButton} from '../../button/__control/_dropdown/button__control_dropdown.js';

let shblcontrol_add_user   = document.getElementById('select_add_shblcontrol_user');
let shblcontrol_add_right  = document.getElementById('select_add_shblcontrol_right');
let shblcontrol_add_button = document.querySelector(".button__control_add-shblcontrol");

let uinShablon_value = null;

export const funcGetShblcontrol = (uinShablon) => {
    uinShablon_value = uinShablon;

    let body  =  { "user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shblcontrol", "uinShablon":`${uinShablon}`, "count":"100", "sort":"uin"};
    funcCommand(body, funcProcessGetShblcontrol);
}

const funcProcessGetShblcontrol = (result, respobj) => {
    console.log("Доступ шаблона:", respobj);

    let tb_id = "tb_task_shblcontrol";
    clearTable(tb_id);

    addToDropdown(shblcontrol_add_user, "users_list");

    for (let key in respobj.answ){
        let obj      = respobj.answ[key];
        let userName = obj.user.name;
        let userUin  = obj.user.uin;
        let accName  = obj.acc.name;
        let accUin   = obj.acc.uin;
        let uin      = obj.uin;
        addShblcontrolRow(userName, userUin, accName, accUin, uin, tb_id);
    }

    /* функция обновления */
    const funcUpdateElem = (uin) => {
        let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"shblcontrol", "uin":`${uin}`, "uinuser":"", "acc":""};

        let target_table = tb_task_shblcontrol;
        body.uinuser = findForUpdateSelect(target_table, "shblcontrol_user", uin);
        body.acc = findForUpdateSelect(target_table, "shblcontrol_right", uin);

        funcCommand(body, funcProcessOnlyInfo);
    }

    /* функция полного удаления */
    const funcFullDelElem = (uin) => {
        let result = confirm("Вы действительно хотите полностью удалить?");
        if(result){
            let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"fulldel", "obj":"shblcontrol", "uin":`${uin}`};
            
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(() => {funcGetShblcontrol(uinShablon_value)}, 100);
        }
    }

    /* кнопки выпадающие списки */
    document.querySelectorAll(".button__control_modal-dropdown-shblcontrol").forEach((elem) => {
        new DropdownButton(elem, '', [
            { text: 'Обновить', action: () => funcUpdateElem(elem.getAttribute("data-value")) },
            { text: 'Удалить', action: () => funcFullDelElem(elem.getAttribute("data-value")) }
        ], 'assets/images/three_dot.svg');
    })
}

const addShblcontrolRow = (userName, userUin, accName, accUin, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellUser  = newRow.insertCell(0); cellUser.classList  = "td td__text_align_center";
    let cellRight = newRow.insertCell(1); cellRight.classList = "td td__text_align_center";
    let cellBtn   = newRow.insertCell(2); cellBtn.classList   = "td";

    makeSelect("shblcontrol_user", uin, userName, userUin, 'users_list', "select", cellUser);

    makeSelect("shblcontrol_right", uin, accName, accUin, '', "select", cellRight);
    addToDropdownOneOption(document.getElementById(`shblcontrol_right_${uin}`), 'Нет доступа', 0);
    addToDropdownOneOption(document.getElementById(`shblcontrol_right_${uin}`), 'Просмотр', 1);
    addToDropdownOneOption(document.getElementById(`shblcontrol_right_${uin}`), 'Редактирование', 2); 

    cellBtn.innerHTML = `<div class="button__control_dropdown-container button__control_modal-dropdown-shblcontrol" data-value="${uin}"></div>`;
}

shblcontrol_add_button.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"shblcontrol", "uinShablon":`${uinShablon_value}`, "uinuser":"", "acc":""};

    if(shblcontrol_add_user.value === "" || shblcontrol_add_right === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.uinuser = shblcontrol_add_user.value;
        body.acc     = shblcontrol_add_right.value;

        removeOptionsSetValue("select_add_shblcontrol_user", "Пользователь");
        removeOptionsSetValue("select_add_shblcontrol_right", "Право");
        addToDropdownOneOption(shblcontrol_add_right, 'Нет доступа', 0);
        addToDropdownOneOption(shblcontrol_add_right, 'Просмотр', 1);
        addToDropdownOneOption(shblcontrol_add_right, 'Редактирование', 2); 
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetShblcontrol(uinShablon_value)}, 100);
    }
})