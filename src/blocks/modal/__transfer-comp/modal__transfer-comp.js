import {funcCommand, addToDropdown, removeOptionsSetValue, funcProcessOnlyInfo} from '../../../js/common/common.js';
import {funcGetComponents} from '../../table/__comp-main/table__comp-main.js';
import {funcGetDirC} from '../__select-comp/modal__select-comp.js';
import {dragElement} from '../modal.js';

let modal_transfer_component  = document.getElementById("modal_transfer_component");
let span_transfer_component   = document.getElementById("close_component_transfer");
let name_transfer_component   = document.getElementById("component_transfer_name");
let button_transfer_component = document.getElementById("component_transfer_comp");
let button_transfer_catc      = document.getElementById("component_transfer_catc");
let tree_transfer_component   = document.getElementById("modal_transfer_component_tree");

span_transfer_component.onclick = function(){
    modal_transfer_component.style.display = "none";
}

dragElement(modal_transfer_component);

export const funcInfoComponentsTransferOpenModal = (uin, name) => {
    modal_transfer_component.style.display = "block";

    name_transfer_component.value = name;

    button_transfer_catc.style.display = "none";
    button_transfer_component.style.display = "flex";
    button_transfer_component.value = uin;
    button_transfer_component.name = name;

    let body  =  {"user":"demo", "meth":"view", "obj":"catC", "count":"100"};
    funcCommand(body, funcProcessGetComponentsTree);
}

const funcProcessGetComponentsTree = (result, respobj) => {
    if( result === 0 ) return;

    $('#modal_transfer_component_tree').jstree({
        core: {
            data: respobj.answ
        },
        "plugins" : ["state"],
    }).bind("loaded.jstree", function () {
        $(this).jstree("open_all");
    })

    $('#modal_transfer_component_tree').on('changed.jstree', function (e, data) {
        let objNode = data.instance.get_node(data.selected);
        let uin = objNode.id;
        localStorage.setItem("uincatC_trans", uin);
    })
}

button_transfer_component.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"update", "obj":"components", "name":"", "uin":"", "uincatC":""};

    body.name    = button_transfer_component.name;
    body.uin     = button_transfer_component.value;
    body.uincatC = localStorage.getItem("uincatC_trans");

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){
        funcGetComponents(localStorage.getItem("uincatC"));
        funcGetDirC(localStorage.getItem("uincatC"))
    }, 100);

    modal_transfer_component.style.display = "none";
})