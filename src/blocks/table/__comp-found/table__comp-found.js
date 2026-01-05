import {funcCommand, clearTableAll, responseProcessor} from '../../../js/common/common.js.js';

let found_tree;
let found_table;
let found_table_comp;
let found_input_id;

export const funcFoundComponents = (input, select, tb_id, tb_id_comp, tree_id, input_id) => {
    let body =  {"user":`${localStorage.getItem('srtf')}`, "obj":"components", "meth":"found", "name":"", "uintype":"", "count":"100"};

    let name = document.getElementById(input).value;
    name === "" ? body.name = " " : body.name = name;

    body.uintype = document.getElementById(select).value;

    funcCommand(body, funcProcessFoundComponents);

    found_table      = tb_id;
    found_table_comp = tb_id_comp;
    found_tree       = tree_id;
    found_input_id   = input_id;
}

export const funcFoundComponents1C = (input, tb_id, tb_id_comp, tree_id, input_id) => {
    let body =  {"user":`${localStorage.getItem('srtf')}`, "obj":"components", "meth":"found1c", "name":"", "count":"100"};

    let name = document.getElementById(input).value;
    name === "" ? body.name = " " : body.name = name;
    funcCommand(body, funcProcessFoundComponents);

    found_table      = tb_id;
    found_table_comp = tb_id_comp;
    found_tree       = tree_id;
    found_input_id   = input_id;
}

export const funcFoundOneComponent = (nameComp) => {
    let body =  {"user":`${localStorage.getItem('srtf')}`, "obj":"components", "meth":"found", "name":`${nameComp}`, "uintype":"", "count":"1"};
    funcCommand(body, funcProcessFoundComponents);

    found_table      = "found_table";
    found_table_comp = "tb_component_select";
    found_tree       = "modal_select_component_tree";
    found_input_id   = "select_component_name_";

    setTimeout(() => {
        let button_control = document.querySelectorAll(".button__control_found-comp");
        button_control[0].click();
    }, 500)
}

export const funcFoundPlusComponents = (input, select, props, tb_id, tb_id_comp, tree_id, input_id) => {
    let body =  {"user":`${localStorage.getItem('srtf')}`, "obj":"components", "meth":"found", "name":"", "uintype":"", "props": props, "count":"100"};

    let name = document.getElementById(input).value;
    name === "" ? body.name = " " : body.name = name;

    body.uintype = document.getElementById(select).value;

    funcCommand(body, funcProcessFoundComponents);

    found_table      = tb_id;
    found_table_comp = tb_id_comp;
    found_tree       = tree_id;
    found_input_id   = input_id;
}

const funcProcessFoundComponents = (result, respobj) => {
    clearTableAll(found_table);

    if(respobj.answ != 0){
        for (let key in respobj.answ){
            let obj      = respobj.answ[key];
            let name     = obj.name;
            let name1c   = obj.name1c;
            let uin      = obj.uin;
            let nametype = obj.nametype;
            let uincatC  = obj.uincatC;
            addFoundComponents(name, name1c, uin, nametype, uincatC, found_table);
        }
    
        let button_control = document.querySelectorAll(".button__control_found-comp");
        button_control.forEach((elem) => {
            elem.onclick = function() {
                funcFindAnchor(elem.value, elem.name);
            }
        })
    } else {
        addFoundComponentsEmpty(found_table);
    }
}

const addFoundComponents = (name, name1c, uin, nametype, uincatC, found_table) => {
    let tableRef = document.getElementById(found_table);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellType = newRow.insertCell(0); cellType.classList = "td";
    let cellName = newRow.insertCell(1); cellName.classList = "td";
    let cellBtn  = newRow.insertCell(2); cellBtn.classList  = "td";

    cellType.innerHTML = nametype;
    if(name1c != undefined){
        cellName.innerHTML = `<div>TW: ${name}</div><div>1C: ${name1c}</div>`;
    } else {
        cellName.innerHTML = `<div class="button__control_wrapper"><span>${name}</span></div>`;
    }

    cellBtn.innerHTML  = `<button class="button__control button__control_found-comp" value="${uincatC}" name="${uin}"><img class="button__control__img" src="assets/images/found_it.svg" title="Найти элемент"></button>`;
}

const addFoundComponentsEmpty = (found_table) => {
    let tableRef = document.getElementById(found_table);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellType = newRow.insertCell(0); cellType.classList = "td";
    let cellName = newRow.insertCell(1); cellName.classList = "td";
    let cellBtn  = newRow.insertCell(2); cellBtn.classList  = "td";

    cellType.innerHTML = "Ничего не найдено";
    cellName.innerHTML = "Повторите запрос";

    cellBtn.innerHTML  = `<button class="button__control button__control_found-comp" disabled><img class="button__control__img" src="assets/images/found_it.svg" title="Найти элемент"></button>`;
}

export const funcFindAnchor = (value, name) => {
    let anchors = document.getElementById(found_tree).getElementsByClassName(`tree-catalog__header`);
    for(let i in anchors){
        let obj = anchors[i];
        let id  = obj.id;
        if(id === `summary_${value}`){
            anchors[i].click();
            anchors[i].scrollIntoView({behavior: "smooth", block: "center", inline: "start"});
        }
    }

    if(window.innerWidth <= 1024){
        wrapper_comp_found.style.display = "none";
    }

    setTimeout(() => {
        let tr = document.getElementById(`${found_input_id}${name}`);
        tr .parentElement.className += " tr_mark";
        tr .parentElement.scrollIntoView({behavior: "smooth", block: "center", inline: "start"});
    }, 500)

    setTimeout(() => {
        let tr = document.getElementById(`${found_input_id}${name}`);
        tr.parentElement.className = tr.parentElement.className.replace(" tr_mark", "");
    }, 2000)
}