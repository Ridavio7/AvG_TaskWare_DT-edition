/*import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, findForUpdateSelect, clearTable, makeSelect, removeOptionsSetValue, sendFilt, clearFilt, addToDropdown, listenSelect, listenSortSelect, highlightButtonSave, responseProcessor} from '../../../js/common/common.js.js';
import {addToDropdownPsevdo, psevdoSelect} from '../../select/select.js';
import {funcGetComponentsTreeSelect} from '../../modal/__select-comp/modal__select-comp.js';

let modal_select_component = document.getElementById("modal_select_component");

export const funcGetFormulaProducts = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"formula_products", "count":"100", "filt":`${JSON.stringify(filt_formula_products)}`};
    funcCommand(body, funcProcessGetFormulaProducts);
}

const funcProcessGetFormulaProducts = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    console.log("Состав изделия:", respobj);

    let tb_id = "tb_products_formula";
    clearTable(tb_id);

    let select_products = document.getElementById("select_add_products_formula_product");
    removeOptionsSetValue("select_add_products_formula_product", "-- Выберите изделие --");
    addToDropdown(select_products, "products_list");

    let select_innproducts = document.getElementById("select_add_products_formula_innproduct");
    removeOptionsSetValue("select_add_products_formula_innproduct", "-- Выберите изделие --");
    addToDropdown(select_innproducts, "products_list");

    for (let key in respobj.answ) {
        let formula     = respobj.answ[key];
        let product     = formula.product.name;
        let uinproduct  = formula.product.uin;
        let compont     = formula.compont;
        compont        != undefined ? compont = formula.compont.name : compont = "---";
        let uincompont  = formula.compont;
        uincompont     != undefined ? uincompont = formula.compont.uin : uincompont = "' '";
        let innprod     = formula.innprod;
        innprod        != undefined ? innprod = formula.innprod.name : innprod = "---";
        let uininnprod = formula.innprod;
        uininnprod    != undefined ? uininnprod = formula.innprod.uin : uininnprod = "' '";
        let count       = formula.count;
        let del         = formula.del;
        let uin         = formula.uin;
        addFormulaProductsRow(product, uinproduct, compont, uincompont, innprod, uininnprod, count, del, uin, tb_id);
    }

    let button_control_mdel_product = document.querySelectorAll(".button__control_mdel-product-formula");
    button_control_mdel_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"formula_products", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })
    
    let button_control_update_set = document.querySelectorAll(".button__control_update-product-formula");
    button_control_update_set.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"formula_products", "uincompont":"", "innprod":"", "uinproduct":"", "count":"",  "uin":`${elem.value}`};

            let target_table = tb_products_formula;
            
            body.uinproduct = findForUpdateSelect(target_table, "formula_product_products_select_", elem.value);
            body.innprod = findForUpdateSelect(target_table, "formula_product_innproducts_select_", elem.value);
            body.uincompont = document.getElementById(`formula_product_component_select_${elem.value}`).value;
            body.count = findForUpdateInput(`count_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetFormulaProducts()}, 100);
        })
    })

    let button_select_component = document.querySelectorAll(".button__select_component");
    button_select_component.forEach((elem) => {
        elem.addEventListener("click", () => {
            modal_select_component.style.display = "block";
            
            funcGetComponentsTreeSelect();
            localStorage.setItem("button_select_component_id", elem.id);
        })
    })
}

const addFormulaProductsRow = (product, uinproduct, compont, uincompont, innprod, uininnprod, count, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellProduct   = newRow.insertCell(0); cellProduct.classList   = "td";
    let cellInnroduct = newRow.insertCell(1); cellInnroduct.classList = "td";
    let cellСompont   = newRow.insertCell(2); cellСompont.classList   = "td";
    let cellCount     = newRow.insertCell(3); cellCount.classList     = "td td__text_align_center";
    let cellBtn       = newRow.insertCell(4); cellBtn.classList       = "td";

    makeSelect("formula_product_products_select_", uin, product, uinproduct, "products_list", "select", cellProduct);
    makeSelect("formula_product_innproducts_select_", uin, innprod, uininnprod, "products_list", "select", cellInnroduct);
    if(compont === "---"){
        cellСompont.innerHTML = `<button class="button__select button__select_component" id="formula_product_component_select_${uin}" value=" " disabled>${compont}</button>`;
    } else {
        cellСompont.innerHTML = `<button class="button__select button__select_component" id="formula_product_component_select_${uin}" value="${uincompont}">${compont}</button>`;
    }

    cellCount.innerHTML = `<input class="input__type-text" type="text" value="${count}" name="count_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-product-formula" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg"></button><button class="button__control button__control_mdel button__control_mdel-product-formula${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

addToDropdownPsevdo("filt_products_formula_products_items", JSON.parse(localStorage.getItem("products_list")));
psevdoSelect("filt_products_formula_products");

addToDropdownPsevdo("filt_products_formula_components_items", JSON.parse(localStorage.getItem("components_list")));
psevdoSelect("filt_products_formula_components");

let button_products_formula_choose = document.getElementById("button_products_formula_choose");
button_products_formula_choose.addEventListener("click", () => {
    sendFilt(filt_formula_products, 'tb_products_formula', 'formula_products', funcProcessGetFormulaProducts);
});

let button_products_formula_reset = document.getElementById("button_products_formula_reset");
button_products_formula_reset.addEventListener("click", () => {
    filt_formula_products.length = 0;
    clearFilt(filt_formula_products, 'filt_products_formula_products_items', 'filt_products_formula_components_items', 'filt_products_formula_components_items', 'tb_products_formula', funcGetFormulaProducts());
});

let select_1 = document.getElementById("filt_products_formula_products_items");
let select_2 = document.getElementById("filt_products_formula_components_items");
let filt_formula_products = []; let val_1 = [], val_2 = [],
filt_1 = {fld: "uin", on: "products"},
filt_2   = {fld: "uin", on: "components"};

listenSelect(select_1, filt_1, val_1, filt_formula_products);
listenSelect(select_2, filt_2, val_2, filt_formula_products);

let button_control_add_product_formula = document.querySelector(".button__control_add-product-formula");
button_control_add_product_formula.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add",  "obj":"formula_products", "uinproduct":"", "innprod":"", "uincompont":"", "count":""};

    let uinproduct_value = document.getElementById("select_add_products_formula_product").value;
    let innprod_value    = document.getElementById("select_add_products_formula_innproduct").value;
    let uincompont_value = document.getElementById("button_add_products_formula_component");
    let count_value      = document.getElementById("input_add_products_formula");
    
    if(uinproduct_value === "" || count_value.value === ""){
        alert("Вы не заполнили все поля!");
        if(innprod_value != "" && uincompont_value.value != ""){
            alert("Можно выбрать либо изделие, либо комплектующее!");
        }
    } else {
        body.uinproduct = uinproduct_value;
        body.innprod = innprod_value;
        body.uincompont = uincompont_value.value;
        body.count = count_value.value;
    
        removeOptionsSetValue("select_add_products_formula_product", "-- Выберите изделие --");
        removeOptionsSetValue("select_add_products_formula_innproduct", "-- Выберите изделие --");
        uincompont_value.innerText = "Выберите комплектующее";
        uincompont_value.value = "";
        count_value.value = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetFormulaProducts()}, 100);
    }
})

listenSortSelect("sort_products_formula", "tb_products_formula", "formula_products", funcProcessGetFormulaProducts, filt_formula_products);*/