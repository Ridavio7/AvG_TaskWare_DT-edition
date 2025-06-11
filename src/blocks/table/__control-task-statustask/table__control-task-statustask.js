import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave, responseProcessor} from '../../../js/common/common.js';

export const funcGetStatustask = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"statustask", "count":"100"};
    funcCommand(body, funcProcessGetStatustask);
}

const funcProcessGetStatustask = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    console.log("Статусы задач:", respobj);

    let tb_id = "tb_statustask";
    clearTable(tb_id);

    let statustask_list = respobj.answ;
    localStorage.setItem("statustask_list", JSON.stringify(statustask_list));
    for (let key in respobj.answ){
        let set = respobj.answ[key];
        let name = set.name;
        let del = set.del;
        let uin = set.uin;
        addStatustaskRow(name, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-statustask");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"statustask", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-statustask");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"statustask", "name":"", "uin":`${elem.value}`};

            let target_table = tb_statustask;
            body.name = findForUpdateInput(`color_name_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetStatustask()}, 100);
        })
    })
}

const addStatustaskRow = (name, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName = newRow.insertCell(0); cellName.classList = "td td__text_align_center";
    let cellBtn = newRow.insertCell(1);  cellBtn.classList  = "td";

    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="color_name_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-statustask" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel button__control_mdel-statustask${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add_product_color = document.querySelector(".button__control_add-color");
button_control_add_product_color.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"statustask", "name":""};

    let name_value = document.getElementById("input_add_statustask").value

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;

        document.getElementById("input_add_statustask").value = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetStatustask()}, 100);
    }
})

listenSortSelect("sort_statustask", "tb_statustask", "statustask", funcProcessGetStatustask);