import {funcCommand, clearTableAll, funcProcessOnlyInfo, removeOptionsSetValue, addToDropdown, responseProcessor} from '../../../js/common/common.js';
import {funcProcessInfoComponentsModalAdd, funcInfoComponentsOpenModal} from '../../modal/__info-comp/modal__info-comp.js';
import {funcInfoCatcTransferOpenModal} from '../../modal/__transfer-comp/modal__transfer-comp.js';
import {funcInfoComponentsTransferOpenModal} from '../../modal/__transfer-comp/modal__transfer-comp.js';
import {funcFoundComponents} from '../__comp-found/table__comp-found.js';
import {funcFoundPlusOpenModal} from '../../modal/__found-plus/modal__found-plus.js';
import {TreeBuilder} from '../../_tree/tree.js';
import {customSortSelect} from '../../select/select.js';
import {resizeModalWindow} from '../../modal/modal.js';
import {DropdownButton} from '../../button/__control/_dropdown/button__control_dropdown.js';

resizeModalWindow(wrapper_comp_tree, "whComponentTree", "Размеры окна дерева комплектующих");
resizeModalWindow(wrapper_comp_table, "whComponentTable", "Размеры окна таблицы комплектующих"); 
resizeModalWindow(wrapper_comp_found, "whComponentFound", "Размеры окна поиска комплектующих");

/* настройка размера окна */
const funcGetResizeTree = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whComponentTree", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResizeTree)
}

const funcProcessGetResizeTree = (result, respobj) => {
    document.getElementById("wrapper_comp_tree").style.width  = `${respobj.answ.val[0]}px`;
    document.getElementById("wrapper_comp_tree").style.height = `${respobj.answ.val[1]}px`;
}

/* настройка размера окна */
const funcGetResizeTb = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whComponentTable", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResizeTb)
}

const funcProcessGetResizeTb = (result, respobj) => {
    document.getElementById("wrapper_comp_table").style.width  = `${respobj.answ.val[0]}px`;
    document.getElementById("wrapper_comp_table").style.height = `${respobj.answ.val[1]}px`;
}

/* настройка размера окна */
const funcGetResizeFound = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whComponentFound", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResizeFound)
}

const funcProcessGetResizeFound = (result, respobj) => {
    document.getElementById("wrapper_comp_found").style.width  = `${respobj.answ.val[0]}px`;
    document.getElementById("wrapper_comp_found").style.height = `${respobj.answ.val[1]}px`;
}

export const funcGetTasks = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"tasks", "count":"100", "asort":"datebegin"};
    funcCommand(body, funcProcessGetTasks);
}

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
    funcGetResizeTree();
    funcGetResizeTb();
    funcGetResizeFound();
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catC", "count":"100"};
    funcCommand(body, funcProcessGetComponentsTree);

    removeOptionsSetValue("found_main_select", "Выберите тип");
    addToDropdown(found_select, 'typelm_list');
}

const funcProcessGetComponentsTree = (result, respobj) => {
    console.log("Дерево:", respobj);

    const tree = new TreeBuilder('jstree_div', 'dirC', 'catC', funcGetComponentsTree, funcGetComponents, funcInfoCatcTransferOpenModal, ['contextmenu', 'openall']);
    tree.build(respobj.answ);
    let node = tree.get();
    uinCatc = node.getAttribute('data-id');
    localStorage.setItem("uincatC", uinCatc);

    document.getElementById('jstree_div').onclick = () => {
        let node = tree.get();
        uinCatc = node.getAttribute('data-id');
        localStorage.setItem("uincatC", uinCatc);
    }
}

/* каталог комплектующих */
export const funcGetComponents = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view","obj":"dirC", "uin":`${uin}`, "count":"5000"};
    funcCommand(body, funcProcessGetComponents);
}

