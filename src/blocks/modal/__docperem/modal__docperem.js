import {funcCommand, clearTable, formatDate, clearTableAll, funcProcessOnlyInfo, highlightButtonSave, funcProcessOnlyConsole, findForUpdateInput, addToDropdownOneOption, addToDropdown, removeOptions} from '../../../js/common/common.js';
import {dragElement, resizeModalWindow, openModal, closeModal} from '../modal.js';
import {funcGetProductsTreeSelect} from '../__select-prod/modal__select-prod.js';
import {funcGetComponentsTreeSelect} from '../__select-comp/modal__select-comp.js';
import {funcFoundOneComponent} from '../../table/__comp-found/table__comp-found.js';
import {funcGetDocperem} from '../../table/__docperem/table__docperem.js';

let docperem_modal    = document.getElementById("docperem_modal");
let docperem_close    = document.getElementById("docperem_close");
let docperem_title    = document.getElementById("docperem_title");
let modal_resize      = document.getElementById("docperem_modal_resize");
let docperem_num      = document.getElementById("docperem_num");
let docperem_status   = document.getElementById("docperem_status");
let docperem_storage1 = document.getElementById("docperem_storage1");
let docperem_storage2 = document.getElementById("docperem_storage2");
let docperem_user     = document.getElementById("docperem_user");
let docperem_date     = document.getElementById("docperem_date");
let docperem_time     = document.getElementById("docperem_time");
let docperem_prim     = document.getElementById("docperem_prim");
let docperem_save     = document.getElementById('docperem_save');

let docperem_uin = null;

closeModal(docperem_modal, docperem_close);

dragElement(docperem_modal);
resizeModalWindow(modal_resize, "whModalDocperem", "Размеры окна документов перемещения");

/* настройка размера окна */
const funcGetResize = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whModalDocperem", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResize)
}

const funcProcessGetResize = (result, respobj) => {
    modal_resize.style.width  = `${respobj.answ.val[0]}px`;
    modal_resize.style.height = `${respobj.answ.val[1]}px`;
}

export const funcInfoDocperemOpenModal = (uin) => {
    funcGetResize();
    openModal(docperem_modal);

    funcGetInfoDocperem(uin);
}

const funcGetInfoDocperem = (uin) => {
    docperem_uin  = uin;

    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"viewInside", "obj":"docperem", "uin":`${uin}`}
    funcCommand(body, funcProcessGetInfoDocperem);
}

const funcProcessGetInfoDocperem = (result, respobj) => {
    console.log("Док. перемещения:", respobj);

    removeOptions(docperem_storage1);
    removeOptions(docperem_storage2);
    removeOptions(docperem_status);
    removeOptions(docperem_user);

    let numb         = respobj.numb;
    let storage1Uin  = respobj.storage1.uin;
    let storage1Name = respobj.storage1.name;
    let storage2Uin  = respobj.storage2.uin;
    let storage2Name = respobj.storage2.name;
    let userUin      = respobj.user.uin;
    let userName     = respobj.user.name;
    let statusUin    = respobj.status.uin;
    let statusName   = respobj.status.name;
    let prim         = respobj.prim;
    let date         = respobj.date;
    let uin          = respobj.uin;
    let del          = respobj.del;
    addDocperemInfo(numb, storage1Uin, storage1Name, storage2Uin, storage2Name, userUin, userName, statusUin, statusName, prim, date, uin, del);

    ///////////////////////////////////////

    let tb_id_prod = 'docperem_tb_prod';
    clearTable(tb_id_prod);

    for (let key in respobj.insP){
        let obj    = respobj.insP[key];
        let namepr = obj.product.name;
        let uinpr  = obj.product.uin;
        let count  = obj.count;
        let uin    = obj.uin;
        let del    = obj.del;
        addProducts(namepr, uinpr, count, uin, del, tb_id_prod);
    }

    /* функция удаления */
    let button_control_mdel_product = document.querySelectorAll(".button__control_mdel_docperem_prod");
    button_control_mdel_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"productperem", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })
    
    /* функция обновления */
    let button_control_update_product = document.querySelectorAll(".button__control_update_docperem_prod");
    button_control_update_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"productperem", "uin":`${elem.value}`, "uinproduct":"", "count":"100"};
            body.count = findForUpdateInput(`docperem_prod_count_${elem.value}`, docperem_tb_prod);
            body.uinproduct = document.getElementById(`docperem_select_prod_${elem.value}`).value;
            funcCommand(body, funcProcessOnlyInfo);

            highlightButtonSave(elem);
            setTimeout(function(){funcGetInfoDocperem(docperem_uin)}, 100);
        })
    })

    /* выбор изделия */
    let button_select_prod = document.querySelectorAll(".button__select_docperem_prod");
    button_select_prod.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcGetProductsTreeSelect();
            localStorage.setItem("button_select_product_id", elem.id);
        })
    })

    /////////////////////////////////

    let tb_id_comp = 'docperem_tb_comp';
    clearTable(tb_id_comp)
    for (let key in respobj.insC){
        let obj    = respobj.insC[key];
        let namepr = obj.compont.name;
        let uinpr  = obj.compont.uin;
        let count  = obj.count;
        let uin    = obj.uin;
        let del    = obj.del;
        addComponentsType(namepr, uinpr, count, uin, del, tb_id_comp);
    }

    /* функция удаления */
    let button_control_mdel_comp = document.querySelectorAll(".button__control_mdel_docperem_comp");
    button_control_mdel_comp.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"compontperem", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })
    
    /* функция обновления */
    let button_control_update_comp = document.querySelectorAll(".button__control_update_docperem_comp");
    button_control_update_comp.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"compontperem", "uin":`${elem.value}`, "uincompont":"", "count":"100"};
            body.count = findForUpdateInput(`docperem_comp_count_${elem.value}`, docperem_tb_comp);
            body.uincompont = document.getElementById(`docperem_select_comp_${elem.value}`).value;
            funcCommand(body, funcProcessOnlyInfo);

            highlightButtonSave(elem);
            setTimeout(function(){funcGetInfoDocperem(docperem_uin)}, 100);
        })
    })

    /* выбор комлпектующего */
    let button_select_component = document.querySelectorAll(".button__select_docperem_comp");
    button_select_component.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcGetComponentsTreeSelect();
            setTimeout(() => {
                funcFoundOneComponent(elem.name)
            }, 300)
            localStorage.setItem("button_select_component_id", elem.id);
            modal_select_component.style.display = "block";
        })
    })
}

