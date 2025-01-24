import {funcCommand, clearTable, removeOptions, addToDropdown, makeSelect, highlightButtonSave, findForUpdateSelect, findForUpdateInput, removeOptionsSetValue, funcProcessOnlyInfo } from '../../../js/common/common.js';
import {funcGetComponentInfo} from '../../modal/__info-comp/modal__info-comp.js';

/* св-ва комплектующего в модальном окне */
export const funcGetComponentInfoProps = (uin) => {
    let body  =  {"user":"demo", "meth":"view", "obj":"compontsprops", "count":"100", "uincompont":`${uin}`}
    funcCommand(body, funcProcessGetComponentInfoProps);
}

const funcProcessGetComponentInfoProps = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Комплектующее св-ва:", respobj);

    let select = document.getElementById("component_info_add_props_select");
    removeOptions(select);
    let option = document.createElement("option");
    option.text = "---";
    select.appendChild(option);

    component_info_add_props_select.parentElement.nextElementSibling.innerText = "---";

    addToDropdown(select, "typesprops_list");
    
    let tb_id = "tb_modal_info_component"
    clearTable(tb_id);

    for (let key in respobj.answ){
        let set      = respobj.answ[key];
        let props    = set.props.name;
        let propsUin = set.props.uin;
        let meas     = set.meas.name;
        let value    = set.value;
        let perc     = set.perc;
        let d1       = set.d1;
        let d2       = set.d2;
        let del      = set.del;
        let uin      = set.uin;
        let uincompont = set.uincompont;
        addComponentInfoProps(props, propsUin, meas, value, perc, d1, d2, del, uin, uincompont, tb_id);
    }

    let select_unic = document.getElementById("component_unic");
    let inputs = document.getElementsByClassName("component_info_input");
    if(select_unic.checked === true){
        for(i of inputs){i.disabled = false};
    } else {
        select_unic.checked = false;
        for(i of inputs){i.disabled = true};
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-compontsprops");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"compontsprops", "uin":`${elem.value}`};

            if(elem.style.background === "red"){
                elem.style.background = "inherit";
            } else {
                elem.style.background = "red"
            }

            funcCommand(body, funcProcessOnlyInfo);
        })
    })
    
    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-compontsprops");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update", "obj":"compontsprops", "uin":`${elem.value}`, "uincompont":`${elem.name}`, "uinprops":"", "value":"", "d1":"", "d2":"", "perc":""};

            let target_table = main_tb_modal_info_component;
            body.uinprops = findForUpdateSelect(target_table, "component_info_props_select_", elem.value);
            body.value    = findForUpdateInput(`component_info_value_${elem.value}`, target_table);
            body.d1       = findForUpdateInput(`component_info_d1_${elem.value}`, target_table);
            body.d2       = findForUpdateInput(`component_info_d2_${elem.value}`, target_table);
            body.perc     = findForUpdateInput(`component_info_perc_${elem.value}`, target_table);

            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            funcGetComponentInfo(elem.name);
            setTimeout(function(){funcGetComponentInfoProps(elem.name)}, 100);
        })
    })
}

const addComponentInfoProps = (props, propsUin, meas, value, perc, d1, d2, del, uin, uincompont, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow     = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellProps = newRow.insertCell(0); cellProps.classList = "td";
    let cellMeas  = newRow.insertCell(1); cellMeas.classList  = "td";
    let cellValue = newRow.insertCell(2); cellValue.classList = "td";
    let cellPerc  = newRow.insertCell(3); cellPerc.classList  = "td";
    let cellD1    = newRow.insertCell(4); cellD1.classList    = "td";
    let cellD2    = newRow.insertCell(5); cellD2.classList    = "td";
    let cellBtn   = newRow.insertCell(6); cellBtn.classList   = "td";

    makeSelect("component_info_props_select_", uin, props, propsUin, "typesprops_list", "select", cellProps);
    cellMeas.innerHTML  = meas;
    cellValue.innerHTML = `<input class="input__type-text" type="text" name="component_info_value_${uin}" value="${value}">`;
    cellPerc.innerHTML  = `<input class="input__type-text" type="text" name="component_info_perc_${uin}" value="${perc}">`;
    cellD1.innerHTML    = `<input class="input__type-text" type="text" name="component_info_d1_${uin}" value="${d1}">`;
    cellD2.innerHTML    = `<input class="input__type-text" type="text" name="component_info_d2_${uin}" value="${d2}">`;

    let select = document.getElementById(`component_info_props_select__${uin}`);
    select.addEventListener("change", function (){
        let body = {"user":"demo", "meth":"view", "obj":"props", "count":"100", "filt":`[{"fld":"uin","val":["${select.value}"]}]`};
        funcCommand(body, funcSelectMeasOnTable);
    
        function funcSelectMeasOnTable(result, respobj){
            if( result === 0 ) return;
            select.parentElement.nextElementSibling.innerText = respobj.answ[0].meas.name;
        }
    });

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update-compontsprops" value="${uin}" name="${uincompont}"><img class="button__control__img" src="assets/images/arrow_3.svg"></button><button class="button__control button__control_mdel-compontsprops" style="background:${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add = document.getElementById("component_info_add_button");
button_control_add.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"add", "obj":"compontsprops", "uincompont":`${button_control_add.value}`, "uinprops":"", "value":"", "d1":"", "d2":"", "perc":""};

    let uinprops_value = document.getElementById(`component_info_add_props_select`).value;
    let value_value    = document.getElementById(`component_info_add_value`).value;
    let d1_value       = document.getElementById(`component_info_add_d1`).value;
    let d2_value       = document.getElementById(`component_info_add_d2`).value;
    let perc_value     = document.getElementById(`component_info_add_perc`).value;

    if(uinprops_value === "" || value_value === "" || perc_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.uinprops = uinprops_value;
        body.value    = value_value;
        body.d1       = d1_value;
        body.d2       = d2_value;
        body.perc     = perc_value;
        
        removeOptionsSetValue(`component_info_add_props_select`, "---");
        document.getElementById(`component_info_add_value`).value = "0";
        document.getElementById(`component_info_add_d1`).value = "0";
        document.getElementById(`component_info_add_d2`).value = "0";
        document.getElementById(`component_info_add_perc`).value = "0";
        
        funcCommand(body, funcProcessOnlyInfo);
        funcGetComponentInfo(button_control_add.value);
        setTimeout(function(){funcGetComponentInfoProps(button_control_add.value)}, 100);
    }
})