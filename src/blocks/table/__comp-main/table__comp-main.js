import {funcCommand, clearTableAll, funcProcessOnlyInfo, removeOptionsSetValue, addToDropdown} from '../../../js/common/common.js';
import {funcProcessInfoComponentsModalAdd, funcInfoComponentsOpenModal} from '../../modal/__info-comp/modal__info-comp.js';
import {funcInfoCatcTransferOpenModal} from '../../modal/__transfer-comp/modal__transfer-comp.js';
import {funcInfoComponentsTransferOpenModal} from '../../modal/__transfer-comp/modal__transfer-comp.js';
import {funcFoundComponents} from '../__comp-found/table__comp-found.js';
import {funcFoundPlusOpenModal} from '../../modal/__found-plus/modal__found-plus.js';
import {TreeBuilder} from '../../_tree/tree.js';

let found_select = document.getElementById("found_main_select");
let found_button = document.getElementById("found_main_button");
let found_button_modal = document.getElementById("found_main_button_modal_plus");

let uinCatc = null;

found_button.onclick = function(){
    funcFoundComponents("found_main_input", "found_main_select", "found_main_table", "tb_components_tree", "jstree_div", "component_name_");
}

found_button_modal.onclick = function(){
    funcFoundPlusOpenModal("found_main_table", "tb_components_tree", "jstree_div", "component_name_");
}

export const funcGetComponentsTree = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"catC", "count":"100"};
    funcCommand(body, funcProcessGetComponentsTree);

    removeOptionsSetValue("found_main_select", "-- Выберите тип --");
    addToDropdown(found_select, 'typelm_list');
}

const funcProcessGetComponentsTree = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Дерево:", respobj);

    const tree = new TreeBuilder('jstree_div', 'dirC', 'catC', funcGetComponentsTree, funcGetComponents, funcInfoCatcTransferOpenModal, ["contextmenu", "openall"]);
    tree.build(respobj.answ);
    let node = tree.get();
    uinCatc = node.getAttribute('data-id');
    localStorage.setItem("uincatC", uinCatc);

    document.getElementById('jstree_div').addEventListener('click', () => {
        let node = tree.get();
        uinCatc = node.getAttribute('data-id');
        localStorage.setItem("uincatC", uinCatc);
        
        funcGetComponents(uinCatc);
    })
}

/* каталог комплектующих */
export const funcGetComponents = (uin) => {
    let body  =  {"user":"demo", "meth":"view","obj":"dirC", "uin":`${uin}`, "count":"5000"};
    funcCommand(body, funcProcessGetComponents);
}

const funcProcessGetComponents = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Директория:", respobj);

    let tb_id = "tb_components_tree"
    clearTableAll(tb_id);

    let table = document.getElementById(tb_id);
    let row_head   = table.insertRow(-1);
    row_head.innerHTML = `<tr><td></td><td></td><td></td><td></td><td class="td td_buttons-control"><button class="button__control button__control_add-comp-tree" value="${uinCatc}"><img class="button__control__img" src="assets/images/plus.svg" alt=""></button></td></tr>`;

    for (let key in respobj.answ){
        let set    = respobj.answ[key];
        let name   = set.name;
        let fUnic  = set.fUnic;
        let typelm = set.typelm.name;
        let del    = set.del;
        let uin    = set.uin;
        addComponents(name, fUnic, typelm, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-component");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"components", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }

            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    let button_modal_component = document.querySelectorAll(".button__control_modal-component");
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

    let button_control_add_comp_tree = document.querySelector(".button__control_add-comp-tree");
    button_control_add_comp_tree.addEventListener("click", (elem) => {
        funcProcessInfoComponentsModalAdd(elem.value);
    })
}

const addComponents = (name, fUnic, typelm, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellInfo   = newRow.insertCell(0); cellInfo.classList   = "td";
    let cellFUnic  = newRow.insertCell(1); cellFUnic.classList  = "td";
    let cellName   = newRow.insertCell(2); cellName.classList   = "td";
    let cellTypelm = newRow.insertCell(3); cellTypelm.classList = "td";
    let cellBtn    = newRow.insertCell(4); cellBtn.classList    = "td";

    cellInfo.innerHTML = `<button class="button__control button__control_modal-component" value="${uin}"><img class="button__control__img" src="assets/images/info.svg"></button>`;
    fUnic === 1 ? cellFUnic.innerHTML = `<input class="checkbox" type="checkbox" id="chb_funic_${uin}" disabled checked><label for="chb_funic_${uin}"></label>` : 
                  cellFUnic.innerHTML = `<input class="checkbox" type="checkbox" id="chb_funic_${uin}" disabled><label for="chb_funic_${uin}"></label>`;
    cellName.innerHTML = `${name}`;
    cellName.id = `component_name_${uin}`;
    cellTypelm.innerHTML   = typelm;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel button__control_mdel-component${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button><button class="button__control button__control_transfer-component" value="${uin}" name="${name}"><img class="button__control__img" src="assets/images/moving.svg"></button>`;
}

document.getElementById("sort_components").addEventListener('change', function(){
    let option = this.selectedIndex;
    switch (option){
        case 0:
        let body0  =  {"user":"demo", "meth":"view", "obj":"catC", "count":"1000"};
        funcCommand(body0, funcProcessGetComponentsTree);
        break;
        case 1:
        let body1  =  {"user":"demo", "meth":"view", "obj":"catC", "count":"1000", "sort":"name"};
        funcCommand(body1, funcProcessGetComponentsTree);
        break;
        case 2:
        let body2  =  {"user":"demo", "meth":"view", "obj":"catC", "count":"1000", "asort":"name"};
        funcCommand(body2, funcProcessGetComponentsTree);
        break;
    }
});
