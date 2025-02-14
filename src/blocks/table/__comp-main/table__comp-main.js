import {funcCommand, clearTable, clearTableAll, funcProcessOnlyInfo, removeOptionsSetValue, addToDropdown} from '../../../js/common/common.js';
import {funcProcessInfoComponentsModalAdd, funcInfoComponentsOpenModal} from '../../modal/__info-comp/modal__info-comp.js';
import {funcInfoComponentsTransferOpenModal} from '../../modal/__transfer-comp/modal__transfer-comp.js';
import {funcFoundComponents} from '../__comp-found/table__comp-found.js';
import {funcFoundPlusOpenModal} from '../../modal/__found-plus/modal__found-plus.js';

let found_select = document.getElementById("found_main_select");
let found_button = document.getElementById("found_main_button");
let found_button_modal = document.getElementById("found_main_button_modal_plus");

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

    $('#jstree_div').jstree({
        core: {
            data: respobj.answ
        },
        "plugins" : [ "state", "unique", "contextmenu", "dnd" ],
    }).bind("loaded.jstree", function () {
        $(this).jstree("open_all");
    })

    $('#jstree_div').on('changed.jstree', function (e, data) {
        let objNode = data.instance.get_node(data.selected);
    
        let uin = objNode.id;
        localStorage.setItem("uincatC", uin);
    
        let tb_id = "tb_components_tree";
        clearTableAll(tb_id);
    
        let table = document.getElementById(tb_id);
        let row_head   = table.insertRow(-1);
        row_head.innerHTML = `<tr><td></td><td></td><td></td><td></td><td class="td td_buttons-control"><button class="button__control button__control_add-comp-tree" value="${uin}"><img class="button__control__img" src="assets/images/plus.svg" alt=""></button></td></tr>`;
    
        funcGetComponents(uin);
    
        funcMarkNode(respobj.answDop);

        let button_control_add_comp_tree = document.querySelector(".button__control_add-comp-tree");
        button_control_add_comp_tree.addEventListener("click", (elem) => {
            funcProcessInfoComponentsModalAdd(elem.value);
        })
    });

    $('#jstree_div').on('click.jstree', function (){
        funcMarkNode(respobj.answDop);
    });
}

/* пометка папки */
const funcMarkNode = (arr) => {
    for(let i in arr){
        let id  = arr[i].id;
        let del = arr[i].del;
    
        if(del === 1){
            let node = document.getElementById(`${id}_anchor`);
            if(node != null){
                node.style.color = "red";
            }
        }
    }
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
    clearTable(tb_id);

    for (let key in respobj.answ){
        let set = respobj.answ[key];
        let name = set.name;
        let fUnic = set.fUnic;
        let typelm = set.typelm.name;
        let del = set.del;
        let uin = set.uin;
        addComponents(name, fUnic, typelm, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-component");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"components", "uin":`${elem.value}`};

            if(elem.style.background === "red"){
                elem.style.background = "inherit";
            } else {
                elem.style.background = "red"
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
    cellName.innerHTML     = `<input class="input__type-text" type="text" value="${name}" id="component_name_${uin}" disabled>`;
    cellTypelm.innerHTML   = typelm;

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel-component" style="background:${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button><button class="button__control button__control_transfer-component" value="${uin}" name="${name}"><img class="button__control__img" src="assets/images/arrow_sidebar_1.svg"></button>`;
}