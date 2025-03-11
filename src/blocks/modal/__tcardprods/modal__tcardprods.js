import {funcCommand, funcProcessOnlyInfo, clearTable, removeOptionsSetValue, addToDropdown, makeSelect, findForUpdateSelect, findForUpdateInput, highlightButtonSave} from '../../../js/common/common.js.js';
import {dragElement} from '../modal.js';

let modal_tcardprods = document.getElementById("modal_tcardprods");
let span_tcardprods  = document.getElementById("close_tcardprods");
let uinProdForAdd;

span_tcardprods.addEventListener("click", () => {
    modal_tcardprods.style.display = "none";
})

dragElement(modal_tcardprods);

export const funcInfoTcardprodsOpenModal = (uin) => {
    modal_tcardprods.style.display = "block";

    funcGetInfoTcardprod(uin);
}

const funcGetInfoTcardprod = (uin) => {
    uinProdForAdd = uin;
    
    let body  =  {"user":"demo", "meth":"view", "obj":"tcardprods", "uinproduct":`${uin}`, "count":"100", "sort":"numb"}
    funcCommand(body, funcProcessGetInfoTcardprod);
}

const funcProcessGetInfoTcardprod = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Тех.карта:", respobj);

    let tb_id = "tb_modal_tcardprods";
    clearTable(tb_id);

    document.getElementById("tcardprods_title").value = "";
    removeOptionsSetValue("tcardprods_add_select_proc", "---");
    addToDropdown(tcardprods_add_select_proc, "techproc_list")

    let prod = respobj.answDop.name;
    if(respobj.answ === ""){
        document.getElementById("tcardprods_title").value = prod;
    } else {
        for (let key in respobj.answ){
            let obj          = respobj.answ[key];
            let numb         = obj.numb;
            let nametechproc = obj.name;
            let uintechproc  = obj.uintechproc;
            let fix          = obj.fix;
            let uin          = obj.uin;
            let del          = obj.del;
            addInfoTcardprod(prod, numb, nametechproc, uintechproc, fix, uin, del, tb_id);
        }
    }

    /* кнопка добавления */
    let button_control_add = document.getElementById('tcardprods_add_button');
    button_control_add.onclick = () => {
        let body  =  {"user":"demo", "meth":"add", "obj":"tcardprods", "uinproduct":`${uinProdForAdd}`, "uintechproc":"", "numb":"", "fix":""};

        let uintechproc_value = document.getElementById("tcardprods_add_select_proc").value;
        let numb_value        = document.getElementById("tcardprods_add_input_num").value;
        let checkbox          = document.getElementById("tcardprods_add_chb_fix");

        if(uintechproc_value === ""){
            alert("Вы не заполнили все поля!");
        } else {
            body.uintechproc = uintechproc_value;
            body.numb        = numb_value;
            body.fix         = checkbox.checked === true ? "1" : "0";

            document.getElementById("tcardprods_add_input_num").value = "";
            document.getElementById("tcardprods_add_chb_fix").checked = false;

            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(function(){funcGetInfoTcardprod(uinProdForAdd)}, 100);
        }
    }

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-tcardprods");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update", "obj":"tcardprods", "uinproduct":"", "uintechproc":"", "numb":"", "fix":"", "uin":`${elem.value}`};

            let target_table = tb_modal_tcardprods;
            body.uinproduct  = uinProdForAdd;
            body.uintechproc = findForUpdateSelect(target_table, "tcardprods_select_", elem.value);
            body.numb        = findForUpdateInput(`tcardprods_numb_${elem.value}`, target_table);
            let checkbox     = document.getElementById(`tcardprods_fix_${elem.value}`);
            body.fix         = checkbox.checked === true ? "1" : "0";
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetInfoTcardprod(uinProdForAdd)}, 100);
        })
    })
}

const addInfoTcardprod = (prod, numb, nametechproc, uintechproc, fix, uin, del, tb_id) => {
    document.getElementById("tcardprods_title").value = prod;

    let tableRef = document.getElementById(tb_id);
    let newRow   = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellNumb = newRow.insertCell(0); cellNumb.classList = "td";
    let cellName = newRow.insertCell(1); cellName.classList = "td";
    let cellFix  = newRow.insertCell(2); cellFix.classList  = "td";
    let cellBtn  = newRow.insertCell(3); cellBtn.classList  = "td";

    cellNumb.innerHTML = `<input class="input__type-text" type="text" value="${numb}" name="tcardprods_numb_${uin}">`;
    makeSelect("tcardprods_select_", uin, nametechproc, uintechproc, "techproc_list", "select", cellName);
    let fix_checked    = fix === 1 ? 'checked' : '';
    cellFix.innerHTML  = `<input class="checkbox" type="checkbox" id="tcardprods_fix_${uin}" ${fix_checked}><label for="tcardprods_fix_${uin}"></label>` 

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update-tcardprods" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button>`;
}