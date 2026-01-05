import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, highlightButtonSave, makeSelect, addToDropdown, removeOptionsSetValue, findForUpdateSelect} from '../../../js/common/common.js';
import {customSortSelect} from '../../select/select.js';

export const funcGetTechproc = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"techproc", "count":"100", "sort":"numb"};
    funcCommand(body, funcProcessGetTechproc);
}

const funcProcessGetTechproc = (result, respobj) => {
    console.log("Тех.процесс:", respobj);

    let tb_id = "tb_techproc";
    clearTable(tb_id);

    let select_storage = document.getElementById("select_add_techproc_storage");
    addToDropdown(select_storage, "storages_list");
    
    let select_move = document.getElementById("select_add_techproc_move");
    addToDropdown(select_move, "moves_list");

    let techproc_list = respobj.answ;
    localStorage.setItem("techproc_list", JSON.stringify(techproc_list));
    for (let key in respobj.answ){
        let obj         = respobj.answ[key];
        let name        = obj.name;
        let nameStorage = obj.storage.name;
        let uinStorage  = obj.storage.uin;
        let nameMove    = obj.move.name;
        let uinMove     = obj.move.uin;
        let del         = obj.del;
        let uin         = obj.uin;
        addTechprocRow(name, nameStorage, uinStorage, nameMove, uinMove, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-techproc");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"techproc", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-techproc");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"techproc", "name":"", "uin":`${elem.value}`, "uinstorage":"", "uinmove":""};

            let target_table = tb_techproc;
            body.name       = findForUpdateInput(`techproc_name_${elem.value}`, target_table);
            body.uinstorage = findForUpdateSelect(target_table, "techproc_storage_select_", elem.value);
            body.uinmove    = findForUpdateSelect(target_table, "techproc_move_select_", elem.value);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetTechproc()}, 100);
        })
    })
}

const addTechprocRow = (name, nameStorage, uinStorage, nameMove, uinMove, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName     = newRow.insertCell(0); cellName.classList     = "td td__text_align_center";
    let cellStorage  = newRow.insertCell(1); cellStorage.classList  = "td td_no-padding";
    let cellMove     = newRow.insertCell(2); cellMove.classList     = "td td_no-padding";
    let cellBtn      = newRow.insertCell(3); cellBtn.classList      = "td td_no-padding";

    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="techproc_name_${uin}">`;
    makeSelect("techproc_storage_select_", uin, nameStorage, uinStorage, "storages_list", "select", cellStorage);
    makeSelect("techproc_move_select_", uin, nameMove, uinMove, "moves_list", "select", cellMove);

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-techproc" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="" title="Обновить"></button><button class="button__control button__control_mdel button__control_mdel-techproc${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

let button_control_add_product = document.querySelector(".button__control_add-techproc");
button_control_add_product.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"techproc", "name":"", "uinstorage":"", "uinmove":""};

    let name_value    = document.getElementById("input_add_techproc_name").value;
    let storage_value = document.getElementById("select_add_techproc_storage").value;
    let move_value    = document.getElementById("select_add_techproc_move").value;

    if(name_value === "" || storage_value === "" || move_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;
        body.uinstorage = storage_value;
        body.uinmove = move_value;

        document.getElementById("input_add_techproc_name").value = "";
        removeOptionsSetValue("select_add_techproc_storage", "Выберите склад");
        removeOptionsSetValue("select_add_techproc_move", "Выберите тип");

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetTechproc()}, 100);
    }
})

customSortSelect("sort_techproc");
const dropdown = document.getElementById("sort_techproc");
const options  = dropdown.querySelectorAll('li');
options.forEach(option => {
    option.addEventListener('click', () => {
        options.forEach(elem => {
            elem.style.color = 'var(--font-color)';
        })

        switch (option.getAttribute('data-value')){
            case '1':
                let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"techproc", "count":"5000", "asort":"numb"};
                funcCommand(body1, funcProcessGetTechproc);
            break;
            case '2':
                let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"techproc", "count":"5000", "sort":"numb"};
                funcCommand(body2, funcProcessGetTechproc);
            break;
        }

        option.style.color = 'var(--font-color-modal-blue)';
        document.getElementById('modal-overlay').style.display = 'none';
    })
})