import {funcCommand, clearTable, makeSelect, addToDropdownOneOption, funcProcessOnlyInfo, removeOptionsSetValue, addToDropdown, findForUpdateSelect} from '../../../js/common/common.js';
import {DropdownButton} from '../../button/__control/_dropdown/button__control_dropdown.js';

let taskcontrol_add_user   = document.getElementById('select_add_taskcontrol_user');
let taskcontrol_add_right  = document.getElementById('select_add_taskcontrol_right');
let taskcontrol_add_button = document.querySelector(".button__control_add-taskcontrol");

let uinTask_value = null;

export const funcGetTaskcontrol = (uinTask) => {
    uinTask_value = uinTask;

    let body  =  { "user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"taskcontrol", "uinTask":`${uinTask}`, "count":"100", "sort":"uin"};
    funcCommand(body, funcProcessGetTaskcontrol);
}

const funcProcessGetTaskcontrol = (result, respobj) => {
    console.log("Доступ задачи:", respobj);

    let tb_id = "tb_task_taskcontrol";
    clearTable(tb_id);

    addToDropdown(taskcontrol_add_user, "users_list");

    for (let key in respobj.answ){
        let obj      = respobj.answ[key];
        let userName = obj.user.name;
        let userUin  = obj.user.uin;
        let accName  = obj.acc.name;
        let accUin   = obj.acc.uin;
        let uin      = obj.uin;
        addTaskcontrolRow(userName, userUin, accName, accUin, uin, tb_id);
    }

    /* функция обновления */
    const funcUpdateElem = (uin) => {
        let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"taskcontrol", "uin":`${uin}`, "uinuser":"", "acc":""};

        let target_table = tb_task_taskcontrol;
        body.uinuser = findForUpdateSelect(target_table, "taskcontrol_user", uin);
        body.acc = findForUpdateSelect(target_table, "taskcontrol_right", uin);

        funcCommand(body, funcProcessOnlyInfo);
    }

    /* функция полного удаления */
    const funcFullDelElem = (uin) => {
        let result = confirm("Вы действительно хотите полностью удалить?");
        if(result){
            let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"fulldel", "obj":"taskcontrol", "uin":`${uin}`};
            
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(() => {funcGetTaskcontrol(uinTask_value)}, 100);
        }
    }

    /* кнопки выпадающие списки */
    document.querySelectorAll(".button__control_modal-dropdown-taskcontrol").forEach((elem) => {
        new DropdownButton(elem, '', [
            { text: 'Обновить', action: () => funcUpdateElem(elem.getAttribute("data-value")) },
            { text: 'Удалить', action: () => funcFullDelElem(elem.getAttribute("data-value")) }
        ], 'assets/images/three_dot.svg');
    })
}

const addTaskcontrolRow = (userName, userUin, accName, accUin, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellUser  = newRow.insertCell(0); cellUser.classList  = "td td__text_align_center";
    let cellRight = newRow.insertCell(1); cellRight.classList = "td td__text_align_center";
    let cellBtn   = newRow.insertCell(2); cellBtn.classList   = "td";

    makeSelect("taskcontrol_user", uin, userName, userUin, 'users_list', "select", cellUser);

    makeSelect("taskcontrol_right", uin, accName, accUin, '', "select", cellRight);
    addToDropdownOneOption(document.getElementById(`taskcontrol_right_${uin}`), 'Нет доступа', 0);
    addToDropdownOneOption(document.getElementById(`taskcontrol_right_${uin}`), 'Просмотр', 1);
    addToDropdownOneOption(document.getElementById(`taskcontrol_right_${uin}`), 'Редактирование', 2); 

    cellBtn.innerHTML = `<div class="button__control_dropdown-container button__control_modal-dropdown-taskcontrol" data-value="${uin}"></div>`;
}

taskcontrol_add_button.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"taskcontrol", "uinTask":`${uinTask_value}`, "uinuser":"", "acc":""};

    if(taskcontrol_add_user.value === "" || taskcontrol_add_right === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.uinuser = taskcontrol_add_user.value;
        body.acc     = taskcontrol_add_right.value;

        removeOptionsSetValue("select_add_taskcontrol_user", "Пользователь");
        removeOptionsSetValue("select_add_taskcontrol_right", "Право");
        addToDropdownOneOption(taskcontrol_add_right, 'Нет доступа', 0);
        addToDropdownOneOption(taskcontrol_add_right, 'Просмотр', 1);
        addToDropdownOneOption(taskcontrol_add_right, 'Редактирование', 2); 
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetTaskcontrol(uinTask_value)}, 100);
    }
})