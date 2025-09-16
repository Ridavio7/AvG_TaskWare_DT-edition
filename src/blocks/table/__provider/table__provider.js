import {funcCommand, funcProcessOnlyInfo, clearTableAll, sendFilt, clearCustomSelect, listenCustomSelect, responseProcessor, formatDate} from '../../../js/common/common.js';
import {funcInfoDocpostOpenModal} from '../../modal/__docpost/modal__docpost.js';
import {customSelect, customSortSelect} from '../../select/select.js';
import {funcInfoDocpostSubstdocOpenModal} from '../../modal/__docpost-substdoc/modal__docpost-substdoc.js';

export const funcGetDocpost = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"docpost", "count":"10000"};
    funcCommand(body, funcProcessGetDocpost);
}

export const funcProcessGetDocpost = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    console.log("Док. поступления:", respobj);

    let tb_id = "tb_docpost";
    clearTableAll(tb_id);

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
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"docpost", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
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

    let cellInfo        = newRow.insertCell(0);  cellInfo.classList        = "td td_nowrap-content"; cellInfo.style.width = "150px";
    //let cellStatdocName = newRow.insertCell(1);  cellStatdocName.classList = "td";
    let cellNumb        = newRow.insertCell(1);  cellNumb.classList        = "td";
    let cellDate        = newRow.insertCell(2);  cellDate.classList        = "td";
    let cellNumb1c      = newRow.insertCell(3);  cellNumb1c.classList      = "td";
    let cellDate1c      = newRow.insertCell(4);  cellDate1c.classList      = "td";
    let cellContrName   = newRow.insertCell(5);  cellContrName.classList   = "td"; cellContrName.style.width = "300px";
    let cellStorageName = newRow.insertCell(6);  cellStorageName.classList = "td";
    let cellUserName    = newRow.insertCell(7);  cellUserName.classList    = "td";
    let cellPrim        = newRow.insertCell(8);  cellPrim.classList        = "td";
    let cellBtn         = newRow.insertCell(9); cellBtn.classList          = "td";

    const statusConfig = {
        "Готов": "ready",
        "Обработка": "process",
        "Новый": "new"
    }

    const suffix = statusConfig[statdocName] || "";
    const className = suffix ? ` button__control_docpost-${suffix}` : "";
    const imgClassName = suffix ? ` button__control_docpost-${suffix}_img` : "";

    cellInfo.innerHTML = `
        <button class="button__control button__control_modal-docpost${className}" value="${uin}">
            <img class="button__control__img${imgClassName}" src="assets/images/info.svg" alt="" title="Инфо">
        </button>
        ${statdocName || ""}
    `.trim();

    //cellStatdocName.innerHTML = statdocName;
    cellNumb.innerHTML        = numb;
    cellDate.innerHTML        = formatDate(date).split(' ')[1];
    cellNumb1c.innerHTML      = numb1c;
    cellDate1c.innerHTML      = formatDate(date1c).split(' ')[1];
    cellContrName.innerHTML   = contrName;
    cellStorageName.innerHTML = storageName;
    cellUserName.innerHTML    = userName;
    cellPrim.innerHTML        = prim;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel button__control_mdel-docpost${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

customSortSelect("sort_docpost");
const dropdown = document.getElementById("sort_docpost");
const options  = dropdown.querySelectorAll('li');
options.forEach(option => {
    option.addEventListener('click', () => {
        switch (option.getAttribute('data-value')){
            case '1':
                let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"docpost", "count":"10000", "asort":"numb1c", "filt":`${JSON.stringify(filt_docpost)}`};
                funcCommand(body1, funcProcessGetDocpost);
            break;
            case '2':
                let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"docpost", "count":"10000", "sort":"numb1c", "filt":`${JSON.stringify(filt_docpost)}`};
                funcCommand(body2, funcProcessGetDocpost);
            break;
            case '3':
                let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"docpost", "count":"10000", "sort":"date1c", "filt":`${JSON.stringify(filt_docpost)}`};
                funcCommand(body3, funcProcessGetDocpost);
            break;
            case '4':
                let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"docpost", "count":"10000", "asort":"date1c", "filt":`${JSON.stringify(filt_docpost)}`};
                funcCommand(body4, funcProcessGetDocpost);
            break;
        }
    })
})

customSelect('docpost_contr_customDropdown', JSON.parse(localStorage.getItem("contragents_list")), 'контрагента');
customSelect('docpost_status_customDropdown', JSON.parse(localStorage.getItem("statusdoc_list")), 'статус');

let filt_docpost = [], val_1 = [], val_2 = [],
filt_1 = {fld: "uincontr"}, filt_2 = {fld: "uinstatus"};

listenCustomSelect("docpost_contr_customDropdown", filt_1, val_1, filt_docpost);
listenCustomSelect("docpost_status_customDropdown", filt_2, val_2, filt_docpost);

document.getElementById("button_docpost_choose").addEventListener("click", () => {
    sendFilt(filt_docpost, 'tb_docpost', 'docpost', funcProcessGetDocpost);
})

document.getElementById("button_docpost_reset").addEventListener("click", () => {
    filt_docpost.length = 0;
    clearCustomSelect('docpost_contr_customDropdown', 'контрагента');
    clearCustomSelect('docpost_status_customDropdown', 'статус');
    funcGetDocpost();
})

document.getElementById("founddoc_button").onclick = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"founddoc", "obj":"docpost", "count":"10000", "name":"", "filt":`${JSON.stringify(filt_docpost)}`};
    body.name = document.getElementById('founddoc_name').value;
    funcCommand(body, funcProcessGetDocpost);
}

document.getElementById("founddoc_reset_button").onclick = () => {
    funcGetDocpost();
    document.getElementById('founddoc_name').value = '';
    clearCustomSelect('docpost_contr_customDropdown', 'контрагента');
    clearCustomSelect('docpost_status_customDropdown', 'статус');
}

document.getElementById('docpost_substdoc_button').onclick = () => {
    funcInfoDocpostSubstdocOpenModal();
}