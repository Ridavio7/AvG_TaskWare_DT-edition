import {funcCommand, funcProcessOnlyInfo, removeOptions, addToDropdown, addToDropdownOneOption, clearTableAll} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';
import {funcGetUsers} from '../../table/__users-main/table__users-main.js';

let user_modal  = document.getElementById("user_modal");
let user_close  = document.getElementById("user_close");
let user_name   = document.getElementById("user_name");
let user_job    = document.getElementById("user_job");
let user_email  = document.getElementById("user_email");
let user_phone  = document.getElementById("user_phone");
let user_login  = document.getElementById("user_login");
let user_pass_f = document.getElementById("user_pass_first");
let user_pass_s = document.getElementById("user_pass_second");
let user_save   = document.getElementById("user_save");
let user_add    = document.getElementById("user_add");
let user_table  = document.getElementById("tb_user_rights");

let log_pass_change = 0;

user_close.onclick = function(){
    user_modal.style.display = "none";
}

dragElement(user_modal);

/* открытие инфо мод. окна пользователя */
export const funcInfoUserOpenModal = (uin) => {
    user_modal.style.display  = "block";

    user_save.style.display = "flex";
    user_add.style.display  = "none";
    user_login.parentElement.parentElement.style.display = "block";
    user_table.parentElement.style.display = "block";

    funcGetRightsUsersInfo();
    setTimeout(function(){funcGetUserInfo(uin)}, 100);
}

/* права для мод. окна пользователя */
const funcGetRightsUsersInfo = () => {
    let body = {"user":"demo", "meth":"view", "obj":"rights", "count":"100"};
    funcCommand(body, funcProcessGetRightsUsersInfo);
}

const funcProcessGetRightsUsersInfo = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Права:", respobj);

    let tb_id = "tb_user_rights";
    clearTableAll(tb_id);

    for (let key in respobj.answ){
        let obj   = respobj.answ[key];
        if(obj.del === 0){
            let name  = obj.name;
            let uin   = obj.uin;
            addRightsUsersInfo(name, uin, tb_id);
        }
    }
}

const addRightsUsersInfo = (name, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellCheckbox  = newRow.insertCell(0); cellCheckbox.classList  = "td";
    let cellRightname = newRow.insertCell(1); cellRightname.classList = "td";

    cellCheckbox.innerHTML  = `<input class="checkbox" type="checkbox" id="right_${uin}" value="${uin}"><label for="right_${uin}"></label>`;
    cellRightname.innerHTML = name;
}

/* инфо пользователя в мод. окне */
const funcGetUserInfo = (uin) => {
    let body = {"user":"demo", "meth":"view", "obj":"users", "count":"1", "filt":`[{"fld":"uin","val":["${uin}"]}]`};
    funcCommand(body, funcProcessGetUserInfo);
}

const funcProcessGetUserInfo = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Пользователь:", respobj);

    user_name.value  = "";
    user_email.value = "";
    user_phone.value = "";
    removeOptions(user_job);

    let obj     = respobj.answ[0];
    let name    = obj.name;
    let jobName = obj.job.name;
    let jobUin  = obj.job.uin;
    let email   = obj.email;
    let phone   = obj.phone;
    let rights  = obj.rights;
    let uin     = obj.uin;

    addUserInfo(name, jobName, jobUin, email, phone, rights, uin);
}

const addUserInfo = (name, jobName, jobUin, email, phone, rights, uin) => {
    user_name.value  = name;
    user_email.value = email;
    user_phone.value = phone;
    user_save.value  = uin;
    addToDropdownOneOption(user_job, jobName, jobUin);
    addToDropdown(user_job, "jobs_list");

    for(let key in rights){
        let obj  = rights[key];
        let uin  =  obj.uin;
    
        let checkbox = document.getElementById(`right_${uin}`);
        checkbox === null ? alert("Одно из установленных прав пользователя удалено! Снимите пометку удаления права!") : checkbox.checked = true;
    }
}

user_login.addEventListener("change", () => {
    log_pass_change += 1;
})

user_pass_f.addEventListener("change", () => {
    log_pass_change += 1;
})

user_pass_s.addEventListener("change", () => {
    log_pass_change += 1;
})

/* функция обновления пользователи */
user_save.addEventListener("click", (evt) => {
    let body1  =  {"user":"demo", "meth":"update", "obj":"users", "uin":`${evt.currentTarget.value}`, "name":"", "rights":"", "uinjob":"", "email":"", "phone":""};

    body1.name   = user_name.value;
    body1.uinjob = user_job.value;
    body1.email  = user_email.value;
    body1.phone  = user_phone.value;

    let checkboxs = user_modal.getElementsByClassName("checkbox");
    let arr_rights = [];

    for(let chb in checkboxs){
        if(checkboxs[chb].checked === true){
            arr_rights.push(+checkboxs[chb].value);
        }
    }
    body1.rights = `[${arr_rights}]`;

    funcCommand(body1, funcProcessOnlyInfo);
    setTimeout(function(){funcGetUsers()}, 100);

    let body2 = { "user":"demo", "meth":"update", "obj":"uslog", "log":"", "psw1":"", "psw2":"", "uinuser":`${evt.currentTarget.value}`};

    if(user_pass_f.value != user_pass_s.value){
        alert("Введенные пароли не совпадают!");
    } else if(log_pass_change > 0) {
        console.log(log_pass_change);
        body2.log  = user_login.value;
        body2.psw1 = user_pass_f.value;
        body2.psw2 = user_pass_s.value;

        funcCommand(body2, funcProcessOnlyInfo);

        log_pass_change = 0;
    } else {
        console.log(log_pass_change);
    }
})

/* открытие добавления мод. окна пользователя */
let button__control_add = document.querySelector(".button__control_add-users-main");
button__control_add.addEventListener("click", () => {
    user_modal.style.display  = "block";

    user_add.style.display  = "flex";
    user_save.style.display = "none";
    user_login.parentElement.parentElement.style.display = "none";
    user_table.parentElement.style.display = "none";

    funcProcessInfoUserOpenModalAdd();
    setTimeout(function(){funcGetRightsUsersInfo()}, 100);
})

function funcProcessInfoUserOpenModalAdd(){
    user_name.value   = "";
    user_email.value  = "";
    user_phone.value  = "";
    user_login.value  = "";
    user_pass_f.value = "";
    user_pass_s.value = "";
    removeOptions(user_job)
    addToDropdownOneOption(user_job, "---", "");
    addToDropdown(user_job, "jobs_list");
}

user_add.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"add", "obj":"users", "name":"", "rights":"", "uinjob":"", "email":"", "phone":""};

    if(user_name.value === "" && user_job.value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name   = user_name.value;
        body.uinjob = user_job.value;
        body.email  = user_email.value;
        body.phone  = user_phone.value;
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetUsers()}, 100);
        setTimeout(function(){user_modal.style.display  = "none"}, 150);
    }
})