import {funcCommand, funcProcessOnlyInfo, clearTable, listenSortSelect, responseProcessor} from '../../../js/common/common.js';
import {TreeTaskBuilder} from '../../_tree/treeTask.js';
import {funcGetShablonsSteps} from '../../modal/__info-shablons/modal__info-shablons.js';
import {funcInfoShablonsTransferOpenModal} from '../../modal/__transfer-shablons/modal__transfer-shablons.js';
import {funcGetTasksSteps} from '../../modal/__info-task/modal__info-task.js';
import {customSortSelect} from '../../select/select.js';
import {DropdownButton} from '../../button/__control/_dropdown/button__control_dropdown.js';
import {resizeModalWindow} from '../../modal/modal.js';

let tree_shablons_resize = document.getElementById("tree_shablons_resize");
let tabcontent_close = document.querySelector('.button__control_tabcontent-close-shablons');

resizeModalWindow(tree_shablons_resize, "whShablonTree", "Размеры окна задач дерева"); 

/* настройка размера окна */
const funcGetResizeTb = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whShablonTree", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResizeTb)
}

const funcProcessGetResizeTb = (result, respobj) => {
    tree_shablons_resize.style.width  = `${respobj.answ.val[0]}px`;
    tree_shablons_resize.style.height = `${respobj.answ.val[1]}px`;
}

export const funcGetShablons = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shablons", "count":"100", "sort":"name"};
    funcCommand(body, funcProcessGetShablons);
    funcGetResizeTb();
}

const funcProcessGetShablons = (result, respobj) => {
    console.log("Шаблоны:", respobj);

    let tb_id = "tb_shablons";
    clearTable(tb_id);

    for (let key in respobj.answ){
        let obj      = respobj.answ[key];
        let name     = obj.name;
        let del      = obj.del;
        let uin      = obj.uin;
        addShablonsRow(name, uin, del, tb_id);
    }

    /* функция пометки на удаление */
    const funcDelElem = (uin) => {
        let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"shablons", "uin":`${uin}`};
        
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(() => {funcGetShablons(); funcGetShablonsTree(uin)}, 100);
    }

    /* функция полного удаления */
    const funcFullDelElem = (uin) => {
        let result = confirm("Вы действительно хотите полностью удалить шаблон?");
        if(result){
            let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"fulldel", "obj":"shablons", "uin":`${uin}`};
            
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(() => {funcGetShablons(); document.getElementById('tree_shablons').innerHTML = ""}, 100);
        }
    }

    /* функция копирования */
    const funcCopyElem = (uin) => {
        let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"copy", "obj":"shablons", "uin":`${uin}`};
        
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(() => {funcGetShablons()}, 100);
    }

    /* открытие модального окна */
    let button_modal = document.querySelectorAll(".button__control_modal-shablons-catSh");
    button_modal.forEach((elem) => {
        elem.addEventListener("click", () => {
            let btn = tb_shablons.querySelector('.button__control_active');
            if(btn != null){
                btn.classList.remove('button__control_active');
                btn.parentElement.parentElement.classList.remove('tr_mark');
            }

            funcGetShablonsTree(elem.value);
            elem.classList.add('button__control_active');
            elem.parentElement.parentElement.classList.add('tr_mark');

            if(window.innerWidth <= 1025){
                tree_shablons_resize.style.display = "block";
                tabcontent_close.style.display = "flex";
            }
        })
    })

    /* запуск шаблона */
    let button_control_rel = document.querySelectorAll(".button__control_modal-shablons-release");
    button_control_rel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let result = confirm(`Запустить шаблон задачи "${elem.name}"?`);
            if(result === true){
                let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"prevtask", "obj":"tasks", "uinShablon":`${elem.value}`};

                funcCommand(body, (result, respobj) => {
                    console.log(respobj);
                    /*if (result === 1 && respobj?.uintask) {
                        localStorage.setItem('uinTask', respobj.uintask);
                        localStorage.setItem('button-active__tasks-catTask', respobj.uintask);
                        funcGetTasksSteps(0);
                    }*/
                })
            }
        })
    })

    /* кнопки выпадающие списки */
    document.querySelectorAll(".button__control_modal-dropdown-shablons").forEach((elem) => {
        let del = elem.getAttribute("data-id") == 1 ? "Снять пометку на удаление" : "Пометить на удаление";
        new DropdownButton(elem, '', [
            { text: 'Копировать', action: () => funcCopyElem(elem.getAttribute("data-value")) },
            { text: del, action: () => funcDelElem(elem.getAttribute("data-value")) },
            { text: 'Удалить', action: () => funcFullDelElem(elem.getAttribute("data-value")) }
        ], 'assets/images/three_dot.svg');
    })
}

