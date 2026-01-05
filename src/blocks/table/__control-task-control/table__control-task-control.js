import {funcCommand, setStatus, clearCustomSelect, formatDate, listenCustomSelect, funcProcessOnlyInfo, funcProcessOnlyConsole, listenDate} from '../../../js/common/common.js';
import {TreeTaskBuilder} from '../../_tree/treeTask.js';
import {funcGetTasksSteps} from '../../modal/__info-task/modal__info-task.js';
import {resizeModalWindow} from '../../modal/modal.js';
import {DropdownButton} from '../../button/__control/_dropdown/button__control_dropdown.js';
import {customSelect, customSortSelect} from '../../select/select.js';

const container      = document.getElementById('tb_tasks_container');
let tree_task        = document.getElementById("tree_task");
let tabcontent_close = document.querySelector('.button__control_tabcontent-close');
let switch_1         = document.getElementById("switch_tasks_tb__inputs_1");
let switch_2         = document.getElementById("switch_tasks_tb__inputs_2");
let sort             = document.getElementById('sort_task');
let sort_second      = document.getElementById('sort_task_second');

let sort_obj = localStorage.getItem('user_task_sort_obj');
let comp_obj = localStorage.getItem('user_task_comp_obj');

comp_obj === 'reg:shbl' ? switch_1.checked = true : switch_2.checked = true;

resizeModalWindow(tb_tasks, "whTaskTable", "Размеры окна задач таблицы");
resizeModalWindow(tree_task, "whTaskTree", "Размеры окна задач дерева"); 

/* настройка размера окна */
const funcGetResizeTb = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whTaskTable", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResizeTb)
}

const funcProcessGetResizeTb = (result, respobj) => {
    document.getElementById("tb_tasks").style.width  = `${respobj.answ.val[0]}px`;
    document.getElementById("tb_tasks").style.height = `${respobj.answ.val[1]}px`;
    document.getElementById("tb_shablons_resize").style.width  = `${respobj.answ.val[0]}px`;
    document.getElementById("tb_shablons_resize").style.height = `${respobj.answ.val[1]}px`;
}

/* настройка размера окна */
const funcGetResizeTree = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whTaskTree", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResizeTree)
}

const funcProcessGetResizeTree = (result, respobj) => {
    tree_task.style.width  = `${respobj.answ.val[0]}px`;
    tree_task.style.height = `${respobj.answ.val[1]}px`;
}

export const funcGetTasks = () => {
    funcGetResizeTb();
    funcGetResizeTree();

    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"tasks", "count":"1000"};
    if (sort_obj && typeof sort_obj === 'string' && sort_obj.includes(':')) {
        const [key, value] = sort_obj.split(':', 2);
        body[key] = value;
    }
    if (comp_obj && typeof comp_obj === 'string' && comp_obj.includes(':')) {
        const [key, value] = comp_obj.split(':', 2);
        body[key] = value;
    }
    funcCommand(body, funcProcessGetTasks);
}

const funcProcessGetTasks = (result, respobj) => {
    console.log("Задачи:", respobj);

    container.innerHTML = '';
    buildStructure(respobj.answ, container);

    /* открытие дерева */
    let button_modal = document.querySelectorAll(".button__control_modal-tasks-catTask");
    button_modal.forEach((elem) => {
        elem.addEventListener("click", () => {
            let btn = tb_tasks_container.querySelector('.button__control_active');
            if(btn != null){
                btn.classList.remove('button__control_active');
                btn.parentElement.parentElement.classList.remove('tr_mark');
            }
            localStorage.setItem('button-active__tasks-catTask', elem.value);

            funcGetTasksTree(elem.value);
            elem.classList.add('button__control_active');
            elem.parentElement.parentElement.classList.add('tr_mark');

            if(window.innerWidth <= 1025){
                tree_task.style.display = "block";
                tabcontent_close.style.display = "flex";
            }
        })
    })

    function funcDelElem(uin, name) {
        let result = confirm(`Отозвать задачу "${name}"?`);
        if(result){
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"stoptask", "obj":"tasks", "uintask":`${uin}`};
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(function(){ funcGetTasks() }, 100);
            setTimeout(function(){ funcGetTasksTree(`${localStorage.getItem('uinTask')}`) }, 200);
        }
    }
    
    function funcArchiveElem(uin, name) {
        let result = confirm(`Убрать в архив задачу "${name}"?`);
        if(result){
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"archive", "obj":"tasks", "uinTask":`${uin}`};
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(function(){ funcGetTasks() }, 100);
        }
    }

    /* кнопки выпадающие списки */
    document.querySelectorAll(".button__control_modal-dropdown-tasks").forEach((elem) => {
        new DropdownButton(elem, '', [
            { text: 'Отозвать', action: () => funcDelElem(elem.getAttribute("data-value"), elem.getAttribute("data-id")) },
            { text: 'В архив', action: () => funcArchiveElem(elem.getAttribute("data-value"), elem.getAttribute("data-id")) }
        ], 'assets/images/three_dot.svg');
    })
}

