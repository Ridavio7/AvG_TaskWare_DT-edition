import {funcCommand, removeOptionsSetValue, addToDropdown, addToDropdownOneOption, funcProcessOnlyInfo} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';
import {funcGetProductsTree} from '../../table/__storage-main/table__storage-main.js';
import {funcGetProductViewInside} from '../../table/__products-viewInside/table__products-viewInside.js';
import {funcInfoTcardprodsOpenModal} from '../__tcardprods/modal__tcardprods.js';

let modal_info_product            = document.getElementById("modal_info_product");
let span_info_product             = document.getElementById("info_product_close");
let input_info_product_name_title = document.getElementById("info_product_name_title");
let input_info_product_name       = document.getElementById("info_product_name");
let select_info_product_color     = document.getElementById("info_product_color");
let input_info_product_train      = document.getElementById("info_product_train");
let select_info_product_type      = document.getElementById("info_product_type");
let button_info_product_tcard     = document.getElementById("info_product_tcardprods");
let chb_info_product_fship        = document.getElementById("info_product_fship");
let tb_info_product_prod          = document.getElementById("tb_info_product_prod");
let tb_info_product_comp          = document.getElementById("tb_info_product_comp");
let button_info_product_save      = document.getElementById("button_info_product_save");
let button_info_product_add       = document.getElementById("button_info_product_add");

let inputIsChange  = false;

span_info_product.onclick = function(){
    if(inputIsChange === true){
        inputIsChange  = false;

        let res = confirm("Вы не сохранили все изменения! Все равно выйти?");
        if(res === true) modal_info_product.style.display = "none";
    } else {
        modal_info_product.style.display = "none";
    }

    document.getElementById("button_info_product_add_prod").textContent = 'Выберите изделие';
    document.getElementById("input_info_product_add_prod").value        = '';
    document.getElementById("button_info_product_add_comp").textContent = 'Выберите комплектующее';
    document.getElementById("input_info_product_add_comp").value        = '';
}

dragElement(modal_info_product);

/* открытие модального окна */
export const funcInfoProductOpenModal = (uin, fset) => {
    modal_info_product.style.display = "block";

    funcGetProductInfo(uin, fset);
    setTimeout(function(){funcGetProductViewInside(uin, fset)}, 100);
}

/* инфо о комплектующем в модальном окне */
export const funcGetProductInfo = (uin, fset) => {
    let type = fset == 0 ? "products" : "sets";
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":`${type}`, "count":"1", "sort":"uin", "filt":`[{"fld":"uin","val":["${uin}"]}]`};
    funcCommand(body, funcProcessGetProductInfo);
}

const funcProcessGetProductInfo = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Изделие ИНФО:", respobj);

    while (select_info_product_color.options.length) {select_info_product_color.options[0] = null};
    input_info_product_train.value = '';

    for (let key in respobj.answ){
        let obj       = respobj.answ[key];
        let name      = obj.name;
        let dopName   = obj.dopname;
        let dopUin    = obj.dopuin;
        let fship     = obj.fship;
        let uin       = obj.uin;
        let uincat    = obj.uincat;
        let fset      = obj.fset;
        addProductInfo(name, dopName, dopUin, fship, uin, uincat, fset);
    }

    setTimeout(() => {
        modal_info_product.querySelectorAll(".input__type-text").forEach((elem) => {
            elem.addEventListener('change', () => {inputIsChange = true});
        });
    }, 500)
}

const addProductInfo = (name, dopName, dopUin, fship, uin, uincat, fset) => {
    input_info_product_name_title.innerHTML = name;
    input_info_product_name.value           = name;

    addToDropdownOneOption(select_info_product_color, dopName, dopUin);
    addToDropdown(select_info_product_color, "colors_list");
    input_info_product_train.value = dopName;

    chb_info_product_fship.checked = fship === 1 ? true : false;

    if(fset == 0){
        select_info_product_color.parentElement.classList.remove("modal__input-wrapper_display-none");
        button_info_product_tcard.parentElement.classList.remove("modal__input-wrapper_display-none");
        input_info_product_train.parentElement.classList.add("modal__input-wrapper_display-none");
    } else {
        select_info_product_color.parentElement.classList.add("modal__input-wrapper_display-none");
        button_info_product_tcard.parentElement.classList.add("modal__input-wrapper_display-none");
        input_info_product_train.parentElement.classList.remove("modal__input-wrapper_display-none");
    }
    
    select_info_product_type.parentElement.classList.add("modal__input-wrapper_display-none");
    tb_info_product_prod.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
    tb_info_product_comp.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");

    button_info_product_tcard.value        = uin;
    button_info_product_save.value         = uin;
    button_info_product_save.name          = uincat;
    button_info_product_save.setAttribute("data-value", fset)
    button_info_product_save.style.display = "flex";
    button_info_product_add.style.display  = "none";
}

button_info_product_tcard.onclick = (elem) => {
    funcInfoTcardprodsOpenModal(elem.target.value);
}

button_info_product_save.onclick = (elem) => {
    inputIsChange  = false;
    let type = button_info_product_save.getAttribute("data-value");
    let name = input_info_product_name.value;
    let dopC = select_info_product_color.value;
    let dopM = input_info_product_train.value;

    let body = type == 0 ?
    {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"products", "uin":`${elem.target.value}`, "name":`${name}`, "uincat":`${elem.target.name}`, "dopuin":`${dopC}`} :
    {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"sets", "uin":`${elem.target.value}`, "name":`${name}`, "uincat":`${elem.target.name}`, "dopname":`${dopM}`};

    console.log(body)
    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){
        let button_control_update_prod = document.querySelectorAll(".button__control_update_formula-product-innprod");
        button_control_update_prod.forEach((elem) => {elem.click()})
        let button_control_update_comp = document.querySelectorAll(".button__control_update_formula-product-componenet");
        button_control_update_comp.forEach((elem) => {elem.click()})
    }, 50);
    setTimeout(function(){funcGetProductsTree()}, 150);
}

/* функция добавления комплектующего */
export const funcProcessInfoProductsModalAdd = () => {
    modal_info_product.style.display = "block";

    input_info_product_name_title.innerHTML = "";
    input_info_product_name.value           = "";
    chb_info_product_fship.parentElement.classList.add("modal__input-wrapper_display-none");

    removeOptionsSetValue("info_product_color", "---");
    addToDropdown(select_info_product_color, "colors_list");

    select_info_product_type.parentElement.classList.remove("modal__input-wrapper_display-none");
    select_info_product_color.parentElement.classList.add("modal__input-wrapper_display-none");
    input_info_product_train.parentElement.classList.add("modal__input-wrapper_display-none");
    tb_info_product_prod.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    tb_info_product_comp.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");

    button_info_product_add.style.display  = "flex";
    button_info_product_save.style.display = "none";
}

button_info_product_add.onclick = (elem) => {
    let name = input_info_product_name.value;
    let type = select_info_product_type.value;

    let body = type == 0 ?
    {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"products", "name":`${name}`, "uincat":`${elem.target.value}`} :
    {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"sets", "name":`${name}`, "uincat":`${elem.target.value}`};

    if(name === "" || type === " "){
        alert("Вы не заполнили все поля!");
    } else {

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetProductsTree()}, 100);
        setTimeout(function(){modal_info_product.style.display = "none";}, 150);
    }
}