const addShablonsRow = (name, uin, del, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);

    let cellName = newRow.insertCell(0); cellName.classList = "td";
    let cellBtn  = newRow.insertCell(1); cellBtn.classList  = "td td_buttons-control td_width-5";

    cellName.innerHTML = `<button class="button__control button__control_action button__control_modal-shablons-catSh" value="${uin}">${name}</button>`;
    cellBtn.innerHTML = `<div class="modal__button-wrapper"><button class="button__control button__control_modal-shablons-release" value="${uin}" name="${name}"><img class="button__control__img" src="assets/images/start.svg" title="Запуск"></button><div class="button__control_dropdown-container button__control_modal-dropdown-shablons" data-value="${uin}" data-id="${del}"></div></div>`;
    if(del === 1){
        newRow.classList = "tr tr_mark-error";
        cellName.firstChild.style.color = '#ff3131';
    } else {
        newRow.classList = "tr tr_hover-btn";
    }
}

let button_control_add = document.querySelector(".button__control_add-shablons");
button_control_add.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"shablons", "name":"", "uinadmin":""};

    let name_value = document.getElementById("input_add_shablons_name").value;

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name     = name_value;

        document.getElementById("input_add_shablons_name").value = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetShablons()}, 100);
    }
})

document.getElementById("sort_shablons").addEventListener('change', function(){
    document.getElementById('tb_shablons').innerHTML = '';

    let option = this.selectedIndex;
    switch (option){
        case 0:
        let body0  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shablons", "count":"5000"};
        funcCommand(body0, funcProcessGetShablons);
        break;
        case 1:
        let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shablons", "count":"5000", "asort":"name"};
        funcCommand(body1, funcProcessGetShablons);
        break;
        case 2:
        let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shablons", "count":"5000", "sort":"name"};
        funcCommand(body2, funcProcessGetShablons);
        break;
        case 3:
        let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shablons", "count":"5000", "asort":"uin"};
        funcCommand(body3, funcProcessGetShablons);
        break;
        case 4:
        let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shablons", "count":"5000", "sort":"uin"};
        funcCommand(body4, funcProcessGetShablons);
        break;
    }
})

customSortSelect("sort_shablons");
const dropdown = document.getElementById("sort_shablons");
const options  = dropdown.querySelectorAll('li');
options.forEach(option => {
    option.addEventListener('click', () => {
        options.forEach(elem => {
            elem.style.color = 'var(--font-color)';
        })
        
        switch (option.getAttribute('data-value')){
            case '1':
                let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shablons", "count":"5000", "sort":"name"};
                funcCommand(body1, funcProcessGetShablons);
            break;
            case '2':
                let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shablons", "count":"5000", "asort":"name"};
                funcCommand(body2, funcProcessGetShablons);
            break;
            case '3':
                let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shablons", "count":"5000", "sort":"uin"};
                funcCommand(body3, funcProcessGetShablons);
            break;
            case '4':
                let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shablons", "count":"5000", "asort":"uin"};
                funcCommand(body4, funcProcessGetShablons);
            break;
        }

        option.style.color = 'var(--font-color-modal-blue)';
        document.getElementById('modal-overlay').style.display = 'none';
    })
})

export const funcGetShablonsTree = (uin) => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catSh", "uinShablon":`${uin}`};
    funcCommand(body, funcProcessGetShablonsTree);
}

const funcProcessGetShablonsTree = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Дерево шаблона:", respobj);

    localStorage.setItem("uinShablon", respobj.answ.uinShablon)

    const tree = new TreeTaskBuilder('tree_shablons', 'dirSh', 'catSh', funcGetShablonsTree, funcGetShablonsSteps, funcInfoShablonsTransferOpenModal, funcGetShablons, ["contextmenu"]);
    tree.build(respobj.answ);
}

if(tabcontent_close != null){
    if(window.innerWidth <= 1024){
        tabcontent_close.style.opacity = "1";
        tabcontent_close.addEventListener('click', () => {
            tree_shablons_resize.style.display = "none";
        })
    } else {
        tabcontent_close.style.opacity = "0";
    }
}