import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave, responseProcessor} from '../../../js/common/common.js';
import {funcInfoTypeselemOpenModal} from '../../modal/__typeselem/modal__typeselem.js';
import {customSortSelect} from '../../select/select.js';

export const funcGetTypeselem = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"typeselem", "count":"100"};
    funcCommand(body, funcProcessGetTypeselem);
}

const funcProcessGetTypeselem = (result, respobj) => {
    console.log("Типы элем.:", respobj);

    let tb_id = "tb_componenets_typeselem";
    clearTable(tb_id);

    let typelm_list = respobj.answ;
    localStorage.setItem("typelm_list", JSON.stringify(typelm_list));
    for (let key in respobj.answ){
        let set = respobj.answ[key];
        let name = set.name;
        let del = set.del;
        let uin = set.uin;
        addTypeselemRow(name, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-typeselem");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"typeselem", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }

            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-typeselem");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"typeselem", "name":"", "uin":`${elem.value}`};

            let target_table = tb_componenets_typeselem;
            body.name = findForUpdateInput(`typeselem_name_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetTypeselem()}, 100);
        })
    })

    let button_modal_typeselem = document.querySelectorAll(".button__control_modal-typeselem");
    button_modal_typeselem.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoTypeselemOpenModal(elem.value);
        })
    })
}

const addTypeselemRow = (name, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellInfo = newRow.insertCell(0); cellInfo.classList = "td td_nowrap-content";
    let cellName = newRow.insertCell(1); cellName.classList = "td td__text_align_center";
    let cellBtn  = newRow.insertCell(2); cellBtn.classList  = "td";

    cellInfo.innerHTML = `<button class="button__control button__control_modal-typeselem" value="${uin}"><img class="button__control__img" src="assets/images/info.svg" alt="" title="Инфо"></button><input class="input__type-text" type="text" value="${name}" name="typeselem_name_${uin}">`;
    cellName.innerHTML = ``;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-typeselem" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="" title="Обновить"></button><button class="button__control button__control_mdel button__control_mdel-typeselem${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

let button_control_add_product = document.querySelector(".button__control_add-typeselem");
button_control_add_product.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"typeselem", "name":""};

    let name_value = document.getElementById("input_add_typeselem").value

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;
    
        document.getElementById("input_add_typeselem").value = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetTypeselem()}, 100);
    }
})

customSortSelect("sort_typeselem");
const dropdown = document.getElementById("sort_typeselem");
const options  = dropdown.querySelectorAll('li');
options.forEach(option => {
    option.addEventListener('click', () => {
        switch (option.getAttribute('data-value')){
            case '1':
                let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"typeselem", "count":"5000", "sort":"name"};
                funcCommand(body1, funcProcessGetTypeselem);
            break;
            case '2':
                let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"typeselem", "count":"5000", "asort":"name"};
                funcCommand(body2, funcProcessGetTypeselem);
            break;
            case '3':
                let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"typeselem", "count":"5000", "sort":"uin"};
                funcCommand(body3, funcProcessGetTypeselem);
            break;
            case '4':
                let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"typeselem", "count":"5000", "asort":"uin"};
                funcCommand(body4, funcProcessGetTypeselem);
            break;
        }
    })
})