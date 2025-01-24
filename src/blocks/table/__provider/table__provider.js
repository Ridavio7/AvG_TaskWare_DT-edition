import {funcCommand, funcProcessOnlyInfo, clearTable} from '../../../js/common/common.js';
import {funcInfoDocpostOpenModal} from '../../modal/__docpost/modal__docpost.js';

export const funcGetDocpost = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"docpost", "count":"100"};
    funcCommand(body, funcProcessGetDocpost);
}

const funcProcessGetDocpost = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Док. поступления:", respobj);

    let tb_id = "tb_docpost";
    clearTable(tb_id);

    for (let key in respobj.answ){
        let obj = respobj.answ[key];
        let statdocName = obj.statdoc.name;
        let numb        = obj.numb;
        let date        = obj.date;
        let numb1c      = obj.numb1c;
        let date1c      = obj.date1c;
        let contrName   = obj.contr.name;
        let storageName = obj.storage.name;
        let userName    = obj.user.name;
        let prim        = obj.prim;
        let del         = obj.del;
        let uin         = obj.uin;
        addDocpostRow(statdocName, numb, date, numb1c, date1c, contrName, storageName, userName, prim, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel_docpost = document.querySelectorAll(".button__control_mdel-docpost");
    button_control_mdel_docpost.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"docpost", "uin":`${elem.value}`};

            if(elem.style.background === "red"){
                elem.style.background = "inherit";
            } else {
                elem.style.background = "red"
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    let button_modal = document.querySelectorAll(".button__control_modal-docpost");
    button_modal.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoDocpostOpenModal(elem.value);
        })
    })
}

const addDocpostRow = 
(statdocName, numb, date, numb1c, date1c, contrName, storageName, userName, prim, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellInfo        = newRow.insertCell(0);  cellInfo.classList        = "td";
    let cellStatdocName = newRow.insertCell(1);  cellStatdocName.classList = "td";
    let cellNumb        = newRow.insertCell(2);  cellNumb.classList        = "td";
    let cellDate        = newRow.insertCell(3);  cellDate.classList        = "td";
    let cellNumb1c      = newRow.insertCell(4);  cellNumb1c.classList      = "td";
    let cellDate1c      = newRow.insertCell(5);  cellDate1c.classList      = "td";
    let cellContrName   = newRow.insertCell(6);  cellContrName.classList   = "td";
    let cellStorageName = newRow.insertCell(7);  cellStorageName.classList = "td";
    let cellUserName    = newRow.insertCell(8);  cellUserName.classList    = "td";
    let cellPrim        = newRow.insertCell(9);  cellPrim.classList        = "td";
    let cellBtn         = newRow.insertCell(10); cellBtn.classList         = "td";

    cellInfo.innerHTML        = `<button class="button__control button__control_modal-docpost" value="${uin}"><img class="button__control__img" src="assets/images/info.svg" alt=""></button>`;
    cellStatdocName.innerHTML = statdocName;
    cellNumb.innerHTML        = numb;
    cellDate.innerHTML        = date;
    cellNumb1c.innerHTML      = numb1c;
    cellDate1c.innerHTML      = date1c;
    cellContrName.innerHTML   = contrName;
    cellStorageName.innerHTML = storageName;
    cellUserName.innerHTML    = userName;
    cellPrim.innerHTML        = prim;

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel-docpost" style="background:${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}