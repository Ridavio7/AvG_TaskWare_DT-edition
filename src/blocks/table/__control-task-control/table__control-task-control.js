import {funcCommand, setStatus, clearTable, listenSortSelect, responseProcessor, formatDate} from '../../../js/common/common.js';
import {TreeTaskBuilder} from '../../_tree/treeTask.js';
import {funcGetTasksSteps} from '../../modal/__info-task/modal__info-task.js';

export const funcGetTasks = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"tasks", "count":"100", "asort":"datebegin"};
    funcCommand(body, funcProcessGetTasks);
}

const funcProcessGetTasks = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    console.log("Задачи:", respobj);

    let tb_id = "tb_tasks";
    clearTable(tb_id);

    for (let i in respobj.answ){
        let obi = respobj.answ[i];
        let task = obi.tasks;

        for (let j in task){
            let obj    = task[j];
            let name   = obj.name;
            let date   = obj.datebegin;
            let status = obj.status.uin;
            let del    = obj.del;
            let uin    = obj.uin;
            addTasksRow(name, date, status, uin, del, tb_id);
        }
    }

    /* открытие модального окна */
    let button_modal = document.querySelectorAll(".button__control_modal-tasks-catTask");
    button_modal.forEach((elem) => {
        elem.addEventListener("click", () => {
            let btn = tb_tasks.querySelector('.button__control_active');
            if(btn != null) btn.classList.remove('button__control_active')

            funcGetTasksTree(elem.value);
            elem.classList.add('button__control_active');
        })
    })

    let button_control_del = document.querySelectorAll(".button__control_modal-shablons-del");
    button_control_del.forEach((elem) => {
        elem.addEventListener("click", () => {
            let result = confirm(`Отозвать задачу "${elem.name}"?`);
            if(result === true){

            }
        })
    })
}

const addTasksRow = (name, date, status, uin, del, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellInfo   = newRow.insertCell(0); cellInfo.classList   = "td";
    let cellStatus = newRow.insertCell(1); cellStatus.classList = "td td__text_align_center";
    let cellName   = newRow.insertCell(2); cellName.classList   = "td";
    let cellDate   = newRow.insertCell(3); cellDate.classList   = "td";
    let cellDel    = newRow.insertCell(4); cellDel.classList    = "td";

    cellInfo.innerHTML   = `<button class="button__control button__control_modal-tasks-catTask" value="${uin}"><img class="button__control__img" src="assets/images/info.svg" alt=""></button>`;
    cellStatus.innerHTML = setStatus(status);
    cellName.innerHTML   = name;
    cellDate.innerHTML   = formatDate(date);
    cellDel.innerHTML    = `<button class="button__control button__control_modal-shablons-del" value="${uin}" name="${name}">Отозвать</button>`;
}

listenSortSelect("sort_tasks", "tb_tasks", "tasks", funcProcessGetTasks);

export const funcGetTasksTree = (uin) => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catTask", "uinTask":`${uin}`};
    funcCommand(body, funcProcessGetTasksTree);
}

const funcProcessGetTasksTree = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Дерево задачи:", respobj);

    localStorage.setItem("uinTask", respobj.answ.uinTask)

    const tree = new TreeTaskBuilder('tree_tasks', 'dirTask', 'catTask', funcGetTasksTree, funcGetTasksSteps, '', funcGetTasks, []);
    tree.build(respobj.answ);
}
