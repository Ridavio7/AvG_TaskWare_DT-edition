import {funcCommand, funcProcessOnlyInfo, clearTable, removeOptionsSetValue, addToDropdown} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';

let modal_typeselem = document.getElementById("modal_typeselem");
let span_typeselem  = document.getElementById("close_typeselem");
let typeUinForAdd   = null;

span_typeselem.addEventListener("click", () => {
    modal_typeselem.style.display = "none";
})

dragElement(modal_typeselem);

export const funcInfoTypeselemOpenModal = (uin) => {
    modal_typeselem.style.display = "block";

    funcGetInfoTypeselem(uin);
}

const funcGetInfoTypeselem = (uin) => {
    let body  =  {"user":"demo", "meth":"view","obj":"typesprops", "count":"100", "uintypes":`${uin}`}
    funcCommand(body, funcProcessGetInfoTypeselem);
}

const funcProcessGetInfoTypeselem = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Св-ва типа:", respobj);

    document.getElementById("typeselem_title").value = "";

    let tb_id = "tb_modal_typeselem";
    clearTable(tb_id);

    removeOptionsSetValue("typeselem_add_props_select", "---");
    addToDropdown(typeselem_add_props_select, "props_list")

    if(respobj.answ === ''){
        let compName = respobj.answDop.name;
        let typeUin  = respobj.answDop.uintypes;
        let propName = '---';
        let propUin  = '';
        let meas     = '---';
        let del      = '';
        clearTable(tb_id);
        addInfoTypeselem(compName, typeUin, propName, propUin, meas, del, tb_id, respobj.answ);
    } else {
        let compName = respobj.answDop.name;
        let typeUin  = respobj.answDop.uintypes;
        for (let key in respobj.answ){
            let prop     = respobj.answ[key];
            let propName = prop.name;
            let propUin  = prop.uin;
            let meas     = prop.meas;
            let del      = prop.del;
            addInfoTypeselem(compName, typeUin, propName, propUin, meas, del, tb_id, respobj.answ);
        }
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-typeselem-info");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"typesprops", "uintypes":`${elem.value}`, "uinprops":`${elem.name}`};

            if(elem.style.background === "red"){
                elem.style.background = "inherit";
            } else {
                elem.style.background = "red"
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    let button_control_add = document.getElementById('typeselem_add_button');
    button_control_add.onclick = () => {
        let body  =  {"user":"demo", "meth":"add", "obj":"typesprops", "uintypes":`${typeUinForAdd}`, "uinprops":""};

        let uinprops_value = document.getElementById("typeselem_add_props_select").value;

        if(uinprops_value === ""){
            alert("Вы не заполнили все поля!");
        } else {
            body.uinprops = uinprops_value;

            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(function(){
                funcGetInfoTypeselem(typeUinForAdd);
            }, 100);
        }
    }
}

const addInfoTypeselem = (compName, typeUin, propName, propUin, meas, del, tb_id, arr) => {
    document.getElementById("typeselem_title").value = `Тип: ${compName}`;
    typeUinForAdd = typeUin;

    let tableRef = document.getElementById(tb_id);
    let newRow   = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellProps = newRow.insertCell(0); cellProps.classList = "td";
    let cellMeas  = newRow.insertCell(1); cellMeas.classList = "td";
    let cellBtn   = newRow.insertCell(2); cellBtn.classList = "td";

    let select = document.createElement("select");
    select.classList = 'select';
    let option = document.createElement("option");
    option.text = propName;
    select.appendChild(option);
    cellProps.appendChild(select);

    for (let key in arr) {
        if(arr[key].del === 0){
        let newOption = new Option(arr[key].name, arr[key].uin);
        select.append(newOption);
        }
    }

    cellMeas.innerHTML = meas;

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel-typeselem-info" value="${typeUin}" name="${propUin}" style="background:${bx_color}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}