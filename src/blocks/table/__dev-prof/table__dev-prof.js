import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave} from '../../../js/common/common.js';

export const funcGetProf = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"prof", "count":"100", "sort":"numb"};
    funcCommand(body, funcProcessGetProf);
}

const funcProcessGetProf = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Участки согл.:", respobj);

    let tb_id = "tb_prof";
    clearTable(tb_id);

    let prof_list = respobj.answ;
    localStorage.setItem("prof_list", JSON.stringify(prof_list));
    for (let key in respobj.answ){
        let obj  = respobj.answ[key];
        let numb = obj.numb;
        let name = obj.name;
        let fc   = obj.fcount;
        let del  = obj.del;
        let uin  = obj.uin;
        addProfRow(numb, name, fc, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-prof");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"prof", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-prof");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"prof", "name":"", "fcount":"", "uin":`${elem.value}`};

            let target_table = tb_prof;
            body.name    = findForUpdateInput(`prof_name_${elem.value}`, target_table);
            let checkbox = document.getElementById(`prof_fc_${elem.value}`);
            body.fcount  = checkbox.checked === true ? "1" : "0";
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetProf()}, 100);
        })
    })
}

const addProfRow = (numb, name, fc, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellNumb = newRow.insertCell(0); cellNumb.classList = "td td__text_align_center";
    let cellName = newRow.insertCell(1); cellName.classList = "td td__text_align_center";
    let cellFc   = newRow.insertCell(2); cellFc.classList   = "td";
    let cellBtn  = newRow.insertCell(3); cellBtn.classList  = "td";

    cellNumb.innerHTML = numb;
    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="prof_name_${uin}">`;
    let fc_checked     = fc === 1 ? 'checked' : '';
    cellFc.innerHTML  = `<input class="checkbox" type="checkbox" id="prof_fc_${uin}" ${fc_checked}><label for="prof_fc_${uin}"></label>` 

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-prof" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel button__control_mdel-prof${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add = document.querySelector(".button__control_add-prof");
button_control_add.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"prof", "name":"", "numb":"", "fcount":""};

    let numb_value = document.getElementById("input_add_prof_numb").value;
    let name_value = document.getElementById("input_add_prof_name").value;
    let checkbox   = document.getElementById("input_add_prof_fc");

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.numb   = numb_value;
        body.name   = name_value;
        body.fcount = checkbox.checked === true ? "1" : "0";

        document.getElementById("input_add_prof_numb").value = "";
        document.getElementById("input_add_prof_name").value = "";
        document.getElementById("input_add_prof_fc").checked = false;

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetProf()}, 100);
    }
})

document.getElementById("sort_prof").addEventListener('change', function(){
    clearTable("tb_prof");

    let option = this.selectedIndex;
    switch (option){
        case 0:
        let body0  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"prof", "count":"5000", "sort":"numb"};
        funcCommand(body0, funcProcessGetProf);
        break;
        case 1:
        let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"prof", "count":"5000", "asort":"numb"};
        funcCommand(body1, funcProcessGetProf);
        break;
        case 2:
        let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"prof", "count":"5000", "sort":"numb"};
        funcCommand(body2, funcProcessGetProf);
        break;
    }
});