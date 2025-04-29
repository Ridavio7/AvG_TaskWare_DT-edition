import {funcCommand, funcProcessOnlyInfo} from '../../../js/common/common.js';
import {funcGetProductsTree, funcGetProducts} from '../../table/__storage-main/table__storage-main.js';
import {dragElement} from '../modal.js';
import {TreeBuilder} from '../../_tree/tree.js';

let modal_transfer       = document.getElementById("modal_transfer_product");
let span_transfer        = document.getElementById("close_product_transfer");
let name_transfer        = document.getElementById("product_transfer_name");
let button_transfer_comp = document.getElementById("product_transfer_comp");
let button_transfer_dirP = document.getElementById("product_transfer_catp");

let uinCatp  = null;
let uinItem  = null;
let nameItem = null;

span_transfer.onclick = function(){
    modal_transfer.style.display = "none";
}

dragElement(modal_transfer);

export const funcInfoProductsTransferOpenModal = (uin, name) => {
    modal_transfer.style.display = "block";

    name_transfer.value = name;
    uinItem = uin;
    nameItem = name;
    button_transfer_dirP.style.display = "none";
    button_transfer_comp.style.display = "flex";

    let body  =  {"user":"demo", "meth":"view", "obj":"catP", "count":"100"};
    funcCommand(body, funcProcessGetProductsTree);
}

const funcProcessGetProductsTree = (result, respobj) => {
    if( result === 0 ) return;

    const tree = new TreeBuilder('modal_transfer_product_tree', 'dirP', 'catP', funcGetProductsTree, funcGetProducts, funcInfocatPTransferOpenModal, ["openall"]);
    tree.build(respobj.answ);

    document.getElementById('modal_transfer_product_tree').onclick = () => {
        let node = tree.get();
        uinCatp = node.getAttribute('data-id');
    }
}

button_transfer_comp.onclick = () => {
    let body  =  {"user":"demo", "meth":"update", "obj":"products", "name":`${nameItem}`, "uin":`${uinItem}`, "uincat":`${uinCatp}`};

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){
        funcGetProductsTree();
    }, 100);

    modal_transfer.style.display = "none";
}

export const funcInfocatPTransferOpenModal = (uin, name) => {
    modal_transfer.style.display = "block";

    name_transfer.value = name;
    uinItem = uin;
    nameItem = name;
    button_transfer_dirP.style.display = "flex";
    button_transfer_comp.style.display = "none";

    let body  =  {"user":"demo", "meth":"view", "obj":"catP", "count":"100"};
    funcCommand(body, funcProcessGetProductsTree);
}

button_transfer_dirP.onclick = () => {
    let body  =  {"user":"demo", "meth":"update", "obj":"dirP", "name":`${nameItem}`, "uin":`${uinItem}`, "uinparent":`${uinCatp}`};

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){
        funcGetProductsTree();
    }, 100);

    modal_transfer.style.display = "none";
}