import {funcCommand, clearTableAll, clearTable, addToDropdownOneOption, addToDropdown, funcProcessOnlyInfo, removeOptions, makeSelect, findForUpdateSelect, findForUpdateInput, highlightButtonSave, highlightButtonSaveModal} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';
import {funcGetComponentsTreeSelect} from '../../modal/__select-comp/modal__select-comp.js';
import {funcGetDocpost} from '../../table/__provider/table__provider.js';
import {funcFoundOneComponent} from '../../table/__comp-found/table__comp-found.js';

let docpost_modal   = document.getElementById("modal_info_docpost");
let docpost_close   = document.getElementById("close_info_docpost");
let docpost_status  = document.getElementById("docpost_statdoc");
let docpost_user    = document.getElementById("docpost_user");
let docpost_prim    = document.getElementById("docpost_prim");
let docpost_numb    = document.getElementById("docpost_numb");
let docpost_date    = document.getElementById("docpost_date");
let docpost_numb1c  = document.getElementById("docpost_numb1c");
let docpost_date1c  = document.getElementById("docpost_date1c");
let docpost_contr   = document.getElementById("docpost_contr");
let docpost_storage = document.getElementById("docpost_storage");
let docpost_save    = document.getElementById("docpost_save");
let modal_select_component = document.getElementById("modal_select_component");

docpost_close.onclick = function(){
    docpost_modal.style.display = "none";
}

dragElement(docpost_modal);

export const funcInfoDocpostOpenModal = (uin) => {
    docpost_modal.style.display = "block";
    localStorage.setItem("docpost_uin", uin);

    setTimeout(function(){funcGetInfoInputsDocpost(uin)}, 100);
    setTimeout(function(){funcGetInfoTableDocpost(uin)}, 150);
}

const funcGetInfoInputsDocpost = (uin) => {
    let body_inputs  =  {"user":"demo", "meth":"view", "obj":"docpost", "count":"1", "filt":`[{"fld":"uin","val":["${uin}"]}]`};
    funcCommand(body_inputs, funcProcessGetInfoInputsDocpost);
}

const funcProcessGetInfoInputsDocpost = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Док. поступления 1:", respobj);

    removeOptions(docpost_status);
    removeOptions(docpost_user);
    removeOptions(docpost_storage);
    docpost_contr.value  = "";
    docpost_numb.value   = "";
    docpost_date.value   = "";
    docpost_numb1c.value = "";
    docpost_date1c.value = "";
    docpost_prim.value   = "";

    for (let key in respobj.answ){
        let obj = respobj.answ[key];
        let statdocName = obj.statdoc.name;
        let statdocUin  = obj.statdoc.uin;
        let numb        = obj.numb;
        let date        = obj.date;
        let numb1c      = obj.numb1c;
        let date1c      = obj.date1c;
        let contrName   = obj.contr.name;
        //let contrUin    = obj.contr.uin;
        let storageName = obj.storage.name;
        let storageUin  = obj.storage.uin;
        let userName    = obj.user.name;
        let userUin     = obj.user.uin;
        let prim        = obj.prim;
        addDocpostInfoInputs(statdocName, statdocUin, numb, date, numb1c, date1c, contrName, storageName, storageUin, userName, userUin, prim);
    }
}

const addDocpostInfoInputs = 
(statdocName, statdocUin, numb, date, numb1c, date1c, contrName, storageName, storageUin, userName, userUin, prim) => {
    addToDropdownOneOption(docpost_status, statdocName, statdocUin);
    addToDropdown(docpost_status, "statusdoc_list");
    addToDropdownOneOption(docpost_storage, storageName, storageUin);
    addToDropdown(docpost_storage, "storages_list");
    addToDropdownOneOption(docpost_user, userName, userUin);
    addToDropdown(docpost_user, "users_list");
    docpost_contr.value  = contrName;
    docpost_numb.value   = numb;
    docpost_date.value   = date;
    docpost_numb1c.value = numb1c;
    docpost_date1c.value = date1c;
    docpost_prim.value   = prim;
}

const funcGetInfoTableDocpost = (uin) => {
    let body_table  =  {"user":"demo", "meth":"view", "obj":"compontpost", "count":"100", "uindoc":`${uin}`};
    funcCommand(body_table, funcProcessGetInfoTableDocpost);
}

