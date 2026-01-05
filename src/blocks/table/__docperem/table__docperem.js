import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, findForUpdateSelect, makeSelect, clearTable, removeOptionsSetValue, sendFilt, listenCustomSelect, clearCustomSelect, addToDropdown, removeOptions} from '../../../js/common/common.js';
import {customSelect, customSortSelect} from '../../select/select.js';
import {funcInfoDocperemOpenModal} from '../../modal/__docperem/modal__docperem.js';

export const funcGetDocperem = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"docperem", "count":"1000", "sort":"date"};
    funcCommand( body, funcProcessGetDocperem );
}

const funcProcessGetDocperem = (result, respobj) => {
    console.log("Перемещения:", respobj);
    
    let tb_id = "tb_docperem";
    clearTable(tb_id);

    
    let select_storage1 = document.getElementById("select_add_docperem_storage1");
    removeOptions(select_storage1);
    addToDropdown(select_storage1, "storages_list");

    let select_storage2 = document.getElementById("select_add_docperem_storage2");
    removeOptions(select_storage2);
    addToDropdown(select_storage2, "storages_list");

    for (let key in respobj.answ) {
        let obj = respobj.answ[key];
        let numb     = obj.numb;
        let storage1 = obj.storage1;
        let storage2 = obj.storage2;
        let user     = obj.user;
        let status   = obj.status;
        let prim     = obj.prim;
        let date     = obj.date;
        let uin      = obj.uin;
        let del      = obj.del;
        addDocperemRow(numb, storage1, storage2, user, status, prim, date, uin, del, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-docperem");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"docperem", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-docperem");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"docperem", "numb":"", "date":"", "uinstorage1":"", "uinstorage2":"", "uinuser":"", "uinstatus":"", "prim":"", "uin":`${elem.value}` };

            let target_table = tb_docperem;
        
            body.numb        = findForUpdateInput(`docperem_num_${elem.value}`, target_table);
            body.date        = findForUpdateInput(`docperem_date_${elem.value}`, target_table);
            body.uinstorage1 = findForUpdateSelect(target_table, "docperem_storage1_select_", elem.value);
            body.uinstorage2 = findForUpdateSelect(target_table, "docperem_storage2_select_", elem.value);
            body.uinuser     = findForUpdateSelect(target_table, "docperem_user_select_", elem.value);
            body.uinstatus   = findForUpdateSelect(target_table, "docperem_status_select_", elem.value);
            body.prim        = findForUpdateInput(`docperem_prim_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(function(){funcGetDocperem()}, 100);
        })
    })

    let button_modal_enums = document.querySelectorAll(".button__control_modal-docperem");
    button_modal_enums.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoDocperemOpenModal(elem.value);
        })
    })
}

const addDocperemRow = (numb, storage1, storage2, user, status, prim, date, uin, del, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let ceelnumb     = newRow.insertCell(0); ceelnumb.classList     = "td td__text_align_center";
    let cellstatus   = newRow.insertCell(1); cellstatus.classList   = "td td__text_align_center";
    let cellstorage1 = newRow.insertCell(2); cellstorage1.classList = "td td_no-padding";
    let cellstorage2 = newRow.insertCell(3); cellstorage2.classList = "td td__text_align_center";
    let celluser     = newRow.insertCell(4); celluser.classList     = "td td__text_align_center";
    let celldate     = newRow.insertCell(5); celldate.classList     = "td td_no-padding";
    let cellprim     = newRow.insertCell(6); cellprim.classList     = "td td__text_align_center";
    let cellBtn      = newRow.insertCell(7); cellBtn.classList      = "td";

    ceelnumb.innerHTML = `<div class="button__control_wrapper"><button class="button__control button__control_modal-docperem" value="${uin}" name="${numb}"><img class="button__control__img" src="assets/images/info.svg" alt="" title="Инфо"></button><input class="input__type-text" type="text" value="${numb}" name="docperem_num_${uin}"></div>`;
    makeSelect("docperem_storage1_select_", uin, storage1.name, storage1.uin, "storages_list", "select", cellstorage1);
    makeSelect("docperem_storage2_select_", uin, storage2.name, storage2.uin, "storages_list", "select", cellstorage2);
    makeSelect("docperem_user_select_", uin, user.name, user.uin, "users_list", "select", celluser);
    makeSelect("docperem_status_select_", uin, status.name, status.uin, "statusdoc_list", "select", cellstatus);
    cellprim.innerHTML = `<input class="input__type-text" type="text" value="${prim}" name="docperem_prim_${uin}">`;
    celldate.innerHTML = `<div class="input__type-date_wrapper"><input class="input__type-text input__type-date" type="date" value="${date.split('T')[0]}" name="docperem_date_${uin}"><label for="" class="input__type-date_icon"><img src="assets/images/calendar.svg" alt=""></label></div>`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-docperem" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="" title="Обновить"></button><button class="button__control button__control_mdel button__control_mdel-docperem${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

document.querySelector(".button__control_add-docperem").addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"docperem", "uinstorage1":"", "uinstorage2":""};

    let uinstorage1_value = document.getElementById("select_add_docperem_storage1").value
    let uinstorage2_value = document.getElementById("select_add_docperem_storage2").value

    if(uinstorage1_value === "" || uinstorage2_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.uinstorage1 = uinstorage1_value;
        body.uinstorage2 = uinstorage2_value;
    
        removeOptionsSetValue("select_add_docperem_storage1", "Отправитель");
        removeOptionsSetValue("select_add_docperem_storage2", "Получатель");
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetDocperem()}, 100);
    }
})

customSortSelect("sort_docperem");
const dropdown = document.getElementById("sort_docperem");
const options  = dropdown.querySelectorAll('li');
options.forEach(option => {
    option.addEventListener('click', () => {
        options.forEach(elem => {
            elem.style.color = 'var(--font-color)';
        })
        
        switch (option.getAttribute('data-value')){
            case '1':
                let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"docperem", "count":"5000", "sort":"numb"};
                funcCommand(body1, funcProcessGetDocperem);
            break;
            case '2':
                let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"docperem", "count":"5000", "asort":"numb"};
                funcCommand(body2, funcProcessGetDocperem);
            break;
            case '3':
                let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"docperem", "count":"5000", "sort":"date"};
                funcCommand(body3, funcProcessGetDocperem);
            break;
            case '4':
                let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"docperem", "count":"5000", "asort":"date"};
                funcCommand(body4, funcProcessGetDocperem);
            break;
        }

        option.style.color = 'var(--font-color-modal-blue)';
        document.getElementById('modal-overlay').style.display = 'none';
    })
})