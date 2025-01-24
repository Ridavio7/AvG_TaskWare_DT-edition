import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave, addToDropdown} from '../../../js/common/common.js';

export const funcGetContragents = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"contragents", "count":"100"};
    funcCommand(body, funcProcessGetContragents);
}

const funcProcessGetContragents = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Контрагенты:", respobj);

    let contragents_list = respobj.answ;
    localStorage.setItem("contragents_list", JSON.stringify(contragents_list));
    
    let tb_id = "tb_contragents";
    clearTable(tb_id);

    for (let key in respobj.answ) {
        let set = respobj.answ[key];
        let name = set.name;
        let kpp = set.kpp;
        let inn = set.inn;
        let address = set.address;
        let del = set.del;
        let uin = set.uin;
        addContragentsRow(name, kpp, inn, address, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-contragents");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"contragents", "uin":`${elem.value}`};

            if(elem.style.background === "red"){
                elem.style.background = "inherit";
            } else {
                elem.style.background = "red"
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-contragents");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update", "obj":"contragents", "name":"", "inn":"", "kpp":"", "address":"", "uin":`${elem.value}`};

            let target_table = tb_contragents;
            body.name    = findForUpdateInput(`name_${elem.value}`, target_table);
            body.inn     = findForUpdateInput(`inn_${elem.value}`, target_table);
            body.kpp     = findForUpdateInput(`kpp_${elem.value}`, target_table);
            body.address = findForUpdateInput(`address_${elem.value}`, target_table);

            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetContragents()}, 100);
        })
    })
}

const addContragentsRow = (name, kpp, inn, address, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName    = newRow.insertCell(0); cellName.classList    = "td";
    let cellKpp     = newRow.insertCell(1); cellKpp.classList     = "td";
    let cellInn     = newRow.insertCell(2); cellInn.classList     = "td";
    let cellAddress = newRow.insertCell(3); cellAddress.classList = "td";
    let cellBtn     = newRow.insertCell(4); cellBtn.classList     = "td";

    cellName.innerHTML    = `<input class="input__type-text" type="text" value="${name}" name="name_${uin}">`;
    cellKpp.innerHTML     = `<input class="input__type-text" type="text" value="${kpp}" name="kpp_${uin}">`;
    cellInn.innerHTML     = `<input class="input__type-text" type="text" value="${inn}" name="inn_${uin}">`;
    cellAddress.innerHTML = `<input class="input__type-text" type="text" value="${address}" name="address_${uin}">`;

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update-contragents" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel-contragents" style="background:${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add = document.querySelector(".button__control_add-contragents");
button_control_add.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"add", "obj":"contragents", "name":"", "inn":"", "kpp":"", "address":""};

    let name_value    = document.getElementById("input_add_contragents_name").value
    let kpp_value     = document.getElementById("input_add_contragents_inn").value
    let inn_value     = document.getElementById("input_add_contragents_kpp").value
    let address_value = document.getElementById("input_add_contragents_address").value

    if(name_value === "" || kpp_value === "" || inn_value === "" || address_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;
        body.kpp = kpp_value;
        body.inn = inn_value;
        body.address = address_value;
    
        document.getElementById("input_add_contragents_name").value = "";
        document.getElementById("input_add_contragents_inn").value = "";
        document.getElementById("input_add_contragents_kpp").value = "";
        document.getElementById("input_add_contragents_address").value = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetContragents()}, 100);
    }
})

listenSortSelect("sort_contragents", "tb_contragents", "contragents", funcProcessGetContragents);