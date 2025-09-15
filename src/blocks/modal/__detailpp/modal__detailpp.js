import {funcCommand, funcProcessOnlyInfo, clearTable, formatDate, findForUpdateInput, responseProcessor, funcProcessOnlyConsole, clearTableAll} from '../../../js/common/common.js';
import {dragElement, resizeModalWindow} from '../modal.js';

let detailpp_modal = document.getElementById("detailpp_modal");
let detailpp_close = document.getElementById("detailpp_close");
let modal_resize   = document.getElementById("detailpp_modal_resize");

detailpp_close.onclick = () => {
    detailpp_modal.style.display = "none";
}

detailpp_close.ontouchend = (e) => {
    e.preventDefault();
    detailpp_modal.style.display = "none";
}

dragElement(detailpp_modal);
resizeModalWindow(modal_resize, "whModalDetailpp");

/* настройка размера окна */
const funcGetResize = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whModalDetailpp"};
    funcCommand(body, funcProcessGetResize)
}

const funcProcessGetResize = (result, respobj) => {
    modal_resize.style.width  = `${respobj.answ.val[0]}px`;
    modal_resize.style.height = `${respobj.answ.val[1]}px`;
}

export const funcInfoDetailppOpenModal = (uin) => {
    funcGetResize();
    detailpp_modal.style.display = "block";

    funcGetInfoDetailpp(uin);
}

const funcGetInfoDetailpp = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"detailpp", "uinstep":`${uin}`, "count":"100", "sort":"datetm"}
    funcCommand(body, funcProcessGetInfoDetailpp);
}

const funcProcessGetInfoDetailpp = (result, respobj) => {
    console.log("детализация:", respobj);

    let tb_id = "detailpp_tb_modal";
    clearTableAll(tb_id);

    if(respobj.answ === ''){
        clearTable(tb_id);
    } else {
        for (let key in respobj.answ){
            let obj   = respobj.answ[key];
            let user  = obj.user.name;
            let count = obj.count;
            let date  = obj.datetm;
            let uin   = obj.uin;
            let del   = obj.del;
            addInfoDetailpp(user, count, date, uin, del, tb_id);
        }
    }
}

const addInfoDetailpp = (user, count, date, uin, del, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow   = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellUser  = newRow.insertCell(0); cellUser.classList  = "td";
    let cellCount = newRow.insertCell(1); cellCount.classList = "td";
    let cellDate  = newRow.insertCell(2); cellDate.classList  = "td";

    cellUser.innerHTML  = user;
    cellCount.innerHTML = count;
    cellDate.innerHTML  = formatDate(date);
}