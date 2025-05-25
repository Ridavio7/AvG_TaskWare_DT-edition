import {funcCommand, clearTableAll, addToDropdown, removeOptionsSetValue} from '../../../js/common/common.js.js';
import {dragElement} from '../modal.js';
import {TreeBuilder} from '../../_tree/tree.js';
import {funcProcessInfoProductsModalAdd, funcInfoProductOpenModal} from '../../modal/__info-prod/modal__info-prod.js';
import {funcInfoProductsTransferOpenModal} from '../../modal/__transfer-prod/modal__transfer-prod.js';

let modal_select_prod = document.getElementById("modal_select_products");
let span_select_prod  = document.getElementById("close_products_select");

let uinCatc = null;

span_select_prod.onclick = () => {
    modal_select_prod.style.display = "none";
}

dragElement(modal_select_prod);

export const funcGetProductsTreeSelect = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catP", "count":"100"};
    funcCommand(body, funcProcessGetProductsTreeSelect);
}

function funcProcessGetProductsTreeSelect(result, respobj){
    if( result === 0 ) return;

    const tree = new TreeBuilder('modal_select_products_tree', 'dirP', 'catP', funcGetProductsTreeSelect, funcGetDirP, '', ["openall"]);
    tree.build(respobj.answ);
}

export const funcGetDirP = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view","obj":"dirP", "uin":`${uin}`, "count":"5000"};
    funcCommand(body, funcProcessGetProductsSelect);
}

function funcProcessGetProductsSelect(result, respobj){
    if( result === 0 ) return;
    console.log(respobj)

    let tb_id = "tb_products_select";
    clearTableAll(tb_id);
    
    let tableRef       = document.getElementById(tb_id);
    let row_head       = tableRef.insertRow(0);
    row_head.innerHTML = `<tr class="tr"><td></td><td></td><td></td><td></td><td class="td td_buttons-control"><button class="button__control button__control_add-prod-select" value="${uinCatc}"><img class="button__control__img" src="assets/images/plus.svg" alt=""></button></td></tr>`;

    let button_control_add_prod_tree = document.querySelector(".button__control_add-prod-select");
    button_control_add_prod_tree.addEventListener("click", () => {
        funcProcessInfoProductsModalAdd();
    })

    for (let key in respobj.answ){
        let set    = respobj.answ[key];
        let name  = set.name;
        let fship = set.fship;
        let fset  = set.fset;
        let del   = set.del;
        let uin   = set.uin;
        addProductsSelect(name, fship, fset, del, uin, tb_id);
    }

    let button_control_select_product = document.querySelectorAll(".button__control_select-product");
    button_control_select_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            result = confirm("Подтверждаете выбор изделия?");
            if(result === true){
                modal_select_prod.style.display = "none";

                let button = document.getElementById(localStorage.getItem("button_select_product_id"));
                button.value     = elem.value;
                button.name      = elem.name;
                button.innerText = elem.name;
            }
            localStorage.removeItem("button_select_product_id");
        })
    })
}

function addProductsSelect(name, fship, fset, del, uin, tb_id){
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellSelect = newRow.insertCell(0); cellSelect.classList = "td";
    let cellFship  = newRow.insertCell(1); cellFship.classList  = "td";
    let cellType   = newRow.insertCell(2); cellType.classList  = "td";
    let cellName   = newRow.insertCell(3); cellName.classList   = "td";
    let cellBtn    = newRow.insertCell(4); cellBtn.classList    = "td";

    del != 0 ?
        cellSelect.innerHTML = `<button class="button__control" disabled><img class="button__control__img" src="assets/images/plus.svg" alt=""></button>` :
        cellSelect.innerHTML = `<button class="button__control button__control_select-product" value="${uin}" name="${name}"><img class="button__control__img" src="assets/images/plus.svg" alt=""></button>`;

    fship === 1 ? cellFship.innerHTML = `<input class="checkbox" type="checkbox" id="chb_fship_select_${uin}" disabled checked><label for="chb_fship_select_${uin}"></label>` : 
                    cellFship.innerHTML = `<input class="checkbox" type="checkbox" id="chb_fship_select_${uin}" disabled><label for="chb_fship_select_${uin}"></label>`;
    cellType.innerHTML = fset === 1 ? "Комлект" : "Изделие";
    cellName.innerHTML = `${name}`;
    cellName.id = `select_product_name_${uin}`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel${bx_color}" disabled><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}