const buildStructure = (data, container) => {
    for (const item of data) {
        const title_tb = document.createElement('table');
        title_tb.classList = 'table table_no-border-radius';

        const title_tr = document.createElement('tr');
        title_tr.classList.add('tr');

        const title_td = document.createElement('td');
        title_td.classList = 'td td__text_align_center td_active td_font-color-active';
        title_td.innerHTML = item.nameshablon;

        title_tr.append(title_td);
        title_tb.append(title_tr);

        container.appendChild(title_tb);

        const table = document.createElement('table');
        table.classList = 'table  table_no-border-radius';
        /*const thead = document.createElement('thead');
        thead.classList.add('thead');
        const trHead = document.createElement('tr');
        trHead.classList.add('tr');

        ['', 'Название', 'Начало', ''].forEach(text => {
            const td = document.createElement('td');
            td.className = 'td td_active';
            td.textContent = text;
            trHead.appendChild(td);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);*/

        const tbody = document.createElement('tbody');
        for (const task of item.tasks) {
            const tr = document.createElement('tr');
            tr.classList = 'tr tr_hover-btn';

            if((sort_obj === "sort:prior" || sort_obj === "asort:prior") && comp_obj === "reg:full"){
                tr.draggable = true;
            }
            
            tr.dataset.uin = task.uin;

            const tdPrior = document.createElement('td');
            tdPrior.className = 'td td_tree-status';
            tdPrior.innerHTML = task.prior;

            const tdStatus = document.createElement('td');
            tdStatus.className = 'td td_tree-status';
            tdStatus.innerHTML = `<button class="button__control button__control_action button__control_action_status button__control_modal-tasks-catTask" value="${task.uin}">${setStatus(task.status.uin, task.fpart, 'control-task__img-status')}</button>`

            const tdName = document.createElement('td');
            tdName.classList.add('td');
            tdName.innerHTML = `<button class="button__control button__control_action button__control_action_text button__control_modal-tasks-catTask" value="${task.uin}">${task.name}</button>`;

            const tdCount = document.createElement('td');
            tdCount.classList.add('td');
            tdCount.innerHTML = task.count;

            const tdDateBegin = document.createElement('td');
            tdDateBegin.classList.add('td');
            tdDateBegin.innerHTML = `<button class="button__control button__control_action button__control_action_date button__control_modal-tasks-catTask" value="${task.uin}">${formatDate(task.datebegin)}</button>`;

            const tdDateEnd = document.createElement('td');
            tdDateEnd.classList.add('td');
            tdDateEnd.innerHTML = `<button class="button__control button__control_action button__control_action_date button__control_modal-tasks-catTask" value="${task.uin}">${formatDate(task.dateend)}</button>`;

            const tdBtn = document.createElement('td');
            tdBtn.classList = 'td';
            tdBtn.innerHTML = `<div class="button__control_dropdown-container button__control_modal-dropdown-tasks" data-value="${task.uin}" data-id="${task.name}"></div>`;

            if(task.fproblem != 0){
                tr.classList.add('tr_mark-error');
                tdName.firstChild.style.color = '#ff3131';
                tdDateBegin.firstChild.style.color = '#ff3131';
                tdDateEnd.firstChild.style.color = '#ff3131';
            }

            if(item.nameshablon === "Все типы задач"){ tr.appendChild(tdPrior) }
            tr.appendChild(tdStatus);
            tr.appendChild(tdName);
            tr.appendChild(tdCount);
            tr.appendChild(tdDateBegin);
            tr.appendChild(tdDateEnd);
            tr.appendChild(tdBtn);

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        container.appendChild(table);
    }
}

const attachDragAndDrop = (container) => {
    let draggedRow = null;

    container.addEventListener('dragstart', (e) => {
        if (e.target.matches('.tr[draggable="true"]')) {
            draggedRow = e.target;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }
    });

    container.addEventListener('dragover', (e) => {
        if (!e.target.closest('.tr')) return;
        e.preventDefault(); // разрешить drop
        e.dataTransfer.dropEffect = 'move';
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedRow) return;

        const targetRow = e.target.closest('.tr');
        if (!targetRow || targetRow === draggedRow) return;

        // Определяем, куда вставлять: ПЕРЕД или ПОСЛЕ targetRow
        const rect = targetRow.getBoundingClientRect();
        const dropPosition = e.clientY - rect.top;
        const isAfter = dropPosition > rect.height / 2;

        const tbody = targetRow.closest('tbody');
        if (!tbody) return;

        // Удалим строку из текущего положения
        const parentTbody = draggedRow.closest('tbody');
        if (parentTbody) parentTbody.removeChild(draggedRow);

        // Вставим в новое место
        if (isAfter) {
            targetRow.after(draggedRow);
        } else {
            targetRow.before(draggedRow);
        }

        // Извлекаем uin'ы
        const uin = draggedRow.dataset.uin;
        let uin1 = null;

        // Находим следующую строку ПОСЛЕ перетащенной
        const nextRow = draggedRow.nextElementSibling;
        if (nextRow && nextRow.classList.contains('tr')) {
            uin1 = nextRow.dataset.uin;
        } else {
            // Если нет следующей — это последняя строка в tbody
            // Можно опустить uin1 или отправить null, в зависимости от логики API
            uin1 = null;
        }

        // Отправка запроса
        sendReorderRequest(uin, uin1);

        // Убираем визуальный эффект
        draggedRow.classList.remove('dragging');
        draggedRow = null;
    });

    container.addEventListener('dragend', () => {
        if (draggedRow) {
            draggedRow.classList.remove('dragging');
            draggedRow = null;
        }
    });
}

