import {funcCommand, setStatus, responseProcessor, formatDate, funcProcessOnlyConsole, funcProcessOnlyInfo} from '../../../js/common/common.js';
import {TreeTaskBuilder} from '../../_tree/treeTask.js';
import {funcGetTasksArchiveSteps} from '../../modal/__info-task/modal__info-task.js';
import {resizeModalWindow} from '../../modal/modal.js';

resizeModalWindow(tb_tasks_archive, "whTaskTable");
resizeModalWindow(wrapper_tree_tasks_archive, "whTaskTree"); 

/* настройка размера окна */
const funcGetResizeTb = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whTaskTable", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResizeTb)
}

const funcProcessGetResizeTb = (result, respobj) => {
    document.getElementById("tb_tasks_archive").style.width  = `${respobj.answ.val[0]}px`;
    document.getElementById("tb_tasks_archive").style.height = `${respobj.answ.val[1]}px`;
}

/* настройка размера окна */
const funcGetResizeTree = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whTaskTree", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResizeTree)
}

const funcProcessGetResizeTree = (result, respobj) => {
    document.getElementById("wrapper_tree_tasks_archive").style.width  = `${respobj.answ.val[0]}px`;
    document.getElementById("wrapper_tree_tasks_archive").style.height = `${respobj.answ.val[1]}px`;
}

export const funcGetTasksArchive = () => {
    funcGetResizeTb();
    funcGetResizeTree();
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"tasksarch", "count":"100", "asort":"datebegin"};
    funcCommand(body, funcProcessGetTasksArchive);
}

const funcProcessGetTasksArchive = (result, respobj) => {
    console.log("Архив:", respobj);

    const container = document.getElementById('tb_tasks_archive');
    container.innerHTML = '';
    buildStructure(respobj.answ, container)

    /* открытие модального окна */
    let button_modal = document.querySelectorAll(".button__control_modal-tasks-archive-catTask");
    button_modal.forEach((elem) => {
        elem.addEventListener("click", () => {
            let btn = tb_tasks_archive.querySelector('.button__control_active');
            if(btn != null){
                btn.classList.remove('button__control_active');
                btn.parentElement.parentElement.classList.remove('tr_mark');
            }

            funcGetTasksArchiveTree(elem.value);
            elem.classList.add('button__control_active');
            elem.parentElement.parentElement.classList.add('tr_mark');
        })
    })
}

function buildStructure(data, container) {
    for (const item of data) {
        const title = document.createElement('h3');
        title.textContent = item.nameshablon;
        title.classList.add('table__title');
        container.appendChild(title);

        const table = document.createElement('table');
        table.classList = 'table table_no-rotation';

        const tbody = document.createElement('tbody');
        for (const task of item.tasks) {
            const tr = document.createElement('tr');
            tr.classList.add('tr');

            const tdStatus = document.createElement('td');
            tdStatus.classList.add('td');
            tdStatus.innerHTML = `<button class="button__control button__control_action button__control_action_status button__control_modal-tasks-archive-catTask" value="${task.uin}">${setStatus(task.status.uin, task.fpart)}</button>`

            const tdName = document.createElement('td');
            tdName.classList.add('td');
            tdName.innerHTML = `<button class="button__control button__control_action button__control_action_text button__control_modal-tasks-archive-catTask" value="${task.uin}">${task.name}</button>`;

            const tdDateBegin = document.createElement('td');
            tdDateBegin.classList.add('td');
            tdDateBegin.innerHTML = `<button class="button__control button__control_action button__control_action_date button__control_modal-tasks-archive-catTask" value="${task.uin}">${formatDate(task.datebegin)}</button>`;

            const tdDateEnd = document.createElement('td');
            tdDateEnd.classList.add('td');
            tdDateEnd.innerHTML = `<button class="button__control button__control_action button__control_action_date button__control_modal-tasks-archive-catTask" value="${task.uin}">${formatDate(task.dateend)}</button>`;

            const tdDateMove = document.createElement('td');
            tdDateMove.classList.add('td');
            tdDateMove.innerHTML = `<button class="button__control button__control_action button__control_action_date button__control_modal-tasks-archive-catTask" value="${task.uin}">${formatDate(task.datemove)}</button>`;

            if(task.fproblem != 0){
                tr.style.backgroundColor = '#ffdbdb';
                tdName.firstChild.style.color = '#ff3131';
                tdDateBegin.firstChild.style.color = '#ff3131';
                tdDateEnd.firstChild.style.color = '#ff3131';
            }

            tr.appendChild(tdStatus);
            tr.appendChild(tdName);
            tr.appendChild(tdDateBegin);
            tr.appendChild(tdDateEnd);
            tr.appendChild(tdDateMove);

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        container.appendChild(table);
    }
}

export const funcGetTasksArchiveTree = (uin) => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catTaskArch", "uinTaskArch":`${uin}`};
    funcCommand(body, funcProcessGetTasksArchiveTree);
}

const funcProcessGetTasksArchiveTree = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Дерево архива:", respobj);

    localStorage.setItem("uinTaskArchive", respobj.answ.uinTask)

    const tree = new TreeTaskBuilder('tree_tasks_archive', 'dirTaskArch', 'catTaskArch', funcGetTasksArchiveTree, funcGetTasksArchiveSteps, '', funcGetTasksArchive, []);
    tree.build(respobj.answ);
}