const addDocperemInfo = (numb, storage1Uin, storage1Name, storage2Uin, storage2Name, userUin, userName, statusUin, statusName, prim, date, uin, del) => {
    docperem_title.innerHTML = `Документ перемещения № ${numb}`;
    docperem_num.value  = numb;
    docperem_prim.value = prim;
    docperem_date.value = date.split('T')[0];
    docperem_time.value = date.split('T')[1];

    addToDropdownOneOption(docperem_storage1, storage1Name, storage1Uin);
    addToDropdown(docperem_storage1, "storages_list");
    addToDropdownOneOption(docperem_storage2, storage2Name, storage2Uin);
    addToDropdown(docperem_storage2, "storages_list");
    addToDropdownOneOption(docperem_status, statusName, statusUin);
    addToDropdown(docperem_status, "statusdoc_list");
    addToDropdownOneOption(docperem_user, userName, userUin);
    addToDropdown(docperem_user, "users_list");
}

/* таблица изделия */
const addProducts = (namepr, uinpr, count, uin, del, tb_id_prod) => {
    let tableRef = document.getElementById(tb_id_prod);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellProduct = newRow.insertCell(0); cellProduct.classList = "td";
    let cellCount   = newRow.insertCell(1); cellCount.classList   = "td td__text_align_center";
    let cellBtn     = newRow.insertCell(2); cellBtn.classList     = "td";

    cellProduct.innerHTML = `<button class="button__select button__select_docperem_prod" id="docperem_select_prod_${uin}" value="${uinpr}" name="${namepr}">${namepr}</button>`;
    cellCount.innerHTML = `<input class="input__type-text input__type-text__small" type="text" value="${count}" name="docperem_prod_count_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update_docperem_prod" value="${uin}" name="${uinpr}"><img class="button__control__img" src="assets/images/arrow_3.svg" title="Обновить"></button>
                        <button class="button__control button__control_mdel button__control_mdel_docperem_prod${bx_color}" value="${uin}" name=""><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

/* добавление изделия */
document.getElementById('button_control_docperem_add_prod').onclick = () => {
    let prod_value = document.getElementById("button_select_docperem_product");
    let count_value   = document.getElementById("input_docperem_add_prod");

    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"add",  "obj":"productperem", "uindoc":`${docperem_uin}`, "uinproduct":"", "count":""}

    if(prod_value.value === "" || count_value.value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.uinproduct = prod_value.value;
        body.count      = count_value.value;
    
        prod_value.innerText = "Сбор. ед.";
        prod_value.value     = "";
        count_value.value    = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetInfoDocperem(docperem_uin)}, 100);
    }
}

/* таблица комлпектующего */
const addComponentsType = (namepr, uinpr, count, uin, del, tb_id_comp) => {
    let tableRef = document.getElementById(tb_id_comp);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr tr_mark";

    let cellProduct = newRow.insertCell(0); cellProduct.classList = "td";
    let cellCount   = newRow.insertCell(1); cellCount.classList   = "td td__text_align_center";
    let cellBtn     = newRow.insertCell(2); cellBtn.classList     = "td";

    cellProduct.innerHTML = `<button class="button__select button__select_docperem_comp" id="docperem_select_comp_${uin}" value="${uinpr}" name="${namepr}">${namepr}</button>`;
    cellCount.innerHTML = `<input class="input__type-text input__type-text__small" type="text" value="${count}" name="docperem_comp_count_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update_docperem_comp" value="${uin}" name="${uinpr}"><img class="button__control__img" src="assets/images/arrow_3.svg" title="Обновить"></button>
                        <button class="button__control button__control_mdel button__control_mdel_docperem_comp${bx_color}" value="${uin}" name=""><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

/* добавление комлпектующего */
document.getElementById('button_control_docperem_add_comp').onclick = () => {
    let comp_value = document.getElementById("button_select_docperem_comp");
    let count_value   = document.getElementById("input_docperem_add_comp");

    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"add",  "obj":"compontperem", "uindoc":`${docperem_uin}`, "uincompont":"", "count":""}

    if(comp_value.value === "" || count_value.value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.uincompont = comp_value.value;
        body.count      = count_value.value;
    
        comp_value.innerText = "Комплектующее";
        comp_value.value     = "";
        count_value.value    = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetInfoDocperem(docperem_uin)}, 100);
    }
}

docperem_save.onclick = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"docperem", "uin":`${docperem_uin}`, "numb":"", "date":"", "uinstorage1":"", "uinstorage2":"", "uinuser":"", "prim":"", "uinstatus":""};

    body.numb        = docperem_num.value;
    body.date        = `${docperem_date.value}T${docperem_time.value}`;
    body.uinstorage1 = docperem_storage1.value;
    body.uinstorage2 = docperem_storage2.value;
    body.uinuser     = docperem_user.value;
    body.prim        = docperem_prim.value;
    body.uinstatus   = docperem_status.value;

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetInfoDocperem(docperem_uin)}, 100);
    setTimeout(function(){funcGetDocperem()}, 200);
}