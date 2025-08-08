import {funcCommand, funcProcessOnlyInfo, clearTable, formatDate, findForUpdateInput, responseProcessor, funcProcessOnlyConsole} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';

let detailpp_modal = document.getElementById("detailpp_modal");
let detailpp_close = document.getElementById("detailpp_close");

detailpp_close.onclick = () => {
    detailpp_modal.style.display = "none";
}

detailpp_close.ontouchend = (e) => {
    e.preventDefault();
    detailpp_modal.style.display = "none";
}

dragElement(detailpp_modal);

export const funcInfoDetailppOpenModal = (uin) => {
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
    clearTable(tb_id);

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