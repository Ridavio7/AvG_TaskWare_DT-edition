import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, findForUpdateSelect, clearTable, removeOptionsSetValue, makeSelect, sendFilt, clearFilt, listenSelect, listenSortSelect, addToDropdown, highlightButtonSave} from '../../../js/common/common.js';
import {addToDropdownPsevdo, psevdoSelect} from '../../select/select.js';
import {funcGetComponentsTreeSelect} from '../../modal/__select-comp/modal__select-comp.js';

let modal_select_component = document.getElementById("modal_select_component");

export const funcGetFormulaSets = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"formula_sets", "count":"100"};
    funcCommand(body, funcProcessGetFormulaSets);
}

const funcProcessGetFormulaSets = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Состав комплектов:", respobj);
    let tb_id = "tb_sets_formula_info";
    clearTable(tb_id);

    let select_sets = document.getElementById("select_add_formula_sets_set");
    addToDropdown(select_sets, "sets_list");

    let select_products = document.getElementById("select_add_formula_sets_prod");
    addToDropdown(select_products, "products_list");

    for (let key in respobj.answ) {
        let formula = respobj.answ[key];
        let set = formula.set.name;
        let product = formula.product;
        product != undefined ? product = formula.product.name : product = "---";
        let compont = formula.compont;
        compont != undefined ? compont = formula.compont.name : compont = "---";
        let count = formula.count;
        let del = formula.del;
        let uin = formula.uin;
        let uinset = formula.set.uin;
        let uinproduct = formula.product;
        uinproduct != undefined ? uinproduct = formula.product.uin : uinproduct = " ";
        let uincompont = formula.compont;
        uincompont != undefined ? uincompont = formula.compont.uin : uincompont = " ";
        addFormulaSetsRow(set, product, compont, count, del, uin, uinset, uinproduct, uincompont, tb_id);
    }

    /* функция удаления */
    let button_control_mdel_set_formula = document.querySelectorAll(".button__control_mdel-set-formula");
    button_control_mdel_set_formula.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"formula_sets", "uin":`${elem.value}`};

            if(elem.style.background === "red"){
                elem.style.background = "inherit";
            } else {
                elem.style.background = "red";
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update_set = document.querySelectorAll(".button__control_update-set-formula");
    button_control_update_set.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update", "obj":"formula_sets", "uinset":"", "uinproduct":"", "uincompont":"", "count":"", "uin":`${elem.value}`};

            let target_table = tb_sets_formula_info;
        
            body.uinset     = findForUpdateSelect(target_table, "formula_sets_set_select_", elem.value);
            body.uinproduct = findForUpdateSelect(target_table, "formula_sets_products_select_", elem.value);
            body.uincompont = document.getElementById(`formula_sets_component_select_${elem.value}`).value;
            body.count      = findForUpdateInput(`count_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetFormulaSets()}, 100);
        })
    })

    let button_select_component = document.querySelectorAll(".button__select_component");
    button_select_component.forEach((elem) => {
        elem.addEventListener("click", () => {
            if(window.location.hash.includes("_formula")){
                modal_select_component.style.display = "block";
            } else {
                modal_info_docpost.style.display = "none";
                modal_select_component.style.display = "block";
            }
            
            funcGetComponentsTreeSelect();
            localStorage.setItem("button_select_component_id", elem.id);
        })
    })
}

const addFormulaSetsRow = (set, product, compont, count, del, uin, uinset, uinproduct, uincompont, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellSet     = newRow.insertCell(0); cellSet.classList     = "td";
    let cellProduct = newRow.insertCell(1); cellProduct.classList = "td";
    let cellСompont = newRow.insertCell(2); cellСompont.classList = "td";
    let cellCount   = newRow.insertCell(3); cellCount.classList   = "td";
    let cellBtn     = newRow.insertCell(4); cellBtn.classList     = "td";

    makeSelect("formula_sets_set_select_", uin, set, uinset, "sets_list", "select", cellSet);
    makeSelect("formula_sets_products_select_", uin, product, uinproduct, "products_list", "select", cellProduct);
    if(compont === "---"){
        cellСompont.innerHTML = `<button class="button__select button__select_component" id="formula_sets_component_select_${uin}" value=" " disabled>${compont}</button>`;
    } else {
        cellСompont.innerHTML = `<button class="button__select button__select_component" id="formula_sets_component_select_${uin}" value="${uincompont}">${compont}</button>`;
    }

    cellCount.innerHTML = `<input class="input__type-text" type="text" value="${count}" name="count_${uin}">`;

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update-set-formula" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel-set-formula" style="background:${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

addToDropdownPsevdo("filt_sets_formula_sets_items", JSON.parse(localStorage.getItem("sets_list")));
psevdoSelect("filt_sets_formula_sets");

addToDropdownPsevdo("filt_sets_formula_products_items", JSON.parse(localStorage.getItem("products_list")));
psevdoSelect("filt_sets_formula_products");

addToDropdownPsevdo("filt_sets_formula_components_items", JSON.parse(localStorage.getItem("components_list")));
psevdoSelect("filt_sets_formula_components");

let button_sets_formula_choose = document.getElementById("button_sets_formula_choose");
button_sets_formula_choose.addEventListener("click", () => {
    sendFilt(filt_formula_sets, 'tb_sets_formula_info', 'formula_sets', funcProcessGetFormulaSets);
});

let button_sets_formula_reset = document.getElementById("button_sets_formula_reset");
button_sets_formula_reset.addEventListener("click", () => {
    clearFilt(filt_formula_sets, 'filt_sets_formula_sets_items', 'filt_sets_formula_products_items', 'filt_sets_formula_components_items', 'tb_sets_formula_info', funcGetFormulaSets())
});

let select_1 = document.getElementById("filt_sets_formula_sets_items");
let select_2 = document.getElementById("filt_sets_formula_products_items");
let select_3 = document.getElementById("filt_sets_formula_components_items");
let filt_formula_sets = [], val_1 = [], val_2 = [], val_3  = [],
filt_1  = {fld: "uin", on: "sets"}, filt_2  = {fld: "uin", on: "products"},
filt_3  = {fld: "uin", on: "components"};

listenSelect(select_1, filt_1, val_1, filt_formula_sets);
listenSelect(select_2, filt_2, val_2, filt_formula_sets);
listenSelect(select_3, filt_3, val_3, filt_formula_sets);

let button_control_add_set_formula = document.querySelector(".button__control_add-set-formula");
button_control_add_set_formula.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"add", "obj":"formula_sets", "uinset":"", "uinproduct":"", "count":"" };

    let uinset_value = document.getElementById("select_add_formula_sets_set").value;
    let uinproduct_value = document.getElementById("select_add_formula_sets_prod").value;
    let uincompont_value = document.getElementById("button_add_sets_formula_component");
    let count_value = document.getElementById("input_add_formula_sets_count");

    if(uinset_value === "" || count_value.value === ""){
        alert("Вы не заполнили все поля!");
        if(uinproduct_value != "" && uincompont_value.value != ""){
            alert("Можно выбрать либо изделие, либо комплектующее!");
        }
    } else {
        body.uinset = uinset_value;
        body.uinproduct = uinproduct_value;
        body.uincompont = uincompont_value.value;
        body.count = count_value.value;
    
        removeOptionsSetValue("select_add_formula_sets_set", "-- Выберите комплект --");
        removeOptionsSetValue("select_add_formula_sets_prod", "-- Выберите изделие --");
        uincompont_value.innerText = "Выберите комплектующее";
        uincompont_value.value = "";
        count_value.value = "";
        
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetFormulaSets()}, 100);
    }
})

listenSortSelect("sort_sets_formula", "tb_sets_formula_info", "formula_sets", funcProcessGetFormulaSets);