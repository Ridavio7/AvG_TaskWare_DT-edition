import {funcCommand, clearTable, removeOptionsSetValue, removeOptions, addToDropdown, addToDropdownOneOption, funcProcessOnlyInfo, clearTableAll} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';
import {funcGetProductsTree} from '../../table/__storage-main/table__storage-main.js';

let modal_info_product            = document.getElementById("modal_info_product");
let span_info_product             = document.getElementById("info_product_close");
let input_info_product_name_title = document.getElementById("info_product_name_title");
let input_info_product_name       = document.getElementById("info_product_name");
let select_info_product_color     = document.getElementById("info_product_color");
let chb_info_product_fship        = document.getElementById("info_product_fship");
let tb_info_product_prod          = document.getElementById("tb_info_product_prod");
let button_info_product_add_prod  = document.getElementById("button_info_product_add_prod");
let tb_info_product_comp          = document.getElementById("tb_info_product_comp");
let button_info_product_add_comp  = document.getElementById("button_info_product_add_comp");
let tb_info_product_ost           = document.getElementById("tb_info_product_ost");
let button_info_product_save      = document.getElementById("button_info_product_save");
let button_info_product_add       = document.getElementById("button_info_product_add");

let inputIsChange  = false;
let selectIsChange = false;

span_info_product.onclick = function(){
    if(inputIsChange === true || selectIsChange === true){
        inputIsChange  = false;
        selectIsChange = false;

        let res = confirm("Вы не сохранили все изменения! Все равно выйти?");
        if(res === true) modal_info_product.style.display = "none";
    } else {
        modal_info_product.style.display = "none";
    }
}

dragElement(modal_info_product);

/* открытие модального окна */
export const funcInfoProductOpenModal = (uin) => {
    modal_info_product.style.display = "block";

    funcGetProductInfo(uin);
}

/* инфо о комплектующем в модальном окне */
export const funcGetProductInfo = (uin) => {
    let body  =  {"user":"demo", "meth":"view","obj":"products", "count":"1", "sort":"uin", "filt":`[{"fld":"uin","val":["${uin}"]}]`};
    funcCommand(body, funcProcessGetProductInfo);
}

const funcProcessGetProductInfo = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Изделие ИНФО:", respobj);

    while (select_info_product_color.options.length) {select_info_product_color.options[0] = null};

    for (let key in respobj.answ){
        let obj       = respobj.answ[key];
        let name      = obj.name;
        let colorName = obj.color.name === '' ? '---' : obj.color.name;
        let colorUin  = obj.color.uin;
        let fship     = obj.fship;
        let uin       = obj.uin;
        let uincat    = obj.uincat;
        addProductInfo(name, colorName, colorUin, fship, uin, uincat);
    }
}

const addProductInfo = (name, colorName, colorUin, fship, uin, uincat) => {
    input_info_product_name_title.innerHTML = name;
    input_info_product_name.value           = name;

    addToDropdownOneOption(select_info_product_color, colorName, colorUin);
    addToDropdown(select_info_product_color, "colors_list");

    chb_info_product_fship.checked = fship === 1 ? true : false;

    button_info_product_save.value         = uin;
    button_info_product_save.name          = uincat;
    button_info_product_save.style.display = "flex";
    button_info_product_add.style.display  = "none";

    setTimeout(() => {
        modal_info_product.querySelectorAll(".input__type-text").forEach((elem) => {
            elem.addEventListener('change', () => {inputIsChange = true});
        });
    
        modal_info_product.querySelectorAll(".select").forEach((elem) => {
            elem.addEventListener('change', () => {selectIsChange = true});
        });
    }, 500)
}

button_info_product_save.addEventListener('click', (elem) => {
    inputIsChange  = false;
    selectIsChange = false;

    let body  =  {"user":"demo", "meth":"update", "obj":"products", "uin":`${elem.target.value}`, "name":"", "uincat":`${elem.target.name}`};
    body.name = input_info_product_name.value;

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetProductsTree()}, 100);
})

/* функция добавления комплектующего */
export const funcProcessInfoProductsModalAdd = (uin) => {
    modal_info_product.style.display = "block";

    input_info_product_name_title.innerHTML = "";
    input_info_product_name.value           = "";
    chb_info_product_fship.parentElement.style.display  = "none";

    removeOptionsSetValue("info_product_color", "---");
    addToDropdown(select_info_product_color, "colors_list");

    tb_info_product_prod.parentElement.parentElement.style.display = "none";
    tb_info_product_comp.parentElement.parentElement.style.display = "none";
    tb_info_product_ost.parentElement.parentElement.style.display  = "none";

    button_info_product_add.value          = uin;
    button_info_product_add.style.display  = "flex";
    button_info_product_save.style.display = "none";
}

button_info_product_add.addEventListener("click", (elem) => {
    let body = {"user":"demo", "meth":"add", "obj":"products", "name":"", "uincat":`${elem.target.value}`};

    if(input_info_product_name.value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = input_info_product_name.value;

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetProductsTree()}, 100);
        setTimeout(function(){modal_info_product.style.display = "none";}, 150);
    }
})