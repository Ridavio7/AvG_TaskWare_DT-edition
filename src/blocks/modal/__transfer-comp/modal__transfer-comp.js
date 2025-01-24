import {funcCommand, addToDropdown, removeOptionsSetValue, funcProcessOnlyInfo} from '../../../js/common/common.js';
import {funcGetComponents} from '../../table/__comp-main/table__comp-main.js';

let modal_transfer_component = document.getElementById("modal_transfer_component");
let span_transfer_component  = document.getElementById("close_component_transfer");
let name_transfer_component  = document.getElementById("component_transfer_name");
let select_transfer_component = document.getElementById("component_transfer_dir");
let button_transfer_component = document.getElementById("component_transfer_comp");
let button_transfer_catc = document.getElementById("component_transfer_catc");

span_transfer_component.onclick = function(){
    modal_transfer_component.style.display = "none";
}

export const funcInfoComponentsTransferOpenModal = (uin, name) => {
    modal_transfer_component.style.display = "block";

    name_transfer_component.value = name;

    button_transfer_catc.style.display = "none";
    button_transfer_component.style.display = "flex";
    button_transfer_component.value = uin;
    button_transfer_component.name = name;

    removeOptionsSetValue("component_transfer_dir", "---")
    addToDropdown(select_transfer_component, "dirC_list");
}

button_transfer_component.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"update", "obj":"components", "name":"", "uin":"", "uincatC":""};

    body.name = button_transfer_component.name;
    body.uin = button_transfer_component.value;
    body.uincatC = select_transfer_component.value;

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetComponents(localStorage.getItem("uincatC"))}, 100);

    modal_transfer_component.style.display = "none";
})