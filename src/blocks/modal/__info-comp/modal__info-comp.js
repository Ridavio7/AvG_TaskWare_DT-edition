import {funcCommand, clearTable, removeOptionsSetValue, removeOptions, addToDropdown, addToDropdownOneOption, funcProcessOnlyInfo, clearTableAll, responseProcessor} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';
import {funcGetComponentsTree, funcGetComponents} from '../../table/__comp-main/table__comp-main.js';
import {funcGetComponentInfoProps} from '../../table/__comp-compontsprops/table__comp-compontsprops.js';
import {funcGetComponentInfoTypesProps} from '../../table/__comp-typesprops/table__comp-typesprops.js';
import {funcInfoTypeselemOpenModal} from '../../modal/__typeselem/modal__typeselem.js';
import {funcGetCompontlinks} from '../../table/__comp-compontlinks/table__comp-compontlinks.js';
import {funcGetCompontimgs} from '../../table/__comp-compontimgs/table__comp-compontimgs.js';
import {funcEditImgsOpenModal} from '../__edit-images/modal__edit-images.js';

export const modal_info_component = document.getElementById("modal_info_component");
let span_info_component           = document.getElementById("close_info");
let component_input_name          = document.getElementById("component_name");
let component_input_name_title    = document.getElementById("component_name_title");
let component_select_type         = document.getElementById("component_type");
let component_button_type_info    = document.getElementById("component_type_info");
let component_checkbox_funic      = document.getElementById("component_unic");
let component_checkbox_tpack      = document.getElementById("component_tpack");
let component_input_comment       = document.getElementById("component_comment");
let component_table_ost           = document.getElementById("tb_modal_ost");
let component_table_link          = document.getElementById("tb_modal_link");
let component_button_add          = document.getElementById("component_add");
let component_button_save         = document.getElementById("component_save");
let component_button_add_props    = document.getElementById("component_info_add_button");
let component_table_props         = document.getElementById("main_tb_modal_info_component");
let component_select_add_props    = document.getElementById("component_info_add_props_select");
let component_input_d1            = document.getElementById("component_info_add_d1");
let component_input_d2            = document.getElementById("component_info_add_d2");

let inputIsChange = false;
let selectIsChange = false;

span_info_component.onclick = function(){
    if(inputIsChange === true || selectIsChange === true){
        inputIsChange  = false;
        selectIsChange = false;

        let res = confirm("Вы не сохранили все изменения! Все равно выйти?");
        if(res === true) modal_info_component.style.display = "none";
    } else {
        modal_info_component.style.display = "none";
    }
}

dragElement(modal_info_component);

/* функция добавления комплектующего */
export const funcProcessInfoComponentsModalAdd = (uin) => {
    modal_info_component.style.display = "block";

    component_input_name.value = "";
    component_input_name_title.innerHTML = "";
    //component_checkbox_funic.checked = false;
    component_checkbox_tpack.checked = false;

    removeOptionsSetValue("component_type", "---");
    addToDropdown(component_select_type, "typelm_list");
    component_button_type_info.style.display = "none";

    component_table_props.style.display = "none";
    component_table_ost.parentElement.parentElement.style.display = "none";
    component_table_link.parentElement.parentElement.style.display = "none";

    document.querySelector('.carousel').style.display = "none";

    component_button_add.value = uin;
    component_button_add.style.display = "flex";
    component_button_save.style.display = "none";
}

component_button_add.onclick = () => {
    let uincatC = localStorage.getItem("uincatC");
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"components", "name":"", "uincatC":`${uincatC}`, "uintypes":"", "fUnic":"0", "comment":"", "tpack":""};

    let name_value = component_input_name.value;
    let type_value = component_select_type.value;
    //let fUnic      = component_checkbox_funic;
    let tpack      = component_checkbox_tpack;
    let comment    = component_input_comment.value;

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name       = name_value;
        body.uintypes   = type_value;
        body.comment    = comment;
    
        let tpack_value = null;
        tpack.checked === true ? tpack_value = "1" : tpack_value = "0";
        body.tpack      = tpack_value;

        /*let fUnic_value = null;
        fUnic.checked === true ? fUnic_value = "1" : fUnic_value = "0";
        body.fUnic      = fUnic_value;*/

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetComponentsTree()}, 100);
        setTimeout(function(){modal_info_component.style.display = "none";}, 150);
    }
}

