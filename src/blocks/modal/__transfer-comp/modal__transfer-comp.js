import {funcCommand, addToDropdown, removeOptionsSetValue, funcProcessOnlyInfo} from '../../../js/common/common.js';
import {funcGetComponentsTree} from '../../table/__comp-main/table__comp-main.js';
import {funcGetDirC} from '../__select-comp/modal__select-comp.js';
import {dragElement} from '../modal.js';
import {TreeBuilder} from '../../_tree/tree.js';

let modal_transfer       = document.getElementById("modal_transfer_component");
let span_transfer        = document.getElementById("close_component_transfer");
let name_transfer        = document.getElementById("component_transfer_name");
let button_transfer_comp = document.getElementById("component_transfer_comp");
let button_transfer_dirc = document.getElementById("component_transfer_catc");

let uinCatc  = null;
let uinItem  = null;
let nameItem = null;

span_transfer.onclick = function(){
    modal_transfer.style.display = "none";
}

dragElement(modal_transfer);

export const funcInfoComponentsTransferOpenModal = (uin, name) => {
    modal_transfer.style.display = "block";

    name_transfer.value = name;
    uinItem = uin;
    nameItem = name;
    button_transfer_dirc.style.display = "none";
    button_transfer_comp.style.display = "flex";

    let body  =  {"user":"demo", "meth":"view", "obj":"catC", "count":"100"};
    funcCommand(body, funcProcessGetComponentsTree);
}

const funcProcessGetComponentsTree = (result, respobj) => {
    if( result === 0 ) return;

    const tree = new TreeBuilder('modal_transfer_component_tree', ["openall"]);
    tree.build(respobj.answ);

    document.getElementById('modal_transfer_component_tree').addEventListener('click', () => {
        let node = tree.get();
        uinCatc = node.getAttribute('data-id');
    })
}

button_transfer_comp.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"update", "obj":"components", "name":`${nameItem}`, "uin":`${uinItem}`, "uincatC":`${uinCatc}`};

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){
        funcGetComponentsTree()
    }, 100);

    modal_transfer.style.display = "none";
})

export const funcInfoCatcTransferOpenModal = (uin, name) => {
    modal_transfer.style.display = "block";

    name_transfer.value = name;
    uinItem = uin;
    nameItem = name;
    button_transfer_dirc.style.display = "flex";
    button_transfer_comp.style.display = "none";

    let body  =  {"user":"demo", "meth":"view", "obj":"catC", "count":"100"};
    funcCommand(body, funcProcessGetComponentsTree);
}

button_transfer_dirc.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"update", "obj":"dirC", "name":`${nameItem}`, "uin":`${uinItem}`, "uinparent":`${uinCatc}`};

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){
        funcGetComponentsTree()
    }, 100);

    modal_transfer.style.display = "none";
})