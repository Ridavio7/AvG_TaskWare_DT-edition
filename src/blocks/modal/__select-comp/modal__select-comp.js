import {funcCommand, clearTableAll, addToDropdown, removeOptionsSetValue, responseProcessor} from '../../../js/common/common.js.js';
import {dragElement} from '../modal.js';
import {funcProcessInfoComponentsModalAdd} from '../__info-comp/modal__info-comp.js';
import {funcFoundComponents, funcFoundComponents1C} from '../../table/__comp-found/table__comp-found.js';
import {funcFoundPlusOpenModal} from '../__found-plus/modal__found-plus.js';
import {funcInfoComponentsOpenModal} from '../__info-comp/modal__info-comp.js';
import {funcInfoComponentsTransferOpenModal} from '../__transfer-comp/modal__transfer-comp.js';
import {TreeBuilder} from '../../_tree/tree.js';

let modal_select_comp = document.getElementById("modal_select_component");
let span_select_comp  = document.getElementById("close_component_select");

let uinCatc = null;

span_select_comp.onclick = () => {
    document.getElementById('modal_select_component_tree').innerHTML = '';
    modal_select_comp.style.display = "none";
    removeOptionsSetValue("found_select", "-- Выберите тип --");
}

dragElement(modal_select_comp);

let found_select       = document.getElementById("found_select");
let found_button       = document.getElementById("found_button");
let found_1c_button    = document.getElementById("found_1c_button");
let found_button_modal = document.getElementById("found_button_modal_plus");

found_button.onclick = function(){
    funcFoundComponents("found_input", "found_select", "found_table", "tb_component_select", "modal_select_component_tree", "select_component_name_");
}

found_1c_button.onclick = function(){
    funcFoundComponents1C("found_1c_input", "found_table", "tb_component_select", "modal_select_component_tree", "select_component_name_");
}

found_button_modal.onclick = function(){
    funcFoundPlusOpenModal("found_table", "tb_component_select", "modal_select_component_tree", "select_component_name_");
}

export const funcGetComponentsTreeSelect = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catC", "count":"100"};
    funcCommand(body, funcProcessGetComponentsTreeSelect);

    removeOptionsSetValue("found_select", "-- Выберите тип --");
    addToDropdown(found_select, 'typelm_list');
}

function funcProcessGetComponentsTreeSelect(result, respobj){
    //responseProcessor(result, respobj.succ);

    const tree = new TreeBuilder('modal_select_component_tree', 'dirC', 'catC', funcGetComponentsTreeSelect, funcGetDirC, '', ["openall"]);
    tree.build(respobj.answ);
}

export const funcGetDirC = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view","obj":"dirC", "uin":`${uin}`, "count":"5000" };
    funcCommand(body, funcProcessGetComponentsSelect);
}

function funcProcessGetComponentsSelect(result, respobj){
    //responseProcessor(result, respobj.succ);

    let tb_id = "tb_component_select";
    clearTableAll(tb_id);
    
    let tableRef       = document.getElementById(tb_id);
    let row_head       = tableRef.insertRow(0);
    row_head.innerHTML = `<tr class="tr"><td></td><td></td><td></td><td></td><td class="td td_buttons-control"><button class="button__control button__control_add-comp-select" value="${uinCatc}"><img class="button__control__img" src="assets/images/plus.svg" alt=""></button></td></tr>`;

    let button_control_add_comp_tree = document.querySelector(".button__control_add-comp-select");
    button_control_add_comp_tree.addEventListener("click", (elem) => {
        funcProcessInfoComponentsModalAdd(elem.value);
    })

    for (let key in respobj.answ){
        let set    = respobj.answ[key];
        let name   = set.name;
        let typelm = set.typelm.name;
        let del    = set.del;
        let uin    = set.uin;
        addComponentsSelect(name, typelm, del, uin, tb_id);
    }

    let button_control_select_component = document.querySelectorAll(".button__control_select-component");
    button_control_select_component.forEach((elem) => {
        elem.addEventListener("click", () => {
            result = confirm("Подтверждаете выбор комплектующего?");
            if(result === true){
                modal_select_comp.style.display = "none";

                let button = document.getElementById(localStorage.getItem("button_select_component_id"));
                button.value     = elem.value;
                button.name      = elem.name;
                button.innerText = elem.name;
            }
            localStorage.removeItem("button_select_component_id");
        })
    })

    let button_modal_component = document.querySelectorAll(".button__control_modal-comp-info");
    button_modal_component.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoComponentsOpenModal(elem.value);
        })
    })

    let button_modal_transfer = document.querySelectorAll(".button__control_transfer-component");
    button_modal_transfer.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoComponentsTransferOpenModal(elem.value, elem.name);
        })
    })
}

function addComponentsSelect(name, typelm, del, uin, tb_id){
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellSelect = newRow.insertCell(0); cellSelect.classList = "td";
    let cellInfo   = newRow.insertCell(1); cellInfo.classList   = "td";
    let cellName   = newRow.insertCell(2); cellName.classList   = "td";
    let cellType   = newRow.insertCell(3); cellType.classList   = "td";
    let cellBtn    = newRow.insertCell(4); cellBtn.classList    = "td";

    if(del != 0){
        cellSelect.innerHTML = `<button class="button__control" disabled><img class="button__control__img" src="assets/images/plus.svg" alt=""></button>`;
    } else {
        cellSelect.innerHTML = `<button class="button__control button__control_select-component" value="${uin}" name="${name}"><img class="button__control__img" src="assets/images/plus.svg" alt=""></button>`;
    }

    cellInfo.innerHTML = `<button class="button__control button__control_modal-comp-info" value="${uin}"><img class="button__control__img" src="assets/images/info.svg"></button>`;

    cellName.innerHTML = `${name}`;
    cellName.id = `select_component_name_${uin}`;
    cellType.innerHTML = typelm;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel${bx_color}" disabled><img class="button__control__img" src="assets/images/cross.svg"></button><button class="button__control button__control_transfer-component" value="${uin}" name="${name}"><img class="button__control__img" src="assets/images/moving.svg"></button>`;
}