/* открытие модального окна */
export const funcInfoComponentsOpenModal = (uin) => {
    modal_info_component.style.display = "block";

    funcGetComponentInfo(uin);
    setTimeout(function(){funcGetComponentInfoProps(uin)}, 100);
    setTimeout(function(){funcGetCompontlinks(uin); funcGetCompontimgs(uin)}, 120);
}

/* инфо о комплектующем в модальном окне */
export const funcGetComponentInfo = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view","obj":"components", "count":"1", "sort":"uin", "filt":`[{"fld":"uin","val":["${uin}"]}]`};
    funcCommand(body, funcProcessGetComponentInfo);
}

const funcProcessGetComponentInfo = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    console.log("Комплектующее ИНФО:", respobj);

    document.getElementById("component_name").value      = "";
    document.getElementById("component_comment").value   = "";

    let select = component_select_type;
    while (select.options.length) {select.options[0] = null};

    removeOptionsSetValue("component_info_add_props_value_select", "---");
    document.getElementById("component_info_add_props_value_input").value = "";

    for (let key in respobj.answ){
        let obj       = respobj.answ[key];
        let name      = obj.name;
        let typelm    = obj.typelm.name === '' ? '---' : obj.typelm.name;
        let typelmUin = obj.typelm.uin;
        let fUnic     = obj.fUnic;
        let tpack     = obj.tpack;
        let comment   = obj.comment;
        let ost       = obj.ost;
        let uin       = obj.uin;
        addComponentInfo(name, typelm, typelmUin, fUnic, tpack, comment, ost, uin);
    }

    setTimeout(() => {
        modal_info_component.querySelectorAll(".input__type-text").forEach((elem) => {
            elem.addEventListener('change', () => {inputIsChange = true});
        });
    
        modal_info_component.querySelectorAll(".select").forEach((elem) => {
            elem.addEventListener('change', () => {selectIsChange = true});
        });
    }, 500)
}

const addComponentInfo = (name, typelm, typelmUin, fUnic, tpack, comment, ost, uin) => {
    document.getElementById("component_name").value = name;
    document.getElementById("component_name_title").innerHTML = name;

    document.getElementById('component_edit_imgs_img').onclick = () => funcEditImgsOpenModal(uin, name);

    funcGetComponentInfoTypesProps(typelmUin);
    
    addToDropdownOneOption(component_select_type, typelm, typelmUin);
    addToDropdown(component_select_type, "typelm_list");

    component_checkbox_tpack.checked = tpack === 1 ? true : false;

    /*let select_unic = component_checkbox_funic;
    if(fUnic === 1){
        select_unic.checked = true;
        component_input_d1.disabled = false;
        component_input_d2.disabled = false;
    } else {
        select_unic.checked = false;
        component_input_d1.disabled = true;
        component_input_d2.disabled = true;
    }*/

    document.getElementById("component_comment").value   = comment;
    document.getElementById("component_type_info").value = typelmUin;

    let tb_id = "tb_modal_ost";
    clearTableAll(tb_id);

    if(ost.length != 0){
        for (let key in ost){
            let obj   = ost[key];
            let count = obj.count;
            let store = obj.stor;
            addComponentOst(count, store, tb_id);
        }
    } else{
        addComponentOst("---", "---", tb_id);
    }

    component_table_ost.parentElement.parentElement.style.display = "block";
    component_table_link.parentElement.parentElement.style.display = "block";

    component_table_props.style.display = "inline-table";
    component_button_type_info.style.display = "block";
    document.querySelector('.carousel').style.display = "block";

    component_button_add_props.value = "";
    component_button_save.value = "";

    component_button_add_props.value = uin;
    component_button_save.value = uin;

    component_button_add.style.display = "none";
    component_button_save.style.display = "flex";
}

const addComponentOst = (count, store, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow   = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellCount  = newRow.insertCell(0); cellCount.classList = "td";
    let cellStore  = newRow.insertCell(1); cellStore.classList = "td";

    cellCount.innerHTML = count;
    cellStore.innerHTML = store;
}