const funcProcessGetInfoTableDocpost = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Таблица док. поступления 1:", respobj);

    let tb_id = "tb_modal_docpost";
    clearTableAll(tb_id);

    for (let key in respobj.answ){
        let obj = respobj.answ[key];
        let name        = obj.name;
        let compontName = obj.compont.name;
        let compontUin  = obj.compont.uin;
        let measName    = obj.meas.name;
        let measUin     = obj.meas.uin;
        let storageName = obj.storage.name;
        let storageUin  = obj.storage.uin;
        let count       = obj.count;
        let del         = obj.del;
        let uin         = obj.uin;
        addDocpostInfoTable(name, compontName, compontUin, measName, measUin, storageName, storageUin, count, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-docpost");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"compontpost", "uin":`${elem.value}`};

            if(elem.style.background === "red"){
                elem.style.background = "inherit";
            } else {
                elem.style.background = "red"
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })
    
    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-docpost");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update", "obj":"compontpost", "uin":`${elem.value}`, "uincompont":"", "uinstorage":"", "uinmeas":"", "count":""};

            let target_table = tb_modal_docpost;
            body.uincompont  = document.getElementById(`docpost_component_${elem.value}`).value;
            body.uinmeas     = findForUpdateSelect(target_table, "docpost_meas_select_", elem.value);
            body.uinstorage  = findForUpdateSelect(target_table, "docpost_storage_select_", elem.value);
            body.count       = findForUpdateInput(`docpost_count_${elem.value}`, target_table);

            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
        })
    })

    let button_select_component = document.querySelectorAll(".button__select_docpost");
    button_select_component.forEach((elem) => {
        elem.addEventListener("click", () => {
            modal_select_component.style.display = "block";
            
            funcGetComponentsTreeSelect();
            funcFoundOneComponent(elem.name)
            localStorage.setItem("button_select_component_id", elem.id);
        })
    })
}

const addDocpostInfoTable = (name, compontName, compontUin, measName, measUin, storageName, storageUin, count, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName    = newRow.insertCell(0); cellName.classList    = "td";
    let cellCompont = newRow.insertCell(1); cellCompont.classList = "td";
    let cellCount   = newRow.insertCell(2); cellCount.classList   = "td";
    let cellMeas    = newRow.insertCell(3); cellMeas.classList    = "td";
    let cellStorage = newRow.insertCell(4); cellStorage.classList = "td";
    let cellBtn     = newRow.insertCell(5); cellBtn.classList     = "td";

    cellName.innerHTML = name;
    if(compontName === ''){
        cellCompont.innerHTML = `<button class="button__select button__select_docpost" id="docpost_component_${uin}" value="${compontUin}" name="">-- Выбрать --</button>`;
    } else {
        cellCompont.innerHTML = `<button class="button__select button__select_docpost" id="docpost_component_${uin}" value="${compontUin}" name="${compontName}">${compontName}</button>`;
    }

    makeSelect("docpost_meas_select_", uin, measName, measUin, "meas_list", "select", cellMeas);
    makeSelect("docpost_storage_select_", uin, storageName, storageUin, "storages_list", "select", cellStorage);
    cellCount.innerHTML = `<input class="input__type-text" type="text" value="${count}" name="docpost_count_${uin}">`;

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update-docpost" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg"></button><button class="button__control button__control_mdel-docpost" style="background:${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

/* функция обновления поставки */
docpost_save.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"update", "obj":"docpost","uin":"", "numb":"", "date":"", "prim":"", "uinstatus":"", "uinuser":"", "uinstorage":""};

    body.uin        = localStorage.getItem("docpost_uin");
    body.numb       = docpost_numb.value;
    body.date       = docpost_date.value;
    body.prim       = docpost_prim.value;
    body.uinstatus  = docpost_status.value;
    body.uinuser    = docpost_user.value;
    body.uinstorage = docpost_storage.value;

    funcCommand(body, funcProcessOnlyInfo);

    setTimeout(function(){
        let button_control_update = document.querySelectorAll(".button__control_update-docpost");
        button_control_update.forEach((elem) => {
            elem.click();
        })
    }, 100);

    
    setTimeout(function(){funcGetInfoInputsDocpost(localStorage.getItem("docpost_uin"))}, 100);
    setTimeout(function(){funcGetInfoTableDocpost(localStorage.getItem("docpost_uin"))}, 150);
    setTimeout(function(){clearTableAll("tb_docpost")}, 200);
    setTimeout(function(){funcGetDocpost()}, 250);
})