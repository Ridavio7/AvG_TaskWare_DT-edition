import {funcCommand, clearTable, removeOptions, addToDropdown, makeSelect, highlightButtonSave, findForUpdateSelect, removeOptionsSetValue, funcProcessOnlyInfo, responseProcessor, funcProcessOnlyConsole} from '../../../js/common/common.js';
import {funcGetComponentInfo} from '../../modal/__info-comp/modal__info-comp.js';
import {funcInfoEnumsOpenModal} from '../../modal/__enums/modal__enums.js';

/* св-ва комплектующего в модальном окне */
export const funcGetComponentInfoProps = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"compontsprops", "count":"100", "uincompont":`${uin}`}
    funcCommand(body, funcProcessGetComponentInfoProps);
}

const funcProcessGetComponentInfoProps = (result, respobj) => {
    //responseProcessor(result, respobj.succ);
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
    /*if(select_unic.checked === true){
        for(i of inputs){i.disabled = false};
    } else {
        select_unic.checked = false;
        for(i of inputs){i.disabled = true};
    }*/

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-compontsprops");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"compontsprops", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }

            funcCommand(body, funcProcessOnlyInfo);
        })
    })
    
    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-compontsprops");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"compontsprops", "uin":`${elem.value}`, "uincompont":`${elem.name}`, "uinprops":"", "value":"", "d1":"", "d2":"", "perc":""};

            let target_table = main_tb_modal_info_component;
            body.uinprops    = findForUpdateSelect(target_table, "component_info_props_select_", elem.value);

            let prop_value   = document.getElementById(`component_info_props_value_select__${elem.value}`);
            let value;
            if(prop_value.tagName === "SELECT"){
                value = prop_value.options[prop_value.selectedIndex].text
                body.value = value;
            } else {
                body.value = prop_value.value;
            }

            body.d1   = 0//findForUpdateInput(`component_info_d1_${elem.value}`, target_table);
            body.d2   = 0//findForUpdateInput(`component_info_d2_${elem.value}`, target_table);
            body.perc = 0//findForUpdateInput(`component_info_perc_${elem.value}`, target_table);

            funcCommand(body, funcProcessOnlyConsole);
            highlightButtonSave(elem);
            funcGetComponentInfo(elem.name);
            setTimeout(function(){funcGetComponentInfoProps(elem.name)}, 100);
        })
    })

    let button_control = document.querySelectorAll(".button__control_modal-props-info");
    button_control.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoEnumsOpenModal(elem.value, elem.name);
        })
    })
}

