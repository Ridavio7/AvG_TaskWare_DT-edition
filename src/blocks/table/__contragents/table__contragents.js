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
        let obj     = respobj.answ[key];
        let name    = obj.name;
        let kpp     = obj.kpp;
        let inn     = obj.inn;
        let address = obj.address;
        let buy     = obj.buy;
        let vend    = obj.vend;
        let del     = obj.del;
        let uin     = obj.uin;
        addContragentsRow(name, buy, vend, kpp, inn, address, del, uin, tb_id);
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
            let body  =  {"user":"demo", "meth":"update", "obj":"contragents", "name":"", "inn":"", "kpp":"", "address":"", "uin":`${elem.value}`, "buy":"", "vend":""};

            let target_table = tb_contragents;
            body.name    = findForUpdateInput(`name_${elem.value}`, target_table);
            let buy_val  = document.getElementById(`input_contragents_buy_${elem.value}`);
            body.buy     = buy_val.checked === true ? "1" : "0";
            let vend_val = document.getElementById(`input_contragents_vend_${elem.value}`);
            body.vend    = vend_val.checked === true ? "1" : "0";
            body.inn     = findForUpdateInput(`inn_${elem.value}`, target_table);
            body.kpp     = findForUpdateInput(`kpp_${elem.value}`, target_table);
            body.address = findForUpdateInput(`address_${elem.value}`, target_table);

            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetContragents()}, 100);
        })
    })
}

const addContragentsRow = (name, buy, vend, kpp, inn, address, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName    = newRow.insertCell(0); cellName.classList    = "td";
    let cellBuy     = newRow.insertCell(1); cellBuy.classList     = "td";
    let cellVend    = newRow.insertCell(2); cellVend.classList    = "td";
    let cellKpp     = newRow.insertCell(3); cellKpp.classList     = "td";
    let cellInn     = newRow.insertCell(4); cellInn.classList     = "td";
    let cellAddress = newRow.insertCell(5); cellAddress.classList = "td";
    let cellBtn     = newRow.insertCell(6); cellBtn.classList     = "td";

    cellName.innerHTML    = `<input class="input__type-text" type="text" value="${name}" name="name_${uin}">`;
    let buy_checked       = buy === 1 ? 'checked' : '';
    cellBuy.innerHTML     = `<input class="checkbox" type="checkbox" id="input_contragents_buy_${uin}" ${buy_checked}><label for="input_contragents_buy_${uin}">`;
    let vend_checked      = vend === 1 ? 'checked' : '';
    cellVend.innerHTML    = `<input class="checkbox" type="checkbox" id="input_contragents_vend_${uin}" ${vend_checked}><label for="input_contragents_vend_${uin}">`;
    cellKpp.innerHTML     = `<input class="input__type-text" type="text" value="${kpp}" name="kpp_${uin}">`;
    cellInn.innerHTML     = `<input class="input__type-text" type="text" value="${inn}" name="inn_${uin}">`;
    cellAddress.innerHTML = `<input class="input__type-text" type="text" value="${address}" name="address_${uin}">`;

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update-contragents" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel-contragents" style="background:${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add = document.querySelector(".button__control_add-contragents");
button_control_add.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"add", "obj":"contragents", "name":"", "inn":"", "kpp":"", "address":"", "buy":"", "vend":""};

    let name_value    = document.getElementById("input_add_contragents_name").value;
    let buy_value     = document.getElementById("input_add_contragents_buy").value;
    let vend_value    = document.getElementById("input_add_contragents_vend").value;
    let kpp_value     = document.getElementById("input_add_contragents_inn").value;
    let inn_value     = document.getElementById("input_add_contragents_kpp").value;
    let address_value = document.getElementById("input_add_contragents_address").value;

    if(name_value === "" || kpp_value === "" || inn_value === "" || address_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;
        body.buy  = buy_value;
        body.vend = vend_value;
        body.kpp  = kpp_value;
        body.inn  = inn_value;
        body.address = address_value;
    
        document.getElementById("input_add_contragents_name").value    = "";
        document.getElementById("input_add_contragents_buy").checked   = "false";
        document.getElementById("input_add_contragents_vend").checked  = "false";
        document.getElementById("input_add_contragents_inn").value     = "";
        document.getElementById("input_add_contragents_kpp").value     = "";
        document.getElementById("input_add_contragents_address").value = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetContragents()}, 100);
    }
})

listenSortSelect("sort_contragents", "tb_contragents", "contragents", funcProcessGetContragents);