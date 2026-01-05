import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, highlightButtonSave,responseProcessor} from '../../../js/common/common.js';
import {customSortSelect} from '../../select/select.js';

export const funcGetStatussn = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"statussn", "count":"100"};
    funcCommand(body, funcProcessGetStatussn);
}

const funcProcessGetStatussn = (result, respobj) => {
    console.log("SN статус:", respobj);

    let statussn_list = respobj.answ;
    localStorage.setItem("statussn_list", JSON.stringify(statussn_list));

    let tb_id = "tb_statuses_statussn";
    clearTable(tb_id);

    for (let key in respobj.answ){
        let set = respobj.answ[key];
        let name = set.name;
        let del = set.del;
        let uin = set.uin;
        addStatussnRow(name, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-statussn");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"statussn", "uin":`${elem.value}`};
    
            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-statussn");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"statussn", "name":"", "uin":`${elem.value}`};
    
            let target_table = tb_statuses_statussn;
            body.name = findForUpdateInput(`sn_name_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetStatussn()}, 100);
        })
    })
}

const addStatussnRow = (name, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName = newRow.insertCell(0); cellName.classList = "td td__text_align_center";
    let cellBtn  = newRow.insertCell(1); cellBtn.classList  = "td";

    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="sn_name_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-statussn" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="" title="Обновить"></button><button class="button__control button__control_mdel button__control_mdel-statussn${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

let button_control_add = document.querySelector(".button__control_add-statuses-statussn");
button_control_add.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"statussn", "name":""};
    
    let name_value = document.getElementById("input_add_statussn_name").value

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;

        document.getElementById("input_add_statussn_name").value = "";

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetStatussn()}, 100);
    }
})

customSortSelect("sort_statuses_statussn");
const dropdown = document.getElementById("sort_statuses_statussn");
const options  = dropdown.querySelectorAll('li');
options.forEach(option => {
    option.addEventListener('click', () => {
        options.forEach(elem => {
            elem.style.color = 'var(--font-color)';
        })

        switch (option.getAttribute('data-value')){
            case '1':
                let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"statussn", "count":"5000", "sort":"name"};
                funcCommand(body1, funcProcessGetStatussn);
            break;
            case '2':
                let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"statussn", "count":"5000", "asort":"name"};
                funcCommand(body2, funcProcessGetStatussn);
            break;
            case '3':
                let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"statussn", "count":"5000", "sort":"uin"};
                funcCommand(body3, funcProcessGetStatussn);
            break;
            case '4':
                let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"statussn", "count":"5000", "asort":"uin"};
                funcCommand(body4, funcProcessGetStatussn);
            break;
        }

        option.style.color = 'var(--font-color-modal-blue)';
        document.getElementById('modal-overlay').style.display = 'none';
    })
})