import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, findForUpdateSelect, makeSelect, clearTable, removeOptionsSetValue, sendFilt, clearFilt, listenSelect, listenSortSelect, addToDropdown, highlightButtonSave} from '../../../js/common/common.js';
import {addToDropdownPsevdo, psevdoSelect} from '../../select/select.js';

export const funcGetSNProd = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"snprod", "count":"100", "filt":`${JSON.stringify(filt_snprod)}`};
    funcCommand( body, funcProcessGetSNProd );
}

const funcProcessGetSNProd = (result, respobj) => {
    if( result === 0 ) return;
    console.log("SNProd:", respobj);
    let tb_id = "tb_products_SNProd";
    clearTable(tb_id);

    let select_product = document.getElementById("select_add_SNProd_product");
    addToDropdown(select_product, "products_list");

    let select_status = document.getElementById("select_add_SNProd_status");
    addToDropdown(select_status, "statussn_list");

    for (let key in respobj.answ) {
        let formula = respobj.answ[key];
        let led = formula.led;
        let name = formula.product.name;
        let uinproduct = formula.product.uin;
        let SN = formula.SN;
        let count = formula.count;
        let count_use = formula.count_use;
        let date = formula.date;
        let status = formula.status.name;
        let uinstatus = formula.status.uin;
        let del = formula.del;
        let uin = formula.uin;
        addSNProdRow(led, name, uinproduct, SN, count, count_use, date, status, uinstatus, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel_snprod = document.querySelectorAll(".button__control_mdel-snprod");
    button_control_mdel_snprod.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"snprod", "uin":`${elem.value}`};

            if(elem.style.background === "red"){
                elem.style.background = "inherit";
            } else {
                elem.style.background = "red"
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update_snprod = document.querySelectorAll(".button__control_update-snprod");
    button_control_update_snprod.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update", "obj":"snprod", "uinproduct":"", "SN":"", "count":"", "count_use":"", "date":"", "uinstatus":"",  "uin":`${elem.value}` };

            let target_table = tb_products_SNProd;
        
            body.uinproduct = findForUpdateSelect(target_table, "snprod_product_select_", elem.value);
            body.SN         = findForUpdateInput(`SN_${elem.value}`, target_table);
            body.count      = findForUpdateInput(`count_${elem.value}`, target_table);
            body.count_use  = findForUpdateInput(`count_use_${elem.value}`, target_table);
            body.date       = findForUpdateInput(`date_${elem.value}`, target_table);
            body.uinstatus  = findForUpdateSelect(target_table, "snprod_status_select_", elem.value);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetSNProd()}, 100);
        })
    })
}

function addSNProdRow(led, name, uinproduct, SN, count, count_use, date, status, uinstatus, del, uin, tb_id){
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let ceelLed      = newRow.insertCell(0); ceelLed.classList      = "td td__text_align_center";
    let cellName     = newRow.insertCell(1); cellName.classList     = "td";
    let cellSN       = newRow.insertCell(2); cellSN.classList       = "td td__text_align_center";
    let cellCount    = newRow.insertCell(3); cellCount.classList    = "td td__text_align_center";
    let cellCountUse = newRow.insertCell(4); cellCountUse.classList = "td td__text_align_center";
    let cellDate     = newRow.insertCell(5); cellDate.classList     = "td td__text_align_center";
    let cellStatus   = newRow.insertCell(6); cellStatus.classList   = "td";
    let cellBtn      = newRow.insertCell(7); cellBtn.classList      = "td";

    if(led === 0){
        ceelLed.innerHTML = `<img src="assets/images/ellipse_green.svg">`;
    } else if(led === 1){
        ceelLed.innerHTML = `<img src="assets/images/ellipse_orange.svg">`;
    } else if(led === 2){
        ceelLed.innerHTML = `<img src="assets/images/ellipse_white.svg">`;
    } else if(led === 3){
        ceelLed.innerHTML = `<img src="assets/images/ellipse_red.svg">`;
    }

    makeSelect("snprod_product_select_", uin, name, uinproduct, "products_list", "select", cellName);

    cellSN.innerHTML       = `<input class="input__type-text" type="text" value="${SN}" name="SN_${uin}">`;
    cellCount.innerHTML    = `<input class="input__type-text" type="text" value="${count}" name="count_${uin}">`;
    cellCountUse.innerHTML = `<input class="input__type-text" type="text" value="${count_use}" name="count_use_${uin}">`;
    cellDate.innerHTML     = `<input class="input__type-text" type="date" value="${date}" name="date_${uin}">`;

    makeSelect("snprod_status_select_", uin, status, uinstatus, "statussn_list", "select", cellStatus);

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update-snprod" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel-snprod" style="background:${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

addToDropdownPsevdo("filt_SNprod_products_items", JSON.parse(localStorage.getItem("products_list")));
psevdoSelect("filt_SNprod_products");

addToDropdownPsevdo("filt_SNprod_status_items", JSON.parse(localStorage.getItem("statussn_list")));
psevdoSelect("filt_SNprod_status");

let button_SNprod_choose = document.getElementById("button_SNprod_choose");
button_SNprod_choose.addEventListener("click", () => {
    sendFilt(filt_snprod, 'tb_products_SNProd', 'snprod', funcProcessGetSNProd);
});

let button_SNprod_reset = document.getElementById("button_SNprod_reset");
button_SNprod_reset.addEventListener("click", () => {
    filt_snprod.length = 0;
    clearFilt(filt_snprod, 'filt_SNprod_products_items', 'filt_SNprod_status_items', 'filt_SNprod_status_items', 'tb_products_SNProd', funcGetSNProd());
});

let select_1 = document.getElementById("filt_SNprod_products_items");
let select_2 = document.getElementById("filt_SNprod_status_items");
let filt_snprod = [], val_1 = [], val_2 = [],
filt_1 = {fld: "uin", on: "products"}, filt_2 = {fld: "uin", on: "statussn"};

listenSelect(select_1, filt_1, val_1, filt_snprod);
listenSelect(select_2, filt_2, val_2, filt_snprod);

let button_control_add_snprod = document.querySelector(".button__control_add-snprod");
button_control_add_snprod.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"add", "obj":"snprod", "uinproduct":"", "SN":"", "count":"", "count_use":"", "date":"", "uinstatus":"" };

    let uinproduct_value = document.getElementById("select_add_SNProd_product").value
    let SN_value = document.getElementById("input_add_SNProd_SN").value
    let count_value = document.getElementById("input_add_SNProd_count").value
    let count_use_value = document.getElementById("input_add_SNProd_count_use").value
    let date_value = document.getElementById("input_add_SNProd_date").value
    let uinstatus_value = document.getElementById("select_add_SNProd_status").value

    if(uinproduct_value === "" || SN_value === "" || count_value === "" || count_use_value === "" || date_value === "" || uinstatus_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.uinproduct = uinproduct_value;
        body.SN = SN_value;
        body.count = count_value;
        body.count_use = count_use_value;
        body.date = date_value;
        body.uinstatus = uinstatus_value;
    
        removeOptionsSetValue("select_add_SNProd_product", "-- Выберите изделие --");
        document.getElementById("input_add_SNProd_SN").value = "";
        document.getElementById("input_add_SNProd_count").value = "";
        document.getElementById("input_add_SNProd_count_use").value = "";
        document.getElementById("input_add_SNProd_date").value = "";
        removeOptionsSetValue("select_add_SNProd_status", "-- Выберите статус --");
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetSNProd()}, 100);
    }
})

listenSortSelect("sort_SNProd", "tb_products_SNProd", "snprod", funcProcessGetSNProd, filt_snprod);