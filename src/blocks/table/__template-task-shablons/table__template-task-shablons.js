import {funcCommand, funcProcessOnlyInfo, clearTable, listenSortSelect, responseProcessor} from '../../../js/common/common.js';
import {TreeTaskBuilder} from '../../_tree/treeTask.js';
import {funcGetShablonsSteps} from '../../modal/__info-shablons/modal__info-shablons.js';
import {funcInfoShablonsTransferOpenModal} from '../../modal/__transfer-shablons/modal__transfer-shablons.js';
import {funcGetTasksSteps} from '../../modal/__info-task/modal__info-task.js';

export const funcGetShablons = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shablons", "count":"100", "sort":"name"};
    funcCommand(body, funcProcessGetShablons);
}

const funcProcessGetShablons = (result, respobj) => {
    //responseProcessor(result, respobj.succ);
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

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-shablons");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"shablons", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(() => {funcGetTasksSteps(elem.value)}, 100);
        })
    })

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
        })
    })

    /* запуск шаблона */
    let button_control_rel = document.querySelectorAll(".button__control_modal-shablons-release");
    button_control_rel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let result = confirm(`Запустить шаблон задачи "${elem.name}"?`);
            if(result === true){
                let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"starttask", "obj":"tasks", "uinShablon":`${elem.value}`};
                funcCommand(body, funcProcessOnlyInfo);
                setTimeout(() => {funcGetTasksSteps(0)}, 200);
            }
        })
    })
}

const addShablonsRow = (name, uin, del, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName = newRow.insertCell(0); cellName.classList = "td";
    let cellBtn  = newRow.insertCell(1); cellBtn.classList  = "td td__text_align_center";

    cellName.innerHTML = `<button class="button__control button__control_action button__control_modal-shablons-catSh" value="${uin}">${name}</button>`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_modal-shablons-release" value="${uin}" name="${name}">Запуск</button><button class="button__control button__control_mdel button__control_mdel-shablons${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
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
