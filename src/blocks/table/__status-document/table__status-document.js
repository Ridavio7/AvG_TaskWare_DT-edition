import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave} from '../../../js/common/common.js';

export const funcGetStatusDoc = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"statusdoc", "count":"100"};
    funcCommand(body, funcProcessGetStatusDoc);
}

const funcProcessGetStatusDoc = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Статус док:", respobj);
    
    let tb_id = "tb_statuses_statusdoc";
    clearTable(tb_id);

    let statusdoc_list = respobj.answ;
    localStorage.setItem("statusdoc_list", JSON.stringify(statusdoc_list));

    for (let key in respobj.answ){
        let set = respobj.answ[key];
        let name = set.name;
        let del = set.del;
        let uin = set.uin;
        addStatusDocRow(name, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-statusdoc");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"statusdoc", "uin":`${elem.value}`};
    
            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-statusdoc");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"statusdoc", "name":"", "uin":`${elem.value}`};

            let target_table = tb_statuses_statusdoc;
            body.name = findForUpdateInput(`statusdoc_name_${elem.value}`, target_table);

            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetStatusDoc()}, 100);
        })
    })
}

const addStatusDocRow = (name, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);

    let cellName = newRow.insertCell(0); cellName.classList = "td td__text_align_center";
    let cellBtn  = newRow.insertCell(1); cellBtn.classList  = "td";

    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="statusdoc_name_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-statusdoc" value="${uin}" disabled><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel button__control_mdel-statusdoc${bx_color}" value="${uin}" disabled><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add = document.querySelector(".button__control_add-statuses-statusdoc");
button_control_add.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"statusdoc", "name":""};
    
    let name_value = document.getElementById("input_add_statusdoc_name").value

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;

        document.getElementById("input_add_statusdoc_name").value = "";

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetStatusDoc()}, 100);
    }
})

listenSortSelect("sort_statuses_statusdoc", "tb_statuses_statusdoc", "statusdoc", funcProcessGetStatusDoc);