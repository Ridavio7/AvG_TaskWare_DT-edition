import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave} from '../../../js/common/common.js';

export const funcGetStatuses = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"statuses", "count":"100"};
    funcCommand(body, funcProcessGetStatuses);
}

const funcProcessGetStatuses = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Статусы:", respobj);
    let tb_id = "tb_statuses_shipment";
    clearTable(tb_id);

    let statuses_list = respobj.answ;
    localStorage.setItem("statuses_list", JSON.stringify(statuses_list));

    for (let key in respobj.answ){
        let set = respobj.answ[key];
        let name = set.name;
        let del = set.del;
        let uin = set.uin;
        addStatusesRow(name, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-statuses");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"statuses", "uin":`${elem.value}`};
    
            if(elem.style.background === "red"){
            elem.style.background = "inherit";
            } else {
            elem.style.background = "red"
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-statuses");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update", "obj":"statuses", "name":"", "uin":`${elem.value}`};
    
            let target_table = tb_statuses_shipment;
            body.name = findForUpdateInput(`statuses_name_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetStatuses();}, 100);
        })
    })
}

const addStatusesRow = (name, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName = newRow.insertCell(0); cellName.classList = "td";
    let cellBtn  = newRow.insertCell(1); cellBtn.classList  = "td";

    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="statuses_name_${uin}">`;

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update-statuses" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel-statuses" style="background:${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add = document.querySelector(".button__control_add-statuses-shipment");
button_control_add.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"add", "obj":"statuses", "name":""};
    
    let name_value = document.getElementById("input_add_statuses_shipment_name").value

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;

        document.getElementById("input_add_statuses_shipment_name").value = "";

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetStatuses();}, 100);
    }
})

listenSortSelect("sort_statuses_shipment", "tb_statuses_shipment", "statuses", funcProcessGetStatuses);