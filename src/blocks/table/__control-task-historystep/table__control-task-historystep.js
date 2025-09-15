import {funcCommand, clearTable, formatDate} from '../../../js/common/common.js';

export const funcGetHistorystep = (uin, uinTask) => {
    let body  =  { "user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"historystep", "uinstep":`${uin}`, "uintask":`${uinTask}`, "count":"100", "sort":"datetm"};
    funcCommand(body, funcProcessGetHistorystep);
}

const funcProcessGetHistorystep = (result, respobj) => {
    console.log("История шага:", respobj);

    let tb_id = "tb_task_historystep";
    clearTable(tb_id);

    for (let key in respobj.answ){
        let obj    = respobj.answ[key];
        let name   = obj.name;
        let datetm = obj.datetm;
        let user   = obj.user.name;
        let count  = obj.count;
        let prim   = obj.prim;
        addHistorystepRow(name, datetm, user, count, prim, tb_id);
    }
}

const addHistorystepRow = (name, datetm, user, count, prim, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellUser  = newRow.insertCell(0); cellUser.classList  = "td"; cellUser.innerHTML = user;
    let cellName  = newRow.insertCell(1); cellName.classList  = "td"; cellName.innerHTML = name;
    let cellDate  = newRow.insertCell(2); cellDate.classList  = "td"; cellDate.innerHTML = formatDate(datetm);
    let cellCount = newRow.insertCell(3); cellCount.classList = "td"; cellCount.innerHTML = count;
    let cellPrim  = newRow.insertCell(4); cellPrim.classList  = "td"; cellPrim.innerHTML = prim;
}