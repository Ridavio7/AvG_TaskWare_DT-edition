import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, findForUpdateSelect, addToDropdown, makeSelect, clearTable, listenSortSelect, highlightButtonSave, removeOptionsSetValue} from '../../../js/common/common.js';
import {funcInfoEnumsOpenModal} from '../../modal/__enums/modal__enums.js';

export const funcGetProps = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"props", "count":"100"};
    funcCommand(body, funcProcessGetProps);
}

const funcProcessGetProps = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Свойства:", respobj);
    let tb_id = "tb_componenets_props";
    clearTable(tb_id);

    let props_list = respobj.answ;
    localStorage.setItem("props_list", JSON.stringify(props_list));

    let select = document.getElementById("select_add_props");
    addToDropdown(select, "meas_list");

    for (let key in respobj.answ){
        let set     = respobj.answ[key];
        let name    = set.name;
        let del     = set.del;
        let uin     = set.uin;
        let meas    = set.meas.name;
        let uinmeas = set.meas.uin;
        addPropsRow(name, del, uin, meas, uinmeas, tb_id);
    }

    /* функция удаления */
    let button_control_mdel_product = document.querySelectorAll(".button__control_mdel-prop");
    button_control_mdel_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"props", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update_product = document.querySelectorAll(".button__control_update-prop");
    button_control_update_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update", "obj":"props", "name":"", "uin":`${elem.value}`, "uinmeas":""};

            let target_table = tb_componenets_props;
            body.name = findForUpdateInput(`props_name_${elem.value}`, target_table);
            body.uinmeas = findForUpdateSelect(target_table, "props_select_", elem.value);

            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetProps()}, 100);
        })
    })

    let button_modal_enums = document.querySelectorAll(".button__control_modal-enums");
    button_modal_enums.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoEnumsOpenModal(elem.value, elem.name);
        })
    })
}

const addPropsRow = (name, del, uin, meas, uinmeas, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellInfo = newRow.insertCell(0); cellInfo.classList = "td td__text_align_center";
    let cellName = newRow.insertCell(1); cellName.classList = "td td__text_align_center";
    let cellMeas = newRow.insertCell(2); cellMeas.classList = "td td__text_align_center";
    let cellBtn  = newRow.insertCell(3); cellBtn.classList  = "td";

    cellInfo.innerHTML = `<button class="button__control button__control_modal-enums" value="${uin}" name="${name}"><img class="button__control__img" src="assets/images/info.svg" alt=""></button>`;
    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="props_name_${uin}">`;
    makeSelect("props_select_", uin, meas, uinmeas, "meas_list", "select", cellMeas);

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-prop" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel button__control_mdel-prop${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add_product = document.querySelector(".button__control_add-props");
button_control_add_product.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"add", "obj":"props", "name":"", "uinmeas":""};

    let name_value = document.getElementById("input_add_props").value;
    let uinmeas_value = document.getElementById("select_add_props").value;

    if(name_value === "" && uinmeas_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;
        body.uinmeas = uinmeas_value;

        document.getElementById("input_add_props").value = "";
        removeOptionsSetValue("select_add_props", "-- Выберите ед. изм. --");

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetProps()}, 100);
    }
})

listenSortSelect("sort_props", "tb_componenets_props", "props", funcProcessGetProps);