import {funcCommand, funcProcessOnlyInfo, clearTable, removeOptionsSetValue, addToDropdown, responseProcessor} from '../../../js/common/common.js';
import {dragElement, resizeModalWindow, openModal, closeModal} from '../modal.js';

let modal_typeselem = document.getElementById("modal_typeselem");
let span_typeselem  = document.getElementById("close_typeselem");
let modal_resize    = document.getElementById("modal_typeselem_resize");

let typeUinForAdd   = null;

closeModal(modal_typeselem, span_typeselem);

dragElement(modal_typeselem);
resizeModalWindow(modal_resize, "whModalTypeselem", "Размеры окна свойства типа");

/* настройка размера окна */
const funcGetResize = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whModalTypeselem", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResize)
}

const funcProcessGetResize = (result, respobj) => {
    document.getElementById("modal_typeselem_resize").style.width  = `${respobj.answ.val[0]}px`;
    document.getElementById("modal_typeselem_resize").style.height = `${respobj.answ.val[1]}px`;
}

export const funcInfoTypeselemOpenModal = (uin) => {
    funcGetResize();
    openModal(modal_typeselem);

    funcGetInfoTypeselem(uin);
}

const funcGetInfoTypeselem = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view","obj":"typesprops", "count":"100", "uintypes":`${uin}`}
    funcCommand(body, funcProcessGetInfoTypeselem);
}

const funcProcessGetInfoTypeselem = (result, respobj) => {
    console.log("Св-ва типа:", respobj);

    document.getElementById("typeselem_title").innerHTML = "";

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
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"typesprops", "uintypes":`${elem.value}`, "uinprops":`${elem.name}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    let button_control_add = document.getElementById('typeselem_add_button');
    button_control_add.onclick = () => {
        let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"typesprops", "uintypes":`${typeUinForAdd}`, "uinprops":""};

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
    document.getElementById("typeselem_title").innerHTML = `Свойства типа ${compName}`;
    typeUinForAdd = typeUin;

    let tableRef = document.getElementById(tb_id);
    let newRow   = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellProps = newRow.insertCell(0); cellProps.classList = "td";
    let cellMeas  = newRow.insertCell(1); cellMeas.classList  = "td";
    let cellBtn   = newRow.insertCell(2); cellBtn.classList   = "td";

    cellProps.innerHTML = propName;

    cellMeas.innerHTML = meas;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel button__control_mdel-typeselem-info${bx_color}" value="${typeUin}" name="${propUin}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}