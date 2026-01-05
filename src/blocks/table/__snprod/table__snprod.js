import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, findForUpdateSelect, makeSelect, clearTable, removeOptionsSetValue, sendFilt, listenCustomSelect, clearCustomSelect, addToDropdown, responseProcessor} from '../../../js/common/common.js';
import {customSelect, customSortSelect} from '../../select/select.js';

let sort = document.getElementById('sort_SNProd');
let sort_second = document.getElementById('sort_SNProd_second');

export const funcGetSNProd = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"snprod", "count":"100", "filt":`${JSON.stringify(filt_snprod)}`};
    funcCommand( body, funcProcessGetSNProd );
}

const funcProcessGetSNProd = (result, respobj) => {
    console.log("SNProd:", respobj);
    
    let tb_id = "tb_products_SNProd";
    clearTable(tb_id);

    let select_product = document.getElementById("select_add_SNProd_product");
    addToDropdown(select_product, "products_list");

    let select_status = document.getElementById("select_add_SNProd_status");
    addToDropdown(select_status, "statussn_list");

    for (let key in respobj.answ) {
        let formula = respobj.answ[key];
        let led = formula.led;
        let name = formula.product.name;
        let uinproduct = formula.product.uin;
        let SN = formula.SN;
        let count = formula.count;
        let count_use = formula.count_use;
        let date = formula.date;
        let status = formula.status.name;
        let uinstatus = formula.status.uin;
        let del = formula.del;
        let uin = formula.uin;
        addSNProdRow(led, name, uinproduct, SN, count, count_use, date, status, uinstatus, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel_snprod = document.querySelectorAll(".button__control_mdel-snprod");
    button_control_mdel_snprod.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"snprod", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update_snprod = document.querySelectorAll(".button__control_update-snprod");
    button_control_update_snprod.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"snprod", "uinproduct":"", "SN":"", "count":"", "count_use":"", "date":"", "uinstatus":"",  "uin":`${elem.value}` };

            let target_table = tb_products_SNProd;
        
            body.uinproduct = findForUpdateSelect(target_table, "snprod_product_select_", elem.value);
            body.SN         = findForUpdateInput(`SN_${elem.value}`, target_table);
            body.count      = findForUpdateInput(`count_${elem.value}`, target_table);
            body.count_use  = findForUpdateInput(`count_use_${elem.value}`, target_table);
            body.date       = findForUpdateInput(`date_${elem.value}`, target_table);
            body.uinstatus  = findForUpdateSelect(target_table, "snprod_status_select_", elem.value);
        
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(function(){funcGetSNProd()}, 100);
        })
    })
}

