import {funcCommand, funcProcessOnlyInfo, responseProcessor} from '../../../js/common/common.js';
import {funcGetShablonsTree} from '../../table/__template-task-shablons/table__template-task-shablons.js';
import {funcGetShablonsSteps} from '../__info-shablons/modal__info-shablons.js';
import {dragElement} from '../modal.js';
import {TreeBuilder} from '../../_tree/tree.js';

let modal_transfer  = document.getElementById("modal_transfer_shablons");
let span_transfer   = document.getElementById("close_shablons_transfer");
let name_transfer   = document.getElementById("shablons_transfer_name");
let button_transfer = document.getElementById("shablons_transfer");

let uinCatp  = null;
let uinItem  = null;
let nameItem = null;

span_transfer.onclick = function(){
    modal_transfer.style.display = "none";
}

span_transfer.ontouchend = (e) => {
    e.preventDefault();
    modal_transfer.style.display = "none";
}

dragElement(modal_transfer);

export const funcInfoShablonsTransferOpenModal = (uin, name, uinShablon) => {
    modal_transfer.style.display = "block";

    name_transfer.value = name;
    uinItem = uin;
    nameItem = name;

    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catSh", "count":"100", "uinShablon":`${uinShablon}`};
    funcCommand(body, funcProcessGetShablonsTree);
}

const funcProcessGetShablonsTree = (result, respobj) => {
    //responseProcessor(result, respobj.succ);

    const tree = new TreeBuilder('modal_transfer_shablons_tree', 'dirSh', 'catSh', funcGetShablonsTree, funcGetShablonsSteps, '', []);
    tree.build(respobj.answ);
    document.getElementById("shablons_modal").style.display = "none";

    document.getElementById('modal_transfer_shablons_tree').onclick = () => {
        let node = tree.get();
        uinCatp = node.getAttribute('data-id');
        document.getElementById("shablons_modal").style.display = "none";
    }
}

button_transfer.onclick = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"dirSh", "name":`${nameItem}`, "uin":`${uinItem}`, "uinShablon":`${localStorage.getItem("uinShablon")}`, "uinparent":`${uinCatp}`};

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(() => {funcGetShablonsTree(localStorage.getItem("uinShablon"))}, 100);

    modal_transfer.style.display = "none";
}