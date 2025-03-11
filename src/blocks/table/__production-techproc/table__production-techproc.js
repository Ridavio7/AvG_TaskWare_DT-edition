import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave} from '../../../js/common/common.js';

export const funcGetTechproc = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"techproc", "count":"100", "sort":"numb"};
    funcCommand(body, funcProcessGetTechproc);
}

const funcProcessGetTechproc = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Тех.процесс:", respobj);

    let tb_id = "tb_techproc";
    clearTable(tb_id);

    let techproc_list = respobj.answ;
    localStorage.setItem("techproc_list", JSON.stringify(techproc_list));
    for (let key in respobj.answ){
        let obj  = respobj.answ[key];
        let numb = obj.numb;
        let name = obj.name;
        let fix  = obj.fix;
        let del  = obj.del;
        let uin  = obj.uin;
        addTechprocRow(numb, name, fix, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-techproc");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"techproc", "uin":`${elem.value}`};

            if(elem.style.background === "red"){
                elem.style.background = "inherit";
            } else {
                elem.style.background = "red"
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-techproc");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update", "obj":"techproc", "name":"", "fix":"", "uin":`${elem.value}`};

            let target_table = tb_techproc;
            body.name    = findForUpdateInput(`techproc_name_${elem.value}`, target_table);
            let checkbox = document.getElementById(`techproc_fix_${elem.value}`);
            body.fix     = checkbox.checked === true ? "1" : "0";
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetTechproc()}, 100);
        })
    })
}

const addTechprocRow = (numb, name, fix, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellNumb = newRow.insertCell(0); cellNumb.classList = "td";
    let cellName = newRow.insertCell(1); cellName.classList = "td";
    let cellFix  = newRow.insertCell(2); cellFix.classList  = "td";
    let cellBtn  = newRow.insertCell(3); cellBtn.classList  = "td";

    cellNumb.innerHTML = numb;
    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="techproc_name_${uin}">`;
    let fix_checked    = fix === 1 ? 'checked' : '';
    cellFix.innerHTML  = `<input class="checkbox" type="checkbox" id="techproc_fix_${uin}" ${fix_checked}><label for="techproc_fix_${uin}"></label>` 

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update-techproc" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel-techproc" style="background:${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add_product = document.querySelector(".button__control_add-techproc");
button_control_add_product.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"add", "obj":"techproc", "name":"", "numb":"", "fix":""};

    let numb_value = document.getElementById("input_add_techproc_numb").value;
    let name_value = document.getElementById("input_add_techproc_name").value;
    let checkbox   = document.getElementById("input_add_techproc_fix");

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.numb = numb_value;
        body.name = name_value;
        body.fix  = checkbox.checked === true ? "1" : "0";

        document.getElementById("input_add_techproc_numb").value = "";
        document.getElementById("input_add_techproc_name").value = "";
        document.getElementById("input_add_techproc_fix").checked = false;

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetTechproc()}, 100);
    }
})

document.getElementById("sort_techproc").addEventListener('change', function(){
    clearTable("tb_techproc");

    let option = this.selectedIndex;
    switch (option){
        case 0:
        let body0  =  {"user":"demo", "meth":"view", "obj":"techproc", "count":"5000", "sort":"numb"};
        funcCommand(body0, funcProcessGetTechproc);
        break;
        case 1:
        let body1  =  {"user":"demo", "meth":"view", "obj":"techproc", "count":"5000", "asort":"numb"};
        funcCommand(body1, funcProcessGetTechproc);
        break;
        case 2:
        let body2  =  {"user":"demo", "meth":"view", "obj":"techproc", "count":"5000", "sort":"numb"};
        funcCommand(body2, funcProcessGetTechproc);
        break;
    }
});