const addSNProdRow = (led, name, uinproduct, SN, count, count_use, date, status, uinstatus, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let ceelLed      = newRow.insertCell(0); ceelLed.classList      = "td td__text_align_center";
    let cellName     = newRow.insertCell(1); cellName.classList     = "td td_no-padding";
    let cellSN       = newRow.insertCell(2); cellSN.classList       = "td td__text_align_center";
    let cellCount    = newRow.insertCell(3); cellCount.classList    = "td td__text_align_center";
    let cellCountUse = newRow.insertCell(4); cellCountUse.classList = "td td__text_align_center";
    let cellDate     = newRow.insertCell(5); cellDate.classList     = "td td__text_align_center";
    let cellStatus   = newRow.insertCell(6); cellStatus.classList   = "td td_no-padding";
    let cellBtn      = newRow.insertCell(7); cellBtn.classList      = "td";

    if(led === 0){
        ceelLed.innerHTML = `<img src="assets/images/ellipse_green.svg" title="Активен - в работе">`;
    } else if(led === 1){
        ceelLed.innerHTML = `<img src="assets/images/ellipse_orange.svg" title="Активен, но близок к концу">`;
    } else if(led === 2){
        ceelLed.innerHTML = `<img src="assets/images/ellipse_white.svg" title="Не начат">`;
    } else if(led === 3){
        ceelLed.innerHTML = `<img src="assets/images/ellipse_red.svg" title="Закончен">`;
    }

    makeSelect("snprod_product_select_", uin, name, uinproduct, "products_list", "select", cellName);

    cellSN.innerHTML       = `<input class="input__type-text" type="text" value="${SN}" name="SN_${uin}">`;
    cellCount.innerHTML    = `<input class="input__type-text" type="text" value="${count}" name="count_${uin}">`;
    cellCountUse.innerHTML = `<input class="input__type-text" type="text" value="${count_use}" name="count_use_${uin}">`;
    cellDate.innerHTML     = `<div class="input__type-date_wrapper"><input class="input__type-text input__type-date" type="date" value="${date}" name="date_${uin}"><label for="" class="input__type-date_icon"><img src="assets/images/calendar.svg" alt=""></label></div>`;

    makeSelect("snprod_status_select_", uin, status, uinstatus, "statussn_list", "select", cellStatus);

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-snprod" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="" title="Обновить"></button><button class="button__control button__control_mdel button__control_mdel-snprod${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

customSelect('SNProd_prod_customDropdown', JSON.parse(localStorage.getItem("products_list")), 'Изделие');
customSelect('SNProd_status_customDropdown', JSON.parse(localStorage.getItem("statussn_list")), 'Статус');

let filt_snprod = [], filt_1 = {fld: "uin", on: "products"}, filt_2 = {fld: "uin", on: "statussn"};

listenCustomSelect("SNProd_prod_customDropdown", filt_1, [], filt_snprod);
listenCustomSelect("SNProd_status_customDropdown", filt_2, [], filt_snprod);

const btn_filter_open = document.querySelector('[data-target="select-sort"]').firstElementChild;

document.getElementById("button_SNprod_choose").addEventListener("click", () => {
    sendFilt(filt_snprod, 'tb_products_SNProd', 'snprod', funcProcessGetSNProd);
    btn_filter_open.classList.add('active');
})

document.getElementById("button_SNprod_reset").addEventListener("click", () => {
    filt_snprod.length = 0;
    clearCustomSelect('SNProd_prod_customDropdown', 'Изделие');
    clearCustomSelect('SNProd_status_customDropdown', 'Статус');
    funcGetSNProd();

    btn_filter_open.classList.remove('active');
})

let button_control_add_snprod = document.querySelector(".button__control_add-snprod");
button_control_add_snprod.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"snprod", "uinproduct":"", "SN":"", "count":"", "count_use":"", "date":"", "uinstatus":"" };

    let uinproduct_value = document.getElementById("select_add_SNProd_product").value
    let SN_value = document.getElementById("input_add_SNProd_SN").value
    let count_value = document.getElementById("input_add_SNProd_count").value
    let count_use_value = document.getElementById("input_add_SNProd_count_use").value
    let date_value = document.getElementById("input_add_SNProd_date").value
    let uinstatus_value = document.getElementById("select_add_SNProd_status").value

    if(uinproduct_value === "" || SN_value === "" || count_value === "" || count_use_value === "" || date_value === "" || uinstatus_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.uinproduct = uinproduct_value;
        body.SN = SN_value;
        body.count = count_value;
        body.count_use = count_use_value;
        body.date = date_value;
        body.uinstatus = uinstatus_value;
    
        removeOptionsSetValue("select_add_SNProd_product", "Изделие");
        document.getElementById("input_add_SNProd_SN").value = "";
        document.getElementById("input_add_SNProd_count").value = "";
        document.getElementById("input_add_SNProd_count_use").value = "";
        document.getElementById("input_add_SNProd_date").value = "";
        removeOptionsSetValue("select_add_SNProd_status", "Статус");
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetSNProd()}, 100);
    }
})

const selectSortEvent = (dropdown) => {
    const options  = dropdown.querySelectorAll('li');
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(elem => {
                elem.style.color = 'var(--font-color)';
            })
            
            switch (option.getAttribute('data-value')){
                case '1':
                    let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"snprod", "count":"5000", "sort":"name", "filt":`${JSON.stringify(filt_snprod)}`};
                    funcCommand(body1, funcProcessGetSNProd);
                break;
                case '2':
                    let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"snprod", "count":"5000", "asort":"name", "filt":`${JSON.stringify(filt_snprod)}`};
                    funcCommand(body2, funcProcessGetSNProd);
                break;
                case '3':
                    let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"snprod", "count":"5000", "sort":"uin", "filt":`${JSON.stringify(filt_snprod)}`};
                    funcCommand(body3, funcProcessGetSNProd);
                break;
                case '4':
                    let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"snprod", "count":"5000", "asort":"uin", "filt":`${JSON.stringify(filt_snprod)}`};
                    funcCommand(body4, funcProcessGetSNProd);
                break;
            }
            
            option.style.color = 'var(--font-color-modal-blue)';
            document.getElementById('modal-overlay').style.display = 'none';
        })
    })
}

if(window.innerWidth <= 1024){
    sort.style.display = "block";
    sort_second.style.display = "none";
    customSortSelect("sort_SNProd");
    selectSortEvent(document.getElementById("sort_SNProd"));
} else {
    sort.style.display = "none";
    sort_second.style.display = "block";
    customSortSelect("sort_SNProd_second");
    selectSortEvent(document.getElementById("sort_SNProd_second"));
}