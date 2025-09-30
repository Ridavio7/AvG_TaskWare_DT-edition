import {funcCommand, funcProcessOnlyInfo, removeOptions, addToDropdown, addToDropdownOneOption, clearTableAll, makeSelect, togglePassword, validateForm, responseProcessor} from '../../../js/common/common.js';
import {dragElement, resizeModalWindow} from '../modal.js';
import {showNotification} from '../__notification/modal__notification.js';
import {funcGetUsers} from '../../table/__users-main/table__users-main.js';

let user_modal    = document.getElementById("user_modal");
let user_close    = document.getElementById("user_close");
let user_name     = document.getElementById("user_name_modal");
let user_name_t   = document.getElementById("user_name_title");
let user_job      = document.getElementById("user_job");
let user_email    = document.getElementById("user_email");
let user_phone    = document.getElementById("user_phone");
let user_login    = document.getElementById("user_login");
let user_pass_f   = document.getElementById("user_pass_first");
let user_pass_s   = document.getElementById("user_pass_second");
let user_save     = document.getElementById("user_save");
let user_add      = document.getElementById("user_add");
let user_table    = document.getElementById("tb_user_rights");
let user_faccprof = document.getElementById("user_faccprof");
let user_accprof  = document.getElementById("user_accprof");
let modal_resize  = document.getElementById("user_modal_resize");

let log_pass_change = 0;

user_close.onclick = function(){
    user_modal.style.display = "none";

    user_pass_f.value = '';
    user_pass_s.value = '';
}

user_close.ontouchend = (e) => {
    e.preventDefault();
    user_modal.style.display = "none";

    user_pass_f.value = '';
    user_pass_s.value = '';
}

dragElement(user_modal);
resizeModalWindow(modal_resize, "whModalUser", "Размеры окна пользователя");

/* настройка размера окна */
const funcGetResize = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whModalUser", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResize)
}

const funcProcessGetResize = (result, respobj) => {
    modal_resize.style.width  = `${respobj.answ.val[0]}px`;
    modal_resize.style.height = `${respobj.answ.val[1]}px`;
}

/* открытие инфо мод. окна пользователя */
export const funcInfoUserOpenModal = (uin) => {
    funcGetResize();
    user_modal.style.display  = "block";

    user_save.style.display = "flex";
    user_add.style.display  = "none";
    user_login.parentElement.parentElement.style.display = "block";
    user_table.parentElement.style.display = "table";

    funcGetRightsUsersInfo();
    setTimeout(function(){funcGetUserInfo(uin)}, 100);
}

/* права для мод. окна пользователя */
const funcGetRightsUsersInfo = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"rights", "count":"100", "sort":"uin"};
    funcCommand(body, funcProcessGetRightsUsersInfo);
}

const funcProcessGetRightsUsersInfo = (result, respobj) => {
    console.log("Права:", respobj);

    let tb_id = "tb_user_rights";
    clearTableAll(tb_id);

    for (let key in respobj.answ){
        let obj   = respobj.answ[key];
        if(obj.del === 0){
            let name = obj.name;
            let uin  = obj.uin;
            addRightsUsersInfo(name, uin, tb_id);
        }
    }
}

const addRightsUsersInfo = (name, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellRightName = newRow.insertCell(0); cellRightName.classList = "td td_font-color-active";
    let cellRightAcc  = newRow.insertCell(1); cellRightAcc.classList  = "td td__text_align_center";

    cellRightName.innerHTML = name;
    if(name === 'Полные права' || name === 'Удаление помеченных'){
        cellRightAcc.innerHTML  = `<input class="checkbox user-right__for-find" type="checkbox" id="right_${uin}" value="${uin}"><label for="right_${uin}"></label>`;
    } else {
        makeSelect("right", uin, '---', ' ', '', "select select__user-right user-right__for-find", cellRightAcc);
        document.getElementById(`right_${uin}`).setAttribute('data-value', uin);
        addToDropdownOneOption(document.getElementById(`right_${uin}`), 'Нет доступа', 0);
        addToDropdownOneOption(document.getElementById(`right_${uin}`), 'Просмотр', 1);
        addToDropdownOneOption(document.getElementById(`right_${uin}`), 'Редактирование', 2);
    }
}

