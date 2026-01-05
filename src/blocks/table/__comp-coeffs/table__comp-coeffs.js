import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave, responseProcessor} from '../../../js/common/common.js.js';
import {customSelect, customSortSelect} from '../../select/select.js';

export const funcGetCoeffs = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"coeffs", "count":"100", "sort":"uin"};
    funcCommand(body, funcProcessGetCoeffs);
}

const funcProcessGetCoeffs = (result, respobj) => {
    console.log("Приставки СИ:", respobj);
    
    let tb_id = "tb_componenets_coeffs";
    clearTable(tb_id);

    let coeffs_list = respobj.answ;
    localStorage.setItem("coeffs_list", JSON.stringify(coeffs_list));
    
    for (let key in respobj.answ){
        let set   = respobj.answ[key];
        let name  = set.name;
        let coeff = set.coeff;
        let smv   = set.smv;
        let help  = set.help;
        let del   = set.del;
        let uin   = set.uin;
        addCoeffsRow(name, coeff, smv, help, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel_Coeffsurement = document.querySelectorAll(".button__control_mdel-coeffs");
    button_control_mdel_Coeffsurement.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"coeffs", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update_Coeffsurement = document.querySelectorAll(".button__control_update-coeffs");
    button_control_update_Coeffsurement.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"coeffs", "uin":`${elem.value}`, "name":"", "help":"", "smv":""};

            let target_table = document.getElementById("tb_componenets_coeffs");
            body.name = findForUpdateInput(`coeff_name_${elem.value}`, target_table);
            body.help = findForUpdateInput(`coeff_help_${elem.value}`, target_table);
            body.smv  = findForUpdateInput(`coeff_smv_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetCoeffs()}, 100);
        })
    })
}

const addCoeffsRow = (name, coeff, smv, help, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName  = newRow.insertCell(0); cellName.classList  = "td td__text_align_center";
    let cellCoeff = newRow.insertCell(1); cellCoeff.classList = "td td__text_align_center";
    let cellSmv   = newRow.insertCell(2); cellSmv.classList   = "td td__text_align_center";
    let cellHelp  = newRow.insertCell(3); cellHelp.classList  = "td td__text_align_center";
    let cellBtn   = newRow.insertCell(4); cellBtn.classList   = "td";

    cellName.innerHTML  = `<input class="input__type-text" type="text" value="${name}" name="coeff_name_${uin}">`;
    cellCoeff.innerHTML = `<input class="input__type-text" type="text" value="${coeff}" name="coeff_coeff_${uin}" disabled>`;
    cellSmv.innerHTML   = `<input class="input__type-text" type="text" value="${smv}" name="coeff_smv_${uin}">`;
    cellHelp.innerHTML  = `<input class="input__type-text" type="text" value="${help}" name="coeff_help_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-coeffs" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="" title="Обновить"></button><button class="button__control button__control_mdel button__control_mdel-coeffs${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

let button_control_add = document.querySelector(".button__control_add-coeffs");
button_control_add.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "obj":"coeffs", "meth":"add", "name":"", "coeff":"", "smv":"", "help":""};

    let name_value  = document.getElementById("input_add_coeffs_name").value
    let coeff_value = document.getElementById("input_add_coeffs_coeff").value
    let smv_value   = document.getElementById("input_add_coeffs_smv").value
    let help_value  = document.getElementById("input_add_coeffs_help").value

    if(name_value === "" || coeff_value === "" || smv_value === "" || help_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name  = name_value;
        body.coeff = coeff_value;
        body.smv   = smv_value;
        body.help  = help_value;
    
        document.getElementById("input_add_coeffs_name").value  = "";
        document.getElementById("input_add_coeffs_coeff").value = "";
        document.getElementById("input_add_coeffs_smv").value   = "";
        document.getElementById("input_add_coeffs_help").value  = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetCoeffs()}, 100);
    }
})

customSortSelect("sort_coeffs");
const dropdown = document.getElementById("sort_coeffs");
const options  = dropdown.querySelectorAll('li');
options.forEach(option => {
    option.addEventListener('click', () => {
        options.forEach(elem => {
            elem.style.color = 'var(--font-color)';
        })
        
        switch (option.getAttribute('data-value')){
            case '1':
                let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"coeffs", "count":"5000", "sort":"name"};
                funcCommand(body1, funcProcessGetCoeffs);
            break;
            case '2':
                let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"coeffs", "count":"5000", "asort":"name"};
                funcCommand(body2, funcProcessGetCoeffs);
            break;
            case '3':
                let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"coeffs", "count":"5000", "sort":"uin"};
                funcCommand(body3, funcProcessGetCoeffs);
            break;
            case '4':
                let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"coeffs", "count":"5000", "asort":"uin"};
                funcCommand(body4, funcProcessGetCoeffs);
            break;
        }

        option.style.color = 'var(--font-color-modal-blue)';
        document.getElementById('modal-overlay').style.display = 'none';
    })
})