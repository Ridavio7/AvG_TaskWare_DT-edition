import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, responseProcessor} from '../../../js/common/common.js';
import {funcInfoUserOpenModal} from '../../modal/__users/modal__users.js';
import {customSortSelect} from '../../select/select.js';

export const funcGetUsers = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"users", "count":"100"};
    funcCommand(body, funcProcessGetUsers);
}

const funcProcessGetUsers = (result, respobj) => {
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
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"users", "uin":`${elem.value}`};

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

    let cellNum   = newRow.insertCell(0); cellNum.classList   = "td td_nowrap-content td__text_align_center";
    let cellName  = newRow.insertCell(1); cellName.classList  = "td";
    let cellJob   = newRow.insertCell(2); cellJob.classList   = "td";
    let cellEmail = newRow.insertCell(3); cellEmail.classList = "td";
    let cellPhone = newRow.insertCell(4); cellPhone.classList = "td td__text_align_center";
    let cellBtn   = newRow.insertCell(5); cellBtn.classList   = "td";

    cellNum.innerHTML   = `<button class="button__control button__control_modal-users-main" value="${uin}"><img class="button__control__img" src="assets/images/info.svg" alt=""></button>&nbsp; ${num}`;
    cellName.innerHTML  = name;
    cellJob.innerHTML   = job;
    cellEmail.innerHTML = email;
    cellPhone.innerHTML = phone;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel button__control_mdel-users-main${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

customSortSelect("sort_users");
const dropdown = document.getElementById("sort_users");
const options  = dropdown.querySelectorAll('li');
options.forEach(option => {
    option.addEventListener('click', () => {
        switch (option.getAttribute('data-value')){
            case '1':
                let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"users", "count":"5000", "sort":"name"};
                funcCommand(body1, funcProcessGetUsers);
            break;
            case '2':
                let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"users", "count":"5000", "asort":"name"};
                funcCommand(body2, funcProcessGetUsers);
            break;
            case '3':
                let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"users", "count":"5000", "sort":"uin"};
                funcCommand(body3, funcProcessGetUsers);
            break;
            case '4':
                let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"users", "count":"5000", "asort":"uin"};
                funcCommand(body4, funcProcessGetUsers);
            break;
        }
    })
})