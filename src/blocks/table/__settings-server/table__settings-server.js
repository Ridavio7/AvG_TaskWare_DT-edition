import {funcCommand, funcProcessOnlyInfo, clearTable, highlightButtonSave, responseProcessor} from '../../../js/common/common.js';

export const funcGetSysopt = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"sysopt", "count":"100"};
    funcCommand(body, funcProcessGetSysopt);
}

const funcProcessGetSysopt = (result, respobj) => {
    console.log("Настр.сервера:", respobj);

    let tb_id = "tb_settings_server";
    clearTable(tb_id);

    for (let key in respobj.answ){
        let obj   = respobj.answ[key];
        let name  = obj.name;
        let descr = obj.descr;
        let fmode = obj.fmode;
        let val   = obj.val;
        let del   = obj.del;
        let uin   = obj.uin;
        addSysoptRow(name, descr, fmode, val, del, uin, tb_id);
    }

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-settings-server");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"sysopt", "name":"", "uin":`${elem.value}`, "val":""};

            let element = document.getElementById(`setting_server__${elem.value}`);
            if(element.type === 'text' || element.type === 'number'){
                body.val = element.value;
            } else if(element.type === 'checkbox'){
                body.val = element.checked === true ? '1' : '0';
            }

            body.name = element.name;
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetSysopt()}, 100);
        })
    })

    document.getElementById('button__control_save_settings_server').onclick = () => {
        let button_control_update = document.querySelectorAll(".button__control_update-settings-server");
        button_control_update.forEach((elem) => {
            elem.click();
        })
    }
}

const addSysoptRow = (name, descr, fmode, val, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellText = newRow.insertCell(0); cellText.classList  = "td input__type-text__label";
    let cellElem = newRow.insertCell(1); cellElem.classList  = "td td__text_align_center";
    let cellBtn  = newRow.insertCell(2); cellBtn.classList   = "td td__text_align_center";

    if(fmode === 0){
        cellText.innerHTML = descr;
        cellElem.innerHTML = `<input class="checkbox" type="checkbox" id="setting_server__${uin}" name="${name}" value="${val}"><label for="setting_server__${uin}"></label>`;
        cellElem.firstChild.checked = val === 1 ? true : false;
    } else if(fmode === 1){
        cellText.innerHTML = `<label class="input__type-text__label" for="setting_server__${uin}">${descr}</label>`;
        cellElem.innerHTML = `<input class="input__type-text input__type-text_modal" type="text" id="setting_server__${uin}" name="${name}" value="${val}">`;
    } else if(fmode === 2){
        cellText.innerHTML = `<label class="input__type-text__label" for="setting_server__${uin}">${descr}</label>`;
        cellElem.innerHTML = `<input class="input__type-text input__type-text_modal" type="number" id="setting_server__${uin}" name="${name}" value="${val}">`;
    }

    cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML  = `<button class="button__control button__control_update button__control_update-settings-server" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="" title="Обновить"></button>`;
}