const addComponentInfoProps = (props, propsUin, meas, value, perc, d1, d2, del, uin, uincompont, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow     = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellInfo    = newRow.insertCell(0); cellInfo.classList   = "td";
    let cellProps   = newRow.insertCell(1); cellProps.classList   = "td";
    let cellMeas    = newRow.insertCell(2); cellMeas.classList    = "td";
    let cellPropVal = newRow.insertCell(3); cellPropVal.classList = "td";
    //let cellPerc    = newRow.insertCell(4); cellPerc.classList    = "td";
    //let cellD1      = newRow.insertCell(5); cellD1.classList      = "td";
    //let cellD2      = newRow.insertCell(6); cellD2.classList      = "td";
    let cellBtn     = newRow.insertCell(4); cellBtn.classList     = "td";

    cellInfo.innerHTML = `<button class="button__control button__control_modal-props-info" value="${propsUin}" name="${props}"><img class="button__control__img" src="assets/images/info.svg" alt=""></button>`;

    makeSelect("component_info_props_select_", uin, props, propsUin, "typesprops_list", "select", cellProps);
    cellMeas.innerHTML  = meas;

    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"enums", "uinprops":`${propsUin}`, "count":"100", "sort":"uin"};
    funcCommand(body, funcProcessGetInfoEnumsForModalComp);

    function funcProcessGetInfoEnumsForModalComp(result, respobj){
        //responseProcessor(result, respobj.succ);

        if(respobj.answ != ''){
            localStorage.setItem("prop_enums_list", JSON.stringify(respobj.answ))
            makeSelect("component_info_props_value_select_", uin, value, '---', "prop_enums_list", "select", cellPropVal);
        } else {
            let input = document.createElement('input');
            input.className = "input__type-text input__type-text_title";
            input.id = `component_info_props_value_select__${uin}`;
            input.value = value;
            cellPropVal.appendChild(input);
        }
    }

    //cellPerc.innerHTML  = `<input class="input__type-text" type="text" name="component_info_perc_${uin}" value="${perc}">`;
    //cellD1.innerHTML    = `<input class="input__type-text" type="text" name="component_info_d1_${uin}" value="${d1}">`;
    //cellD2.innerHTML    = `<input class="input__type-text" type="text" name="component_info_d2_${uin}" value="${d2}">`;

    let select = document.getElementById(`component_info_props_select__${uin}`);
    select.addEventListener("change", function (){
        addEventSelectProps(select, `component_info_props_value_select__${uin}`);
    });

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-compontsprops" value="${uin}" name="${uincompont}"><img class="button__control__img" src="assets/images/arrow_3.svg"></button><button class="button__control button__control_mdel button__control_mdel-compontsprops${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add = document.getElementById("component_info_add_button");
button_control_add.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"compontsprops", "uincompont":`${button_control_add.value}`, "uinprops":"", "value":"", "d1":"", "d2":"", "perc":""};

    let uinprops_value = document.getElementById(`component_info_add_props_select`).value;

    let prop_select_value = document.getElementById(`component_info_add_props_value_select`);
    let prop_input_value = document.getElementById(`component_info_add_props_value_input`);
    let value;
    if(prop_select_value.style.display === "inline"){
        value = prop_select_value.options[prop_select_value.selectedIndex].text
    } else {
        value = prop_input_value.value;
    }

    let d1_value       = 0//document.getElementById(`component_info_add_d1`).value;
    let d2_value       = 0//document.getElementById(`component_info_add_d2`).value;
    let perc_value     = 0//document.getElementById(`component_info_add_perc`).value;

    if(uinprops_value === "" || value === "" || perc_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.uinprops = uinprops_value;
        body.value    = value;
        body.d1       = d1_value;
        body.d2       = d2_value;
        body.perc     = perc_value;
        
        removeOptionsSetValue(`component_info_add_props_select`, "---");
        removeOptionsSetValue(`component_info_add_props_value_select`, "---");
        document.getElementById(`component_info_add_props_value_input`).value = "";
        //document.getElementById(`component_info_add_d1`).value = "0";
        //document.getElementById(`component_info_add_d2`).value = "0";
        //document.getElementById(`component_info_add_perc`).value = "0";
        
        funcCommand(body, funcProcessOnlyInfo);
        
        setTimeout(function(){funcGetComponentInfo(button_control_add.value);}, 100);
        setTimeout(function(){funcGetComponentInfoProps(button_control_add.value)}, 150);
    }
})

export const addEventSelectProps = (select, select_value_id) => {
    let body_1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"props", "count":"100", "filt":`[{"fld":"uin","val":["${select.value}"]}]`};
    funcCommand(body_1, funcSelectAddMeasOnTable);

    function funcSelectAddMeasOnTable(result, respobj){
        //responseProcessor(result, respobj.succ);

        select.parentElement.nextElementSibling.innerText = respobj.answ[0].meas.name;
    }

    let body_2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"enums", "uinprops":`${select.value}`, "count":"100", "sort":"uin", "all":"0"};
    funcCommand(body_2, funcSelectAddEnumsOnTable);

    let select_value = document.getElementById(select_value_id);
    function funcSelectAddEnumsOnTable(result, respobj){
        //responseProcessor(result, respobj.succ);
        console.log(respobj)

        if(respobj.answ != 0){
            removeOptions(select_value);
            let arr = respobj.answ;
            for (let key in arr) {
                if(arr[key].del === 0){
                    let newOption = new Option(arr[key].name, arr[key].uin);
                    select_value.append(newOption);
                }
            }
        } else {
            let prop_value   = document.getElementById(`component_info_props_value_select__${elem.value}`);
        }
    }
}