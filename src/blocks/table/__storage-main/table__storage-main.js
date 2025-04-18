import {funcCommand, clearTableAll, funcProcessOnlyInfo, removeOptionsSetValue, addToDropdown} from '../../../js/common/common.js';
import {funcInfoProductOpenModal, funcProcessInfoProductsModalAdd} from '../../modal/__info-prod/modal__info-prod.js';
import {funcInfoProductsTransferOpenModal} from '../../modal/__transfer-prod/modal__transfer-prod.js';
import {TreeBuilder} from '../../_tree/tree.js';

let uinCatc = null;

export const funcGetProductsTree = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"catP", "count":"100"};
    funcCommand(body, funcProcessGetProductsTree);
}

const funcProcessGetProductsTree = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Дерево:", respobj);

    const tree = new TreeBuilder('tree_storage_main', 'dirP', 'catP', funcGetProductsTree, funcGetProducts, funcInfoProductsTransferOpenModal, ["contextmenu", "openall"]);
    tree.build(respobj.answ);
    let node = tree.get();
    uinCatc = node.getAttribute('data-id');

    document.getElementById('tree_storage_main').addEventListener('click', () => {
        let node = tree.get();
        uinCatc = node.getAttribute('data-id');
        funcGetProducts(uinCatc);
    })
}

/* каталог изделий */
export const funcGetProducts = (uin) => {
    let body  =  {"user":"demo", "meth":"view", "obj":"dirP", "uin":`${uin}`, "count":"5000"};
    funcCommand(body, funcProcessGetProducts);
}

const funcProcessGetProducts = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Директория:", respobj);

    let tb_id = "tb_storage_main_tree"
    clearTableAll(tb_id);

    let table = document.getElementById(tb_id);
    let row_head   = table.insertRow(-1);
    row_head.innerHTML = `<tr><td></td><td></td><td></td><td class="td td_buttons-control"><button class="button__control button__control_add-prod-tree" value="${uinCatc}"><img class="button__control__img" src="assets/images/plus.svg" alt=""></button></td></tr>`;

    for (let key in respobj.answ){
        let set   = respobj.answ[key];
        let name  = set.name;
        let fship = set.fship;
        let del   = set.del;
        let uin   = set.uin;
        addProducts(name, fship, del, uin, tb_id);
    }

    // функция удаления
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-products");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"products", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }

            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    let button_modal = document.querySelectorAll(".button__control_modal-product");
    button_modal.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoProductOpenModal(elem.value);
        })
    })

    let button_modal_transfer = document.querySelectorAll(".button__control_transfer-products");
    button_modal_transfer.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoProductsTransferOpenModal(elem.value, elem.name);
        })
    })

    let button_control_add = document.querySelector(".button__control_add-prod-tree");
    button_control_add.addEventListener("click", (elem) => {
        funcProcessInfoProductsModalAdd(elem.value);
    })
}

const addProducts = (name, fship, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellInfo  = newRow.insertCell(0); cellInfo.classList   = "td";
    let cellFship = newRow.insertCell(1); cellFship.classList  = "td";
    let cellName  = newRow.insertCell(2); cellName.classList   = "td";
    let cellBtn   = newRow.insertCell(3); cellBtn.classList    = "td";

    cellInfo.innerHTML = `<button class="button__control button__control_modal-product" value="${uin}"><img class="button__control__img" src="assets/images/info.svg"></button>`;
    fship === 1 ? cellFship.innerHTML = `<input class="checkbox" type="checkbox" id="chb_fship_${uin}" disabled checked><label for="chb_fship_${uin}"></label>` : 
                    cellFship.innerHTML = `<input class="checkbox" type="checkbox" id="chb_fship_${uin}" disabled><label for="chb_fship_${uin}"></label>`;
    cellName.innerHTML = `${name}`;
    cellName.id = `product_name_${uin}`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel button__control_mdel-products${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button><button class="button__control button__control_transfer-products" value="${uin}" name="${name}"><img class="button__control__img" src="assets/images/moving.svg"></button>`;
}