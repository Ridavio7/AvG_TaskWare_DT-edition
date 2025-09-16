import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave, responseProcessor} from '../../../js/common/common.js.js';
import {customSortSelect} from '../../select/select.js';

export const funcGetMeas = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"meas", "count":"100"};
    funcCommand(body, funcProcessGetMeas);
}

const funcProcessGetMeas = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    console.log("Ед. изм.:", respobj);

    let tb_id = "tb_componenets_measurement";
    clearTable(tb_id);

    let meas_list = respobj.answ;
    localStorage.setItem("meas_list", JSON.stringify(meas_list));
    
    for (let key in respobj.answ){
        let set = respobj.answ[key];
        let name = set.name;
        let del = set.del;
        let uin = set.uin;
        addMeasRow(name, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel_measurement = document.querySelectorAll(".button__control_mdel-measurement");
    button_control_mdel_measurement.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"meas", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update_measurement = document.querySelectorAll(".button__control_update-measurement");
    button_control_update_measurement.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"meas", "name":"", "uin":`${elem.value}`};

            let target_table = document.getElementById("tb_componenets_measurement");
            body.name = findForUpdateInput(`measurement_name_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetMeas()}, 100);
        })
    })
}

const addMeasRow = (name, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName = newRow.insertCell(0); cellName.classList = "td td__text_align_center";
    let cellBtn = newRow.insertCell(1);  cellBtn.classList  = "td";

    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="measurement_name_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-measurement" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="" title="Обновить"></button><button class="button__control button__control_mdel button__control_mdel-measurement${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

let button_control_add_measurement = document.querySelector(".button__control_add-measurement");
button_control_add_measurement.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"meas", "name":""};

    let name_value = document.getElementById("input_add_measurement").value

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;
    
        document.getElementById("input_add_measurement").value = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetMeas()}, 100);
    }
})

customSortSelect("sort_measurement");
const dropdown = document.getElementById("sort_measurement");
const options  = dropdown.querySelectorAll('li');
options.forEach(option => {
    option.addEventListener('click', () => {
        switch (option.getAttribute('data-value')){
            case '1':
                let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"meas", "count":"5000", "sort":"name"};
                funcCommand(body1, funcProcessGetMeas);
            break;
            case '2':
                let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"meas", "count":"5000", "asort":"name"};
                funcCommand(body2, funcProcessGetMeas);
            break;
            case '3':
                let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"meas", "count":"5000", "sort":"uin"};
                funcCommand(body3, funcProcessGetMeas);
            break;
            case '4':
                let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"meas", "count":"5000", "asort":"uin"};
                funcCommand(body4, funcProcessGetMeas);
            break;
        }
    })
})