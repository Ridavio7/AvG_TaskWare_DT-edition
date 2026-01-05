import {funcCommand, funcProcessOnlyInfo, clearTable, highlightButtonSave, responseProcessor, makeSelect, addToDropdownOneOption, removeOptionsSetValue} from '../../../js/common/common.js';

export const funcGetWebopt = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"webopt", "count":"100", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetWebopt);
}

const funcProcessGetWebopt = (result, respobj) => {
    console.log("Настр.польз:", respobj);

    let tb_id = "tb_settings_user";
    clearTable(tb_id);

    for (let key in respobj.answ){
        let obj   = respobj.answ[key];
        let name  = obj.name;
        let descr = obj.descr;
        let show  = obj.show;
        let fmode = obj.fmode;
        let val   = obj.val;
        let del   = obj.del;
        let uin   = obj.uin;
        addWeboptRow(name, descr, show, fmode, val, del, uin, tb_id);
    }

    /* функция обновления */
    document.querySelectorAll(".button__control_update-settings-user").forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"webopt", "name":`${elem.name}`, "descr":"", "show":"", "fmode":"", "val":"", "uin":`${elem.value}`, "uinuser":`${localStorage.getItem('user_uin')}`};

            let element = document.getElementById(`setting_user_${elem.value}`);
            if(element.type === 'text' || element.type === 'number'){
                body.val = `[${element.value}]`;
            } else if(element.type === 'checkbox'){
                body.val = element.checked === true ? '1' : '0';
            }

            body.name  = document.getElementById(`setting_user_name_${elem.value}`).value;
            body.descr = document.getElementById(`setting_user_descr_${elem.value}`).value;
            body.show  = document.getElementById(`setting_user_show_${elem.value}`).checked === true ? '1' : '0';
            body.fmode  = document.getElementById(`setting_user_fmod__${elem.value}`).value;
        
            console.log(body)
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetWebopt()}, 100);
        })
    })

    document.getElementById('button__control_save_settings_user').onclick = () => {
        let button_control_update = document.querySelectorAll(".button__control_update-settings-user");
        button_control_update.forEach((elem) => {elem.click()})
    }
}

const addWeboptRow = (name, descr, show, fmode, val, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName  = newRow.insertCell(0); cellName.classList  = "td";
    let cellDescr = newRow.insertCell(1); cellDescr.classList = "td";
    let cellShow  = newRow.insertCell(2); cellShow.classList  = "td";
    let cellFmod  = newRow.insertCell(3); cellFmod.classList  = "td td_no-padding";
    let cellVal   = newRow.insertCell(4); cellVal.classList   = "td";
    let cellBtn   = newRow.insertCell(5); cellBtn.classList   = "td";

    cellName.innerHTML  = `<input class="input__type-text input__type-text_modal" type="text" id="setting_user_name_${uin}" name="${name}" value="${name}">`;
    cellDescr.innerHTML = `<input class="input__type-text input__type-text_modal" type="text" id="setting_user_descr_${uin}" name="${name}" value="${descr}">`;
    cellShow.innerHTML  = `<input class="checkbox" type="checkbox" id="setting_user_show_${uin}" name="${name}" value="${val}"><label for="setting_user_show_${uin}"></label>`;
    cellShow.firstChild.checked = show === 1 ? true : false;

    if(fmode === 0){
        makeSelect("setting_user_fmod_", uin, 'Булево', 0, "", "select", cellFmod);
        cellVal.innerHTML = `<input class="checkbox" type="checkbox" id="setting_user_${uin}" name="${name}" value="${val}"><label for="setting_user_${uin}"></label>`;
        cellVal.firstChild.checked = val === 1 ? true : false;
    } else if(fmode === 1){
        makeSelect("setting_user_fmod_", uin, 'Строка', 1, "", "select", cellFmod);
        cellVal.innerHTML = `<input class="input__type-text input__type-text_modal" type="text" id="setting_user_${uin}" name="${name}" value="${val}">`;
    } else if(fmode === 2){
        makeSelect("setting_user_fmod_", uin, 'Число', 2, "", "select", cellFmod);
        cellVal.innerHTML = `<input class="input__type-text input__type-text_modal" type="number" id="setting_user_${uin}" name="${name}" value="${val}">`;
    } else if(fmode === 3) {
        makeSelect("setting_user_fmod_", uin, 'Массив чисел', 3, "", "select", cellFmod);
        cellVal.innerHTML = `<input class="input__type-text input__type-text_modal" type="text" id="setting_user_${uin}" name="${name}" value="${val}">`;
    }
    addToDropdownOneOption(document.getElementById(`setting_user_fmod__${uin}`), 'Булево', 0);
    addToDropdownOneOption(document.getElementById(`setting_user_fmod__${uin}`), 'Строка', 1);
    addToDropdownOneOption(document.getElementById(`setting_user_fmod__${uin}`), 'Число', 2);
    addToDropdownOneOption(document.getElementById(`setting_user_fmod__${uin}`), 'Массив чисел', 3);

    cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML  = `<button class="button__control button__control_update button__control_update-settings-user" value="${uin}" name="${name}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="" title="Обновить"></button>`;
}

/* функция добавления */
document.querySelector(".button__control_add-webopt").addEventListener("click", (elem) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"webopt", "name":"", "descr":"", "show":"", "fmode":"", "val":"", "uinuser":`${localStorage.getItem('user_uin')}`};

    body.name  = document.getElementById('setting_user_name_add').value;
    body.descr = document.getElementById('setting_user_descr_add').value;
    body.show  = document.getElementById('setting_user_show_add').checked === true ? '1' : '0';
    body.fmode = document.getElementById('setting_user_fmod_add').value;
    body.val   = document.getElementById('setting_user_val_add').value;

    document.getElementById('setting_user_name_add').value = '';
    document.getElementById('setting_user_descr_add').value = '';
    document.getElementById('setting_user_show_add').checked = false;
    removeOptionsSetValue("setting_user_fmod_add", "Выберите вид");
    document.getElementById('setting_user_val_add').value = '';

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetWebopt()}, 100);
})