const funcProcessGetComponents = (result, respobj) => {
    console.log("Директория:", respobj);

    let tb_id = "tb_components_tree"
    clearTableAll(tb_id);

    let table = document.getElementById(tb_id);
    let row_head   = table.insertRow(-1);
    row_head.innerHTML = `<tr class="tr"><td class="td"></td><td class="td"></td><td class="td"></td><td class="td td_buttons-control"><button class="button__control button__control_add-comp-tree" value="${uinCatc}"><img class="button__control__img" src="assets/images/create.svg" title="Создать"></button></td></tr>`;

    for (let key in respobj.answ){
        let set    = respobj.answ[key];
        let name   = set.name;
        let fUnic  = set.fUnic;
        let ost    = set.ost;
        let typelm = set.typelm.name;
        let del    = set.del;
        let uin    = set.uin;
        addComponents(name, fUnic, ost, typelm, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-component");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"components", "uin":`${elem.value}`};

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

    let button_control_add_comp_tree = document.querySelector(".button__control_add-comp-tree");
    button_control_add_comp_tree.addEventListener("click", (elem) => {
        funcProcessInfoComponentsModalAdd(elem.value);
    })

    function funcCopyElem(uin){
        let result = confirm("Сделать копию этого комплектующего?");
        if(result){
            let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"copy", "obj":"components", "uin":`${uin}`};
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(() => {funcGetComponentsTree()}, 100);
        }
    }

    function funcTransferElem(uin, name){
        funcInfoComponentsTransferOpenModal(uin, name);
    }

    function funcFullDelElem(uin){
        
    }

    /* кнопки выпадающие списки */
    document.querySelectorAll(".button__control_modal-dropdown-component").forEach((elem) => {
        new DropdownButton(elem, '', [
            { text: 'Копировать', action: () => funcCopyElem(elem.getAttribute("data-value")) },
            { text: 'Переместить', action: () => funcTransferElem(elem.getAttribute("data-value"), elem.getAttribute("data-name")) },
            { text: 'Удалить', action: () => funcFullDelElem(elem.getAttribute("data-value")) }
        ], 'assets/images/three_dot.svg');
    })
}

const addComponents = (name, fUnic, ost, typelm, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName   = newRow.insertCell(0); cellName.classList   = "td td_nowrap-content";
    let cellTypelm = newRow.insertCell(1); cellTypelm.classList = "td";
    let cellFUnic  = newRow.insertCell(2); cellFUnic.classList  = "td td__text_align_center";
    let cellBtn    = newRow.insertCell(3); cellBtn.classList    = "td";

    cellName.innerHTML = `<button class="button__control button__control_modal-component" value="${uin}"><img class="button__control__img" src="assets/images/info.svg" title="Инфо"></button> ${name}`;
    cellName.id = `component_name_${uin}`;
    cellFUnic.innerHTML = ost;
    /*fUnic === 1 ? cellFUnic.innerHTML = `<input class="checkbox" type="checkbox" id="chb_funic_${uin}" disabled checked><label for="chb_funic_${uin}"></label>` : 
                  cellFUnic.innerHTML = `<input class="checkbox" type="checkbox" id="chb_funic_${uin}" disabled><label for="chb_funic_${uin}"></label>`;*/
    cellTypelm.innerHTML   = typelm;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel button__control_mdel-component${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button><div class="button__control_dropdown-container button__control_modal-dropdown-component" data-value="${uin}" data-name="${name}"></div>`;
}

customSortSelect("sort_components");
const dropdown = document.getElementById("sort_components");
const options  = dropdown.querySelectorAll('li');
options.forEach(option => {
    option.addEventListener('click', () => {
        switch (option.getAttribute('data-value')){
            case '1':
                let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catC", "count":"5000", "sort":"name"};
                funcCommand(body1, funcProcessGetComponentsTree);
            break;
            case '2':
                let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catC", "count":"5000", "asort":"name"};
                funcCommand(body2, funcProcessGetComponentsTree);
            break;
        }
    })
})