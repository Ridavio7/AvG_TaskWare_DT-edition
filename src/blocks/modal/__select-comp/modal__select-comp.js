import {funcCommand, clearTableAll, funcMarkNode} from '../../../js/common/common.js.js';
import {dragElement} from '../modal.js';
import {funcProcessInfoComponentsModalAdd} from '../__info-comp/modal__info-comp.js';

let modal_select_comp = document.getElementById("modal_select_component");
let span_select_comp = document.getElementById("close_component_select");

span_select_comp.addEventListener("click", () => {
    modal_select_comp.style.display = "none";
})

dragElement(modal_select_comp);

export const funcGetComponentsTreeSelect = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"catC", "count":"100"};
    funcCommand(body, funcProcessGetComponentsTreeSelect);
}

function funcProcessGetComponentsTreeSelect(result, respobj){
    if( result === 0 ) return;

    $('#modal_select_component_tree').jstree({
        core: {
            data: respobj.answ
        },
        "plugins" : ["state"],
    });

    $('#modal_select_component_tree').on('changed.jstree', function (e, data) {
        let objNode = data.instance.get_node(data.selected);
        let uin = objNode.id;
        localStorage.setItem("uincatC", uin);

        let tb_id = "tb_component_select";
        clearTableAll(tb_id);
    
        let table = document.getElementById(tb_id);
        let row_head   = table.insertRow(-1);
        row_head.innerHTML = `<tr><td></td><td></td><td></td><td class="td td_buttons-control"><button class="button__control button__control_add-comp-select" value="${uin}"><img class="button__control__img" src="assets/images/plus.svg" alt=""></button></td></tr>`;
        
        funcGetDirC(uin);

        let button_control_add_comp_tree = document.querySelector(".button__control_add-comp-select");
        button_control_add_comp_tree.addEventListener("click", (elem) => {
            funcProcessInfoComponentsModalAdd(elem.value);
        })
    })
    
    $('#modal_select_component_tree').on('click.jstree', function (){
        funcMarkNode(respobj.answDop);
    });
}

export const funcGetDirC = (uin) => {
    let body  =  {"user":"demo", "meth":"view","obj":"dirC", "uin":`${uin}`, "count":"5000" };
    funcCommand(body, funcProcessGetComponentsSelect);
}

function funcProcessGetComponentsSelect(result, respobj){
    if( result === 0 ) return;

    let tb_id = "tb_component_select";
    for (let key in respobj.answ){
        let set = respobj.answ[key];
        let name = set.name;
        let typelm = set.typelm.name;
        let del = set.del;
        let uin = set.uin;
        addComponentsSelect(name, typelm, del, uin, tb_id);
    }

    let button_control_select_component = document.querySelectorAll(".button__control_select-component");
    button_control_select_component.forEach((elem) => {
        elem.addEventListener("click", () => {
            result = confirm("Подтверждаете выбор комплектующего?");
            if(result === true){
                modal_select_component.style.display = "none";

                let button = document.getElementById(localStorage.getItem("button_select_component_id"));
                button.value = elem.value;
                button.innerText = elem.name;
            }
        })
    })
}

function addComponentsSelect(name, typelm, del, uin, tb_id){
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellSelect = newRow.insertCell(0); cellSelect.classList = "td";
    let cellName   = newRow.insertCell(1); cellName.classList   = "td";
    let cellType   = newRow.insertCell(2); cellName.classList   = "td";
    let cellBtn    = newRow.insertCell(3); cellBtn.classList    = "td";

    if(del != 0){
        cellSelect.innerHTML = `<button class="button__control" disabled><img class="button__control__img" src="assets/images/plus.svg" alt=""></button>`;
    } else {
        cellSelect.innerHTML = `<button class="button__control button__control_select-component" value="${uin}" name="${name}"><img class="button__control__img" src="assets/images/plus.svg" alt=""></button>`;
    }

    cellName.innerHTML = name;
    cellType.innerHTML = typelm;

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control" style="background:${bx_color}" disabled><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}