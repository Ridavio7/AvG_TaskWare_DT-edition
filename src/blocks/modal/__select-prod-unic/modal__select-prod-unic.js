import {funcCommand, clearTableAll, responseProcessor} from '../../../js/common/common.js.js';
import {dragElement, resizeModalWindow} from '../modal.js';
import {TreeBuilder} from '../../_tree/tree.js';

let modal_select_prod = document.getElementById("modal_select_products_unic");
let span_select_prod  = document.getElementById("close_products_select_unic");
let modal_resize      = document.getElementById("modal_select_products_unic_resize");

let uinCatc = null;

span_select_prod.onclick = () => {
    modal_select_prod.style.display = "none";
}

span_select_prod.ontouchend = (e) => {
    e.preventDefault();
    modal_select_prod.style.display = "none";
}

dragElement(modal_select_prod);
resizeModalWindow(modal_resize, "whModalSelectProdUnic");

/* настройка размера окна */
const funcGetResize = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whModalSelectProdUnic"};
    funcCommand(body, funcProcessGetResize)
}

const funcProcessGetResize = (result, respobj) => {
    modal_resize.style.width  = `${respobj.answ.val[0]}px`;
    modal_resize.style.height = `${respobj.answ.val[1]}px`;
}

export const funcGetProductsTreeSelectUnic = () => {
    funcGetResize();
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catP", "count":"1000"};
    funcCommand(body, funcProcessGetProductsTreeSelectUnic);
}

function funcProcessGetProductsTreeSelectUnic(result, respobj){
    const tree = new TreeBuilder('modal_select_products_tree_unic', 'dirP', 'catP', funcGetProductsTreeSelectUnic, funcGetDirP, '', '');
    tree.build(respobj.answ);
}

export const funcGetDirP = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view","obj":"dirP", "uin":`${uin}`, "count":"5000"};
    funcCommand(body, funcProcessGetProductsSelectUnic);
}

function funcProcessGetProductsSelectUnic(result, respobj){
    console.log(respobj)

    let tb_id = "tb_products_select_unic";
    clearTableAll(tb_id);

    for (let key in respobj.answ){
        let set    = respobj.answ[key];
        let name  = set.name;
        let fship = set.fship;
        let fset  = set.fset;
        let del   = set.del;
        let uin   = set.uin;
        addProductsSelect(name, fship, fset, del, uin, tb_id);
    }

    let button_control_select_product = document.querySelectorAll(".button__control_select-product-unic");
    button_control_select_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            result = confirm("Подтверждаете выбор изделия?");
            if(result === true){
                modal_select_prod.style.display = "none";

                let button = document.getElementById(localStorage.getItem("button_select_product_unic_id"));
                button.value     = elem.value;
                button.name      = elem.name;
                button.innerText = elem.name;
            }
            localStorage.removeItem("button_select_product_unic_id");
        })
    })
}

function addProductsSelect(name, fship, fset, del, uin, tb_id){
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellSelect = newRow.insertCell(0); cellSelect.classList = "td";
    let cellFship  = newRow.insertCell(1); cellFship.classList  = "td";
    let cellType   = newRow.insertCell(2); cellType.classList   = "td";
    let cellName   = newRow.insertCell(3); cellName.classList   = "td";
    let cellBtn    = newRow.insertCell(4); cellBtn.classList    = "td";

    del != 0 ?
        cellSelect.innerHTML = `<button class="button__control" disabled><img class="button__control__img" src="assets/images/plus.svg" alt="" title="Создать"></button>` :
        cellSelect.innerHTML = `<button class="button__control button__control_select-product-unic" value="${uin}" name="${name}"><img class="button__control__img" src="assets/images/plus.svg" alt="" title="Создать"></button>`;

    fship === 1 ? cellFship.innerHTML = `<input class="checkbox" type="checkbox" id="chb_fship_select_unic_${uin}" disabled checked><label for="chb_fship_select_unic_${uin}"></label>` : 
                    cellFship.innerHTML = `<input class="checkbox" type="checkbox" id="chb_fship_select_unic_${uin}" disabled><label for="chb_fship_select_unic_${uin}"></label>`;
    cellType.innerHTML = fset === 1 ? "Комлект" : "Изделие";
    cellName.innerHTML = `${name}`;
    cellName.id = `select_product_name_${uin}`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel${bx_color}" disabled><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}