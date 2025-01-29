import {funcCommand, clearTable, removeOptionsSetValue, addToDropdown, funcProcessOnlyInfo, removeOptions} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';
import {funcGetComponents} from '../../table/__comp-main/table__comp-main.js';
import {funcGetComponentInfoProps, addEventSelectProps} from '../../table/__comp-compontsprops/table__comp-compontsprops.js';
import {funcGetComponentInfoTypesProps} from '../../table/__comp-typesprops/table__comp-typesprops.js';
import {funcGetDirC} from '../__select-comp/modal__select-comp.js';

export const modal_info_component = document.getElementById("modal_info_component");
let span_info_component           = document.getElementById("close_info");
let component_input_name          = document.getElementById("component_name");
let component_select_type         = document.getElementById("component_type");
let component_checkbox_funic      = document.getElementById("component_unic");
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
        let res = confirm("Вы не сохранили все изменения! Все равно выйти?");
        if(res === true){
            inputIsChange = false;
            selectIsChange = false;

            modal_info_component.style.display = "none";
        }
    } else {
        inputIsChange = false;
        selectIsChange = false;
        
        modal_info_component.style.display = "none";
    }
}

dragElement(modal_info_component);

/* функция добавления комплектующего */
export const funcProcessInfoComponentsModalAdd = (uin) => {
    modal_info_component.style.display = "block";

    component_input_name.value = "";
    removeOptionsSetValue("component_type", "---");
    component_checkbox_funic.checked = false;
    component_table_props.style.display = "none";

    component_button_add.value = uin;
    component_button_add.style.display = "flex";
    component_button_save.style.display = "none";

    addToDropdown(component_select_type, "typelm_list");
}

component_button_add.addEventListener("click", () => {
    let uincatC = localStorage.getItem("uincatC");
    let body  =  {"user":"demo", "meth":"add", "obj":"components", "name":"", "uincatC":`${uincatC}`, "uintypes":"", "fUnic":""};

    let name_value = component_input_name.value;
    let type_value = component_select_type.value;
    let fUnic      = component_checkbox_funic;

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name       = name_value;
        body.uintypes   = type_value;
    
        let fUnic_value = null;
        fUnic.checked === true ? fUnic_value = "1" : fUnic_value = "0";
        body.fUnic      = fUnic_value;

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){clearTable("tb_modal_info_component")}, 100);
        setTimeout(function(){clearTable("tb_components_tree"); clearTable("tb_component_select")}, 150);
        setTimeout(function(){funcGetComponents(uincatC); funcGetDirC(uincatC)}, 200);
        setTimeout(function(){modal_info_component.style.display = "none";}, 250);
    }
})

/* открытие модального окна */
export const funcInfoComponentsOpenModal = (uin) => {
    modal_info_component.style.display = "block";

    funcGetComponentInfo(uin);
    setTimeout(function(){funcGetComponentInfoProps(uin)}, 100);
}

/* инфо о комплектующем в модальном окне */
export const funcGetComponentInfo = (uin) => {
    let body  =  {"user":"demo", "meth":"view","obj":"components", "count":"10", "sort":"uin", "filt":`[{"fld":"uin","val":["${uin}"]}]`};
    funcCommand(body, funcProcessGetComponentInfo);
}

const funcProcessGetComponentInfo = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Комплектующее ИНФО:", respobj);

    document.getElementById("component_name").value = "";
    let select = component_select_type;
    select.value = "";
    let len = select.length;
    for (let i = 0; i < len; i++) {
        select.remove(0);
    }

    for (let key in respobj.answ){
        let set       = respobj.answ[key];
        let name      = set.name;
        let fUnic     = set.fUnic;
        let typelm    = set.typelm.name;
        let typelmUin = set.typelm.uin;
        let uin       = set.uin;
        addComponentInfo(name, fUnic, typelm, typelmUin, uin);
    }
}

const addComponentInfo = (name, fUnic, typelm, typelmUin, uin) => {
    let input = document.getElementById("component_name");
    input.value = name;

    funcGetComponentInfoTypesProps(typelmUin);

    let select = component_select_type;
    let option = document.createElement("option");
    if(typelm === ''){typelm = "---"}
    option.text = typelm;
    option.value = typelmUin;
    select.appendChild(option);

    addToDropdown(select, "typelm_list");

    let select_unic = component_checkbox_funic;
    if(fUnic === 1){
        select_unic.checked = true;
        component_input_d1.disabled = false;
        component_input_d2.disabled = false;
    } else {
        select_unic.checked = false;
        component_input_d1.disabled = true;
        component_input_d2.disabled = true;
    }

    component_table_props.style.display = "block";

    component_button_add_props.value = "";
    component_button_save.value = "";

    component_button_add_props.value = uin;
    component_button_save.value = uin;

    component_button_add.style.display = "none";
    component_button_save.style.display = "flex";

    setTimeout(() => {
        modal_info_component.querySelectorAll(".input__type-text").forEach((elem) => {
            elem.addEventListener('change', () => {inputIsChange = true; console.log(inputIsChange)});
        });
    
        modal_info_component.querySelectorAll(".select").forEach((elem) => {
            elem.addEventListener('change', () => {selectIsChange = true; console.log(selectIsChange)});
        });
    }, 500)
}

/* переключение типа комплектующего с удалением всех его свойств */
component_type.addEventListener("change", function (){
    if(component_save.style.display === "flex"){
        let result = confirm("Вы меняете тип! Если вы подтверждаете, то все свойства будут удалены! Подтвердить?");
        if(result === true){
            setTimeout(function(){
                for (let i of component_select_add_props){
                    let body  =  {"user":"demo", "meth":"fulldel", "obj":"compontsprops", "uincompont":`${component_button_add_props.value}`};
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
})

component_select_add_props.addEventListener("change", function (){
    addEventSelectProps(component_select_add_props, 'component_info_add_props_value_select');
})

/* переключение блокировка значений погрешности при абстрактном */
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
})

/* кнопка сохранения комплектующего */
component_button_save.addEventListener('click', function () {
    inputIsChange = false;
    selectIsChange = false;

    let body  =  {"user":"demo", "meth":"update", "obj":"components", "name":"", "uin":`${component_button_save.value}`, "fUnic":"", "uintypes":""};

    let name_value     = document.getElementById("component_name").value;
    let uintypes_value = document.getElementById("component_type").value;
    let fUnic          = document.getElementById("component_unic");
    let fUnic_value    = null;
    fUnic.checked === true ? fUnic_value = "1" : fUnic_value = "0";

    body.name     = name_value;
    body.uintypes = uintypes_value;
    body.fUnic    = fUnic_value;

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){clearTable("tb_components_tree")}, 100);
    setTimeout(function(){funcGetComponents(localStorage.getItem("uincatC"))}, 150);
})