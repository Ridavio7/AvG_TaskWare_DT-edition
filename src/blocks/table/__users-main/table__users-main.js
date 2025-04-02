import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave} from '../../../js/common/common.js';
import {funcInfoUserOpenModal} from '../../modal/__users/modal__users.js';

export const funcGetUsers = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"users", "count":"100"};
    funcCommand(body, funcProcessGetUsers);
}

const funcProcessGetUsers = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Пользователи:", respobj);

    let tb_id = "tb_users";
    clearTable(tb_id);

    let users_list = respobj.answ;
    localStorage.setItem("users_list", JSON.stringify(users_list));

    for (let key in respobj.answ){
        let obj   = respobj.answ[key];
        let num   = +key + 1;
        let name  = obj.name;
        let job   = obj.job.name;
        let email = obj.email;
        let phone = obj.phone;
        let del   = obj.del;
        let uin   = obj.uin;
        addUsersRow(num, name, job, email, phone, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-users-main");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"users", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    let button_modal = document.querySelectorAll(".button__control_modal-users-main");
    button_modal.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoUserOpenModal(elem.value);
        })
    })
}

const addUsersRow = (num, name, job, email, phone, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellInfo  = newRow.insertCell(0); cellInfo.classList  = "td td__text_align_center";
    let cellNum   = newRow.insertCell(1); cellNum.classList   = "td td__text_align_center";
    let cellName  = newRow.insertCell(2); cellName.classList  = "td";
    let cellJob   = newRow.insertCell(3); cellJob.classList   = "td";
    let cellEmail = newRow.insertCell(4); cellEmail.classList = "td";
    let cellPhone = newRow.insertCell(5); cellPhone.classList = "td td__text_align_center";
    let cellBtn   = newRow.insertCell(6); cellBtn.classList   = "td";

    cellInfo.innerHTML  = `<button class="button__control button__control_modal-users-main" value="${uin}"><img class="button__control__img" src="assets/images/info.svg" alt=""></button>`;
    cellNum.innerHTML   = num;
    cellName.innerHTML  = name;
    cellJob.innerHTML   = job;
    cellEmail.innerHTML = email;
    cellPhone.innerHTML = phone;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel button__control_mdel-users-main${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

listenSortSelect("sort_users", "tb_users", "users", funcProcessGetUsers);