const sendReorderRequest = (uin, uin1) => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"priorto", "obj":"tasks", "uin":`${uin}`, "uinto":`${uin1}`, "filt":`${JSON.stringify(filt_resp)}`};
    funcCommand(body, funcProcessOnlyConsole);

    setTimeout(function(){ 
        funcGetTasks();
    }, 300);
}

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

if(tabcontent_close != null){
    if(window.innerWidth <= 1024){
        tabcontent_close.style.opacity = "1";
        tabcontent_close.addEventListener('click', () => {
            tree_task.style.display = "none";
        })
    } else {
        tabcontent_close.style.opacity = "0";
    }
}

/* переклуючение */
const radioButtons = document.querySelectorAll(
    'input[name="switch-tasks-tb-inputs"]',
)

radioButtons.forEach(radio => {
    radio.addEventListener('click', () => {
        let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"tasks", "count":"1000", "filt":`${JSON.stringify(filt_resp)}`};
        if (sort_obj && typeof sort_obj === 'string' && sort_obj.includes(':')) {
            const [key, value] = sort_obj.split(':', 2);
            body[key] = value;
        }

        if (switch_1.checked) {
            body["reg"] = "shbl";
            funcCommand(body, funcProcessGetTasks);
            comp_obj = "reg:shbl";
        } else if(switch_2.checked) {
            body["reg"] = "full";
            funcCommand(body, funcProcessGetTasks);
            comp_obj = "reg:full";
        }

        localStorage.setItem('user_task_comp_obj', comp_obj);
        console.log(localStorage.getItem('user_task_comp_obj'));
    })
})

customSelect('tasks_task_customDropdown', JSON.parse(localStorage.getItem("alltasks_active_list")), 'Задача');
customSelect('tasks_prods_customDropdown', JSON.parse(localStorage.getItem("products_list")), 'Изделие');
customSelect('tasks_status_customDropdown', JSON.parse(localStorage.getItem("statustask_list")), 'Статус');