/* инфо пользователя в мод. окне */
const funcGetUserInfo = (uin) => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"users", "count":"1", "filt":`[{"fld":"uin","val":["${uin}"]}]`};
    funcCommand(body, funcProcessGetUserInfo);
}

const funcProcessGetUserInfo = (result, respobj) => {
    console.log("Пользователь:", respobj);

    user_name_t.innerHTML = "";
    user_name.value       = "";
    user_email.value      = "";
    user_phone.value      = "";
    removeOptions(user_job);
    removeOptions(user_accprof);

    let obj         = respobj.answ[0];
    let name        = obj.name;
    let jobName     = obj.job.name;
    let jobUin      = obj.job.uin;
    let email       = obj.email;
    let phone       = obj.phone;
    let rights      = obj.rights;
    let login       = obj.log;
    let fpsw        = obj.fpsw;
    let faccprof    = obj.faccprof;
    let accprofName = obj.accprof.name;
    let accprofUin  = obj.accprof.uin;
    let uin         = obj.uin;

    addUserInfo(name, jobName, jobUin, email, phone, rights, login, fpsw, faccprof, accprofName, accprofUin, uin);
}

const addUserInfo = (name, jobName, jobUin, email, phone, rights, login, fpsw, faccprof, accprofName, accprofUin, uin) => {
    user_login.parentElement.style.display  = "flex";
    user_pass_f.parentElement.style.display = "flex";
    user_pass_s.parentElement.style.display = "flex";

    user_name_t.innerHTML = name;
    user_name.value       = name;
    user_email.value      = email;
    user_phone.value      = phone;
    user_login.value      = login;
    user_save.value       = uin;
    addToDropdownOneOption(user_job, jobName, jobUin);
    addToDropdown(user_job, "jobs_list");
    addToDropdownOneOption(user_accprof, accprofName, accprofUin);
    addToDropdown(user_accprof, "prof_list");

    if(fpsw === 1){user_pass_f.value = 'password'; user_pass_s.value = 'password';}
    if(faccprof === 1){
        user_faccprof.checked = true;
        user_accprof.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
    } else {
        user_faccprof.checked = false;
        user_accprof.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    }

    for(let key in rights){
        let obj  = rights[key];
        let name = obj.name;
        let acc  = obj.acc;
        let uin  = obj.uin;
    
        let right = document.getElementById(`right_${uin}`);
        if(name === 'Полные права' || name === 'Удаление помеченных'){
            right.checked = acc === '0' ? false : true;
        } else {
            let acc_name;
            if(acc === 0){
                acc_name = 'Нет доступа'
            } else if(acc === 1){
                acc_name = 'Просмотр'
            } else if(acc === 2){
                acc_name = 'Редактирование'
            }
            right.options[ right.selectedIndex ].textContent = acc_name;
            right.options[ right.selectedIndex ].value       = acc;
        }
    }

    /*if(document.getElementById(`right_5`).checked === true){
        let selects = document.querySelectorAll('.select__user-right');
        for(let i=0; i<selects.length; i++) selects[i].disabled = true;
    }*/
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
    let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"users", "uin":`${evt.currentTarget.value}`, "name":"", "rights":"", "uinjob":"", "email":"", "phone":"", "faccprof":"", "uinaccprof":""};

    validateForm('user_name_modal', 'user_email', 'user_phone').then(result => {
        if(result === true){
            body1.name   = user_name.value;
            body1.uinjob = user_job.value;
            body1.email  = user_email.value;
            body1.phone  = user_phone.value;
            body1.faccprof = user_faccprof.checked === true ? "1" : "0";
            body1.uinaccprof = user_accprof.value;
            body1.rights = `${JSON.stringify(searchUserRights())}`;

            if(user_faccprof.checked === true){
                if(user_accprof.value == 0){
                    alert('Вы выбрали "Аккаунт участка", но не выбрали сам участок!');
                } else {
                    funcCommand(body1, funcProcessOnlyInfo);
                    setTimeout(function(){funcGetUsers()}, 100);
                }
            } else {
                funcCommand(body1, funcProcessOnlyInfo);
                setTimeout(function(){funcGetUsers()}, 100);
            }
        } else {
            showNotification('error', 'Ошибка!', 'Произошла ошибка при выполнении.');
        }
    })

    let body2 = { "user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"uslog", "log":"", "psw1":"", "psw2":"", "uinuser":`${evt.currentTarget.value}`};

    if(user_pass_f.value != user_pass_s.value){
        alert("Введенные пароли не совпадают!");
    } else if(log_pass_change > 0) {
        body2.log  = user_login.value;
        body2.psw1 = user_pass_f.value;
        body2.psw2 = user_pass_s.value;

        funcCommand(body2, funcProcessOnlyInfo);

        log_pass_change = 0;
    }
})

