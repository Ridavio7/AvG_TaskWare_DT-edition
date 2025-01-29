import {funcCommand, clearTableAll, clearTable} from '../../../js/common/common.js.js';
import {funcGetDirC} from '../../modal/__select-comp/modal__select-comp.js';

let found_input  = document.getElementById("found_input");
let found_select = document.getElementById("found_select");

export const funcFoundComponents = () => {
    let body =  {"user":"demo", "obj":"components", "meth":"found", "name":"", "uintype":"", "count":"10"};

    let name = found_input.value;
    name === "" ? body.name = " " : body.name = name;

    body.uintype = found_select.value;

    funcCommand(body, funcProcessFoundComponents);
}

const funcProcessFoundComponents = (result, respobj) => {
    if( result === 0 ) return;

    console.log(respobj);

    let tb_id = "found_table";
    clearTable(tb_id);

    for (let key in respobj.answ){
        let obj      = respobj.answ[key];
        let name     = obj.name;
        let uin      = obj.uin;
        let nametype = obj.nametype;
        let uincatC  = obj.uincatC;
        addFoundComponents(name, uin, nametype, uincatC, tb_id);
    }

    /*let button_control = document.querySelectorAll(".button__control_found-comp");
    button_control.forEach((elem) => {
        let value1 = elem.value;
        let value2 = elem.name;

        const varFuncFindAnchor = funcFindAnchor(value1, value2);
        elem.addEventListener("click", varFuncFindAnchor);
    })*/
    let button_control = document.querySelectorAll(".button__control_found-comp");
    button_control.forEach((elem) => {
        elem.onclick = function() {
            funcFindAnchor(elem.value, elem.name);
        }
    })
}

export const funcFindAnchor = (value, name) => {
    let tree    = document.getElementById("modal_select_component_tree");
    let anchors = tree.getElementsByClassName(`jstree-anchor`);

    for(let i in anchors){
        let obj = anchors[i];
        let id = obj.id;
        if(id === `${value}_anchor`){
            clearTableAll("tb_component_select");
            anchors[i].click();
        }
    }

    setTimeout(() => {
        let input = document.getElementById(`component_name_${name}`);
        if(input === null){
            funcGetDirC(value);
            setTimeout(() => {
                document.getElementById(`component_name_${name}`).parentElement.parentElement.style.border = "1px solid green";
            }, 200)
        } else {
            input.parentElement.parentElement.style.border = "1px solid green";
        }
    }, 300)
}

const addFoundComponents = (name, uin, nametype, uincatC, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellType = newRow.insertCell(0); cellType.classList = "td";
    let cellName = newRow.insertCell(1); cellName.classList = "td";
    let cellBtn  = newRow.insertCell(2); cellBtn.classList  = "td";

    cellType.innerHTML = nametype;
    cellName.innerHTML = name;
    cellBtn.innerHTML  = `<button class="button__control button__control_found-comp" value="${uincatC}" name="${uin}"><img class="button__control__img" src="assets/images/info.svg"></button>`;
}