let filt_resp = [];
let filt_1 = {fld:"uin", on:"tasks"};
let filt_2 = {fld:"uinproduct"};
let filt_3 = {fld:"uinstatus"};
let filt_5 = {fld:"datebegin", vald: []};
filt_resp.push(filt_5);

listenCustomSelect("tasks_task_customDropdown", filt_1, [], filt_resp);
listenCustomSelect("tasks_prods_customDropdown", filt_2, [], filt_resp);
listenCustomSelect("tasks_status_customDropdown", filt_3, [], filt_resp); 
listenDate(document.getElementById('filt_tasks_date_first'), document.getElementById('filt_tasks_date_second'), filt_5, [], filt_resp);

const btn_filter_open = document.querySelector('[data-target="select-sort-task"]').firstElementChild;

document.getElementById("button_tasks_choose").addEventListener("click", () => {
    container.innerHTML = '';

    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj": "tasks", "count":"5000", "filt":`${JSON.stringify(filt_resp)}`};
    funcCommand(body, funcProcessGetTasks);

    if(window.innerWidth <= 1024){
        document.querySelectorAll('.button__control_tabcontent-filter-close').forEach(child => {
            const targetId = child.dataset.target;
            const targetBlock = document.getElementById(targetId);
            if (targetBlock) { targetBlock.style.display = 'none' };
        })
    }

    btn_filter_open.classList.add('active');
})

document.getElementById("button_tasks_reset").addEventListener("click", () => {
    filt_resp.length = 0;
    clearCustomSelect('tasks_task_customDropdown', 'Задача');
    clearCustomSelect('tasks_prods_customDropdown', 'Изделие');
    clearCustomSelect('tasks_status_customDropdown', 'Статус');
    document.getElementById('filt_tasks_date_first').value = '';
    document.getElementById('filt_tasks_date_second').value = '';
    funcGetTasks();
    filt_resp.push(filt_5);

    btn_filter_open.classList.remove('active');
})

const selectSortEvent = (dropdown) => {
    const options  = dropdown.querySelectorAll('li');
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(elem => {
                elem.style.color = 'var(--font-color)';
            })

            let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"tasks", "count":"5000", "filt":`${JSON.stringify(filt_resp)}`};

            if (comp_obj && typeof comp_obj === 'string' && comp_obj.includes(':')) {
                const [key, value] = comp_obj.split(':', 2);
                body[key] = value;
            }

            switch (option.getAttribute('data-value')){
                case '1':
                    body["sort"] = "prior";
                    funcCommand(body, funcProcessGetTasks);
                    sort_obj = "sort:prior";
                break;
                case '2':
                    body["asort"] = "prior";
                    funcCommand(body, funcProcessGetTasks);
                    sort_obj = "asort:prior";
                break;
                case '3':
                    body["sort"] = "datebegin";
                    funcCommand(body, funcProcessGetTasks);
                    sort_obj = "sort:datebegin";
                break;
                case '4':
                    body["asort"] = "datebegin";
                    funcCommand(body, funcProcessGetTasks);
                    sort_obj = "asort:datebegin";
                break;
            }

            localStorage.setItem('user_task_sort_obj', sort_obj);

            if(body.sort === 'prior' && body.reg === 'full'){
                attachDragAndDrop(container);
            }

            option.style.color = 'var(--font-color-modal-blue)';
            document.getElementById('modal-overlay').style.display = 'none';
        })
    })
}

const returnSelectSort = (dropdown) => {
    const options  = dropdown.querySelectorAll('li');

    switch (localStorage.getItem('user_task_sort_obj')){
        case 'sort:prior':
            options[1].click();
        break;
        case 'asort:prior':
            options[2].click();
        break;
        case 'sort:datebegin':
            options[3].click();
        break;
        case 'asort:datebegin':
            options[4].click();
        break;
    }
}

if(window.innerWidth <= 1024){
    sort.style.display = "block";
    sort_second.style.display = "none";
    customSortSelect("sort_task");
    selectSortEvent(document.getElementById("sort_task"));
    returnSelectSort(document.getElementById("sort_task"));
} else {
    sort.style.display = "none";
    sort_second.style.display = "block";
    customSortSelect("sort_task_second");
    selectSortEvent(document.getElementById("sort_task_second"));
    returnSelectSort(document.getElementById("sort_task_second"));
}