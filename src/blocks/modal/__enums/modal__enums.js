import {funcCommand, funcProcessOnlyInfo, clearTable, highlightButtonSave, findForUpdateInput} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';

let enums_modal = document.getElementById("enums_modal");
let enums_close = document.getElementById("enums_close");
let enums_title = document.getElementById("enums_title");
let propUinForAdd = null;

enums_close.addEventListener("click", () => {
    enums_modal.style.display = "none";
})

dragElement(enums_modal);

export const funcInfoEnumsOpenModal = (uin, name) => {
    enums_modal.style.display = "block";

    enums_title.value = `Св-во: ${name}`;

    propUinForAdd = uin;

    funcGetInfoEnums(uin);
}

const funcGetInfoEnums = (uin) => {
    let body  =  {"user":"demo", "meth":"view", "obj":"enums", "uinprops":`${uin}`, "count":"100", "sort":"uin"}
    funcCommand(body, funcProcessGetInfoEnums);
}

const funcProcessGetInfoEnums = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Значения:", respobj);

    let tb_id = "enums_tb_modal";
    clearTable(tb_id);

    if(respobj.answ === ''){
        clearTable(tb_id);
    } else {
        for (let key in respobj.answ){
            let obj  = respobj.answ[key];
            let name = obj.name;
            let uin  = obj.uin;
            let del  = obj.del;
            addInfoEnums(name, uin, del, tb_id);
        }
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-enums");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"enums", "uin":`${elem.value}`}

            if(elem.style.background === "red"){
                elem.style.background = "inherit";
            } else {
                elem.style.background = "red"
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-enums");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update","obj":"enums", "uin":`${elem.value}`, "uinprops":`${propUinForAdd}`, "name":""};
            
            let target_table = enums_tb_modal;
            body.name = findForUpdateInput(`enum_name_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetInfoEnums(propUinForAdd)}, 100);
        })
    })

    let button_control_add = document.getElementById('enums_add_button');
    button_control_add.onclick = () => {
        let body  =  {"user":"demo", "meth":"add", "obj":"enums", "uinprops":`${propUinForAdd}`, "name":""}

        let name_value = document.getElementById("enums_add_input").value;

        if(name_value === ""){
            alert("Вы не заполнили все поля!");
        } else {
            body.name = name_value;

            document.getElementById("enums_add_input").value = "";

            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(function(){funcGetInfoEnums(propUinForAdd)}, 100);
        }
    }
}

const addInfoEnums = (name, uin, del, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow   = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellEnum = newRow.insertCell(0); cellEnum.classList = "td";
    let cellBtn  = newRow.insertCell(1); cellBtn.classList = "td";

    cellEnum.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="enum_name_${uin}">`;

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update-enums" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel-enums" style="background:${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}