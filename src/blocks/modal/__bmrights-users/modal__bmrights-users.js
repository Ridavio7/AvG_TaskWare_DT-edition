import {funcCommand, funcProcessOnlyInfo, clearTable, insertDataInSelect, removeOptions, funcProcessOnlyConsole} from '../../../js/common/common.js';
import {dragElement, resizeModalWindow, closeModal, openModal} from '../modal.js';
import {DropdownButton} from '../../button/__control/_dropdown/button__control_dropdown.js';

let bmrights_users_modal = document.getElementById("bmrights_users_modal");
let bmrights_users_close = document.getElementById("bmrights_users_close");
let bmrights_users_title = document.getElementById("bmrights_users_title");
let bmrights_users_add_u = document.getElementById("bmrights_users_add_user");
let bmrights_users_add_b = document.getElementById('bmrights_users_add_button');
let modal_resize         = document.getElementById("bmrights_users_modal_resize");

let bmrightsUinForAdd = null;

closeModal(bmrights_users_modal, bmrights_users_close);

dragElement(bmrights_users_modal);
resizeModalWindow(modal_resize, "whModalBmrightsUsers", "Размеры окна пользователей в участке");

/* настройка размера окна */
const funcGetResize = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whModalBmrightsUsers", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResize)
}

const funcProcessGetResize = (result, respobj) => {
    modal_resize.style.width  = `${respobj.answ.val[0]}px`;
    modal_resize.style.height = `${respobj.answ.val[1]}px`;
}

export const funcInfoBmrightsUsersOpenModal = (uin, name) => {
    funcGetResize();
    openModal(bmrights_users_modal);

    bmrights_users_title.innerHTML = name;
    bmrightsUinForAdd = uin;

    funcGetInfoBmrightsUsers(uin);
}

const funcGetInfoBmrightsUsers = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"bmrights", "uinright":`${uin}`, "count":"100"}
    funcCommand(body, funcProcessGetInfoBmrightsUsers);
}

const funcProcessGetInfoBmrightsUsers = (result, respobj) => {
    console.log("Права закладки:", respobj.answ);

    removeOptions(bmrights_users_add_u);
    insertDataInSelect(bmrights_users_add_u, 'Выберите вкладку', '', "bmlist_list");

    let tb_id = "bmrights_users_tb_modal";
    clearTable(tb_id);

    if(respobj.answ === ''){
        clearTable(tb_id);
    } else {
        for (let i in respobj.answ){
            let obj   = respobj.answ[i];
            let name  = obj.name;
            let uin   = obj.uin;
            let uinbm = obj.uinbm;
            let del   = obj.del;

            addInfoBmrightsUsers(name, uin, uinbm, del, tb_id);
        }
    }

    /* функция полного удаления */
    const funcFullDelElem = (uin) => {
        let result = confirm("Вы действительно хотите полностью удалить пользователя с участка?");
        if(result){
            let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"fulldel", "obj":"bmrights", "uin":`${uin}`};
            
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(() => {funcGetInfoBmrightsUsers(bmrightsUinForAdd)}, 100);
        }
    }

    /* функция добавления */
    bmrights_users_add_b.onclick = () => {
        let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"bmrights", "uinright":`${bmrightsUinForAdd}`, "uinbm":""};

        if(bmrights_users_add_u.value === ""){
            alert("Вы не заполнили все поля!");
        } else {
            body.uinbm = bmrights_users_add_u.value;
        }

        funcCommand(body, funcProcessOnlyConsole);
        setTimeout(function(){funcGetInfoBmrightsUsers(bmrightsUinForAdd)}, 100);
    }

    /* кнопки выпадающие списки */
    document.querySelectorAll(".button__control_modal-dropdown-bmrights-users").forEach((elem) => {
        new DropdownButton(elem, '', [
            { text: 'Удалить', action: () => funcFullDelElem(elem.getAttribute("data-value")) }
        ], 'assets/images/three_dot.svg');
    })
}

const addInfoBmrightsUsers = (name, uin, uinbm, del, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow   = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellUser = newRow.insertCell(0); cellUser.classList = "td";
    let cellBtn  = newRow.insertCell(1); cellBtn.classList  = "td td_buttons-control";

    cellUser.innerHTML = name;
    cellBtn.innerHTML = `<div class="button__control_dropdown-container button__control_modal-dropdown-bmrights-users" data-value="${uin}"></div>`;
}