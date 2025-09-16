import {funcCommand, funcProcessOnlyInfo, clearTable, highlightButtonSave, findForUpdateSelect, insertDataInSelect, removeOptions, funcProcessOnlyConsole, makeSelect} from '../../../js/common/common.js';
import {dragElement, resizeModalWindow} from '../modal.js';

let prof_users_modal = document.getElementById("prof_users_modal");
let prof_users_close = document.getElementById("prof_users_close");
let prof_users_title = document.getElementById("prof_users_title");
let prof_users_add_u = document.getElementById("prof_users_add_user");
let prof_users_add_b = document.getElementById('prof_users_add_button');
let modal_resize     = document.getElementById("prof_users_modal_resize");

let profUinForAdd = null;

prof_users_close.onclick = () => {
    prof_users_modal.style.display = "none";
}

prof_users_close.ontouchend = (e) => {
    e.preventDefault();
    prof_users_modal.style.display = "none";
}

dragElement(prof_users_modal);
resizeModalWindow(modal_resize, "whModalProfUsers");

/* настройка размера окна */
const funcGetResize = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whModalProfUsers"};
    funcCommand(body, funcProcessGetResize)
}

const funcProcessGetResize = (result, respobj) => {
    modal_resize.style.width  = `${respobj.answ.val[0]}px`;
    modal_resize.style.height = `${respobj.answ.val[1]}px`;
}

export const funcInfoProfUsersOpenModal = (uin, name) => {
    funcGetResize();
    prof_users_modal.style.display = "block";
    prof_users_title.innerHTML = name;

    profUinForAdd = uin;
    funcGetInfoProfUsers(uin);
}

const funcGetInfoProfUsers = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"prof", "filt":`[{"fld":"uin", "val":["${uin}"]}]`, "count":"100", "sort":"uin"}
    funcCommand(body, funcProcessGetInfoProfUsers);
}

const funcProcessGetInfoProfUsers = (result, respobj) => {
    console.log("Польз. участка:", respobj.answ);

    removeOptions(prof_users_add_u);
    insertDataInSelect(prof_users_add_u, 'Выберите пользователя', '0', "users_list");

    let tb_id = "prof_users_tb_modal";
    clearTable(tb_id);

    if(respobj.answ === ''){
        clearTable(tb_id);
    } else {
        for (let i in respobj.answ){
            let obj  = respobj.answ[i];
            let arr_users = obj.users;
            let uin_prof  = obj.uin;

            for(let j in arr_users){
                let user = arr_users[j];
                let name = user.name;
                let uin  = user.uin;
                addInfoProfUsers(uin_prof, name, uin, tb_id);
            }
        }
    }

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-prof-users");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcAddAndUpdate(elem.value);
        })
    })

    /* функция добавления */
    let button_control_add = document.getElementById('prof_users_add_button');
    button_control_add.onclick = () => {
        funcAddAndUpdate(profUinForAdd);
    }
}

const funcAddAndUpdate = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"prof", "uin":`${uin}`, "users":""};

    let target_table = prof_users_tb_modal;
    let arr_users_uin = [];

    let selects = target_table.querySelectorAll('.select');
    selects.forEach((el) => {
    if(el.value != 0){
            arr_users_uin.push(el.value);
        }
    })
    body.users = `[${arr_users_uin}]`;
    
    funcCommand(body, funcProcessOnlyConsole);
    setTimeout(function(){funcGetInfoProfUsers(uin)}, 100);
}

const addInfoProfUsers = (uin_prof, name, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow   = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellUser = newRow.insertCell(0); cellUser.classList = "td";
    let cellBtn  = newRow.insertCell(1); cellBtn.classList  = "td";

    makeSelect("prof_user_select_", uin, name, uin, "users_list", "select", cellUser);

    cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-prof-users" value="${uin_prof}" name="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="" title="Обновить"></button>`;
}