/* переключение типа комплектующего с удалением всех его свойств */
component_type.onchange = () => {
    if(component_save.style.display === "flex"){
        let result = confirm("Вы меняете тип! Если вы подтверждаете, то все свойства будут удалены! Подтвердить?");
        if(result === true){
            setTimeout(function(){
                for (let i of component_select_add_props){
                    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"fulldel", "obj":"compontsprops", "uincompont":`${component_button_add_props.value}`};
                    funcCommand(body, funcProcessOnlyInfo);
                }
                clearTable("tb_modal_info_component");
            }, 100);
    
            setTimeout(function(){
                removeOptionsSetValue("component_info_add_props_select", "---");
                funcGetComponentInfoTypesProps(component_type.value);
            }, 200);
    
            setTimeout(function(){
                addToDropdown(component_select_add_props, "typesprops_list");
                document.getElementById("component_save").click();
            }, 300);
        }
    }
}

/* открытие модального окна типа комплектующего */
component_button_type_info.onclick = (elem) => {
    if(elem.target.className === "button__control__img"){
        funcInfoTypeselemOpenModal(elem.target.parentElement.value);
    } else {
        funcInfoTypeselemOpenModal(elem.target.value);
    }
}

/* в строке добавленя комплектующего при изменении св-ва меняется ед. изм. и select/input */
component_select_add_props.onchange = () => {
    addEventSelectOrInputProps(component_select_add_props, 'component_info_add_props_value_select');
}

const addEventSelectOrInputProps = (select, select_value_id) => {
    let body_1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"props", "count":"100", "filt":`[{"fld":"uin","val":["${select.value}"]}]`};
    funcCommand(body_1, funcSelectAddMeasOnTable);

    function funcSelectAddMeasOnTable(result, respobj){
        responseProcessor(result, respobj.succ);
        select.parentElement.nextElementSibling.innerText = respobj.answ[0].meas.name;
    }

    let body_2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"enums", "uinprops":`${select.value}`, "count":"100", "sort":"uin", "all":"0"};
    funcCommand(body_2, funcSelectAddEnumsOnTable);

    let select_value = document.getElementById(select_value_id);
    let input_value = document.getElementById("component_info_add_props_value_input");

    function funcSelectAddEnumsOnTable(result, respobj){
        responseProcessor(result, respobj.succ);
        console.log(respobj.answ)

        removeOptions(select_value);
        if(respobj.answ != ''){
            select_value.style.display = "inline";
            input_value.style.display  = "none";
            let arr = respobj.answ;
            for (let key in arr) {
                if(arr[key].del === 0){
                    let newOption = new Option(arr[key].name, arr[key].uin);
                    select_value.append(newOption);
                }
            }
        } else {
            input_value.style.display  = "block";
            select_value.style.display = "none";
        }
    }
}

/* переключение блокировка значений погрешности при абстрактном 
component_unic.addEventListener('click', function () {
    let inputs = document.getElementsByClassName("input__type-text_comp-fault");
    if(component_unic.checked === true){
        for(let i of inputs){
            i.disabled = false;
        }
    } else {
        for(let i of inputs){
            i.disabled = true;
        }
    }
})*/

/* кнопка сохранения комплектующего */
component_button_save.onclick = () => {
    inputIsChange = false;
    selectIsChange = false;

    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"components", "name":"", "uin":`${component_button_save.value}`, "fUnic":"0", "uintypes":"", "comment":"", "tpack":""};

    let name_value     = document.getElementById("component_name").value;
    let uintypes_value = document.getElementById("component_type").value;
    let comment_value  = document.getElementById("component_comment").value;
    //let fUnic          = document.getElementById("component_unic");
    let tpack          = document.getElementById("component_tpack");

    body.name     = name_value;
    body.uintypes = uintypes_value;
    //body.fUnic    = fUnic.checked === true ? "1" : "0";
    body.tpack    = tpack.checked === true ? "1" : "0";
    body.comment  = comment_value;

    funcCommand(body, funcProcessOnlyInfo);
    
    setTimeout(function(){
        let button_control_update = document.querySelectorAll(".button__control_update-compontsprops");
        button_control_update.forEach((elem) => {
            elem.click();
        })
    }, 100);
    setTimeout(function(){funcGetComponentsTree()}, 150);
}