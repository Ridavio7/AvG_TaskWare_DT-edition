import {funcCommand, clearTableAll, funcProcessOnlyInfo, responseProcessor} from '../../../js/common/common.js';
import {funcInfoProductOpenModal, funcProcessInfoProductsModalAdd} from '../../modal/__info-prod/modal__info-prod.js';
import {funcInfocatPTransferOpenModal, funcInfoProductsTransferOpenModal} from '../../modal/__transfer-prod/modal__transfer-prod.js';
import {TreeBuilder} from '../../_tree/tree.js';
import {customSortSelect} from '../../select/select.js';
import {resizeModalWindow} from '../../modal/modal.js';

resizeModalWindow(wrapper_prod_tree, "whComponentTree", "Размеры окна дерева комплектующих");
resizeModalWindow(wrapper_prod_table, "whComponentTable", "Размеры окна таблицы комплектующих"); 
resizeModalWindow(wrapper_prod_found, "whComponentFound", "Размеры окна поиска комплектующих");

/* настройка размера окна */
const funcGetResizeTree = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whComponentTree", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResizeTree)
}

const funcProcessGetResizeTree = (result, respobj) => {
    document.getElementById("wrapper_prod_tree").style.width  = `${respobj.answ.val[0]}px`;
    document.getElementById("wrapper_prod_tree").style.height = `${respobj.answ.val[1]}px`;
}

/* настройка размера окна */
const funcGetResizeTb = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whComponentTable", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResizeTb)
}

const funcProcessGetResizeTb = (result, respobj) => {
    document.getElementById("wrapper_prod_table").style.width  = `${respobj.answ.val[0]}px`;
    document.getElementById("wrapper_prod_table").style.height = `${respobj.answ.val[1]}px`;
}

/* настройка размера окна */
const funcGetResizeFound = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whComponentFound", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResizeFound)
}

const funcProcessGetResizeFound = (result, respobj) => {
    document.getElementById("wrapper_prod_found").style.width  = `${respobj.answ.val[0]}px`;
    document.getElementById("wrapper_prod_found").style.height = `${respobj.answ.val[1]}px`;
}

let uinCatc = null;

export const funcGetProductsTree = () => {
    funcGetResizeTree();
    funcGetResizeTb();
    funcGetResizeFound();
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catP", "count":"100"};
    funcCommand(body, funcProcessGetProductsTree);
}

const funcProcessGetProductsTree = (result, respobj) => {
    //responseProcessor(result, respobj.succ);
    console.log("Дерево:", respobj);

    const tree = new TreeBuilder('tree_storage_main', 'dirP', 'catP', funcGetProductsTree, funcGetProducts, funcInfocatPTransferOpenModal, ["contextmenu", "openall"]);
    tree.build(respobj.answ);
    let node = tree.get();
    uinCatc = node.getAttribute('data-id');
}

/* каталог изделий */
export const funcGetProducts = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"dirP", "uin":`${uin}`, "count":"5000"};
    funcCommand(body, funcProcessGetProducts);
}

const funcProcessGetProducts = (result, respobj) => {
    //responseProcessor(result, respobj.succ);
    console.log("Директория:", respobj);

    let tb_id = "tb_storage_main_tree"
    clearTableAll(tb_id);

    let table = document.getElementById(tb_id);
    let row_head   = table.insertRow(-1);
    row_head.innerHTML = `<tr class="tr"><td class="td"></td><td class="td"></td><td class="td"></td><td class="td td_buttons-control"><button class="button__control button__control_add-prod-tree" value="${uinCatc}"><img class="button__control__img" src="assets/images/create.svg" title="Создать"></button></td></tr>`;

    document.getElementById("button_info_product_add").value = uinCatc;

    for (let key in respobj.answ){
        let set   = respobj.answ[key];
        let name  = set.name;
        let fship = set.fship;
        let fset  = set.fset;
        let del   = set.del;
        let uin   = set.uin;
        addProducts(name, fship, fset, del, uin, tb_id);
    }

    // функция удаления
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-products");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let type = elem.name == 0 ? "products" : "sets";
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":`${type}`, "uin":`${elem.value}`};

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
            funcInfoProductOpenModal(elem.value, elem.name);
        })
    })

    let button_modal_transfer = document.querySelectorAll(".button__control_transfer-products");
    button_modal_transfer.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoProductsTransferOpenModal(elem.value, elem.name);
        })
    })

    let button_control_add = document.querySelector(".button__control_add-prod-tree");
    button_control_add.addEventListener("click", () => {
        funcProcessInfoProductsModalAdd();
    })
}

const addProducts = (name, fship, fset, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName  = newRow.insertCell(0); cellName.classList  = "td td_nowrap-content";
    let cellType  = newRow.insertCell(1); cellType.classList  = "td";
    let cellFship = newRow.insertCell(2); cellFship.classList = "td";
    let cellBtn   = newRow.insertCell(3); cellBtn.classList   = "td";

    cellName.innerHTML = `<button class="button__control button__control_modal-product" value="${uin}" name="${fset}"><img class="button__control__img" src="assets/images/info.svg" title="Инфо"></button> ${name}`;
    cellName.id = `product_name_${uin}`;
    fship === 1 ? cellFship.innerHTML = `<input class="checkbox" type="checkbox" id="chb_fship_${uin}" disabled checked><label for="chb_fship_${uin}"></label>` : 
                    cellFship.innerHTML = `<input class="checkbox" type="checkbox" id="chb_fship_${uin}" disabled><label for="chb_fship_${uin}"></label>`;
    cellType.innerHTML = fset === 1 ? "Комлект" : "Изделие";

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_mdel button__control_mdel-products${bx_color}" value="${uin}" name="${fset}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button><button class="button__control button__control_transfer-products" value="${uin}" name="${name}"><img class="button__control__img" src="assets/images/moving.svg" title="Переместить"></button>`;
}

customSortSelect("sort_storage_main");
const dropdown = document.getElementById("sort_storage_main");
const options  = dropdown.querySelectorAll('li');
options.forEach(option => {
    option.addEventListener('click', () => {
        switch (option.getAttribute('data-value')){
            case '1':
                let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catP", "count":"1000", "sort":"name"};
                funcCommand(body1, funcProcessGetProductsTree);
            break;
            case '2':
                let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catP", "count":"1000", "asort":"name"};
                funcCommand(body2, funcProcessGetProductsTree);
            break;
        }
    })
})