/* открытие добавления мод. окна пользователя */
let button__control_add = document.querySelector(".button__control_add-users-main");
button__control_add.addEventListener("click", () => {
    user_modal.style.display  = "block";

    user_add.style.display  = "flex";
    user_save.style.display = "none";

    funcProcessInfoUserOpenModalAdd();
    setTimeout(function(){funcGetRightsUsersInfo()}, 100);
})

function funcProcessInfoUserOpenModalAdd(){
    user_name.value   = "";
    user_email.value  = "";
    user_phone.value  = "";
    removeOptions(user_job)
    addToDropdownOneOption(user_job, "Выберите должность", "");
    addToDropdown(user_job, "jobs_list");
    user_faccprof.checked = false;
    user_accprof.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    removeOptions(user_accprof)
    addToDropdownOneOption(user_accprof, "Выберите участок", "");
    addToDropdown(user_accprof, "prof_list");

    user_login.parentElement.style.display  = "none";
    user_pass_f.parentElement.style.display = "none";
    user_pass_s.parentElement.style.display = "none";
}

user_add.onclick = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"users", "name":"", "rights":"", "uinjob":"", "email":"", "phone":"", "faccprof":"", "uinaccprof":""};

    validateForm('user_name_modal', 'user_email', 'user_phone').then(result => {
        if(result === true){
            body.name   = user_name.value;
            body.uinjob = user_job.value;
            body.email  = user_email.value;
            body.phone  = user_phone.value;
            body.faccprof = user_faccprof.checked === true ? "1" : "0";
            body.uinaccprof = user_accprof.value;
            body.rights = `${JSON.stringify(searchUserRights())}`;

            if(user_faccprof.checked === true){
                if(user_accprof.value == ""){
                    alert('Вы выбрали "Аккаунт участка", но не выбрали сам участок!');
                } else {
                    funcCommand(body, funcProcessOnlyInfo);
                    setTimeout(function(){funcGetUsers()}, 100);
                    setTimeout(function(){user_modal.style.display  = "none"}, 150);
                }
            } else {
                funcCommand(body, funcProcessOnlyInfo);
                setTimeout(function(){funcGetUsers()}, 100);
                setTimeout(function(){user_modal.style.display  = "none"}, 150);
            }
        } else {
            console.log('Ошибка валидации полей!');
        }
    })
}

const searchUserRights = () => {
    let user_rights = document.querySelectorAll('.user-right__for-find');
    let rights = [];

    for(let elem of user_rights){
        let data_right = {};

        if(elem.tagName === 'INPUT'){
            if(elem.checked === true){
                data_right.uin = elem.value;
                data_right.acc = '1';
            }
        } else {
            if(elem.value !== ' '){
                data_right.uin = elem.dataset.value;
                data_right.acc = elem.value;
            }
        }

        if(Object.keys(data_right).length > 0) rights.push(data_right);
    }

    return rights;
}

document.getElementById('user_pass_first_toggle').addEventListener('click', (elem) => togglePassword(elem, 'user_pass_first'));
document.getElementById('user_pass_second_toggle').addEventListener('click', (elem) => togglePassword(elem, 'user_pass_second'));

user_faccprof.addEventListener('change', (elem) => {
    elem.target.checked === true
    ? elem.target.parentElement.nextElementSibling.classList.remove("modal__input-wrapper_display-none")
    : elem.target.parentElement.nextElementSibling.classList.add("modal__input-wrapper_display-none")
})