import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, highlightButtonSave, makeSelect, removeOptionsSetValue, addToDropdown, findForUpdateSelect, responseProcessor} from '../../../js/common/common.js';
import {customSortSelect} from '../../select/select.js';

export const funcGetPlan = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"planpp", "count":"1000", "sort":"date"};
    funcCommand(body, funcProcessGetPlan);
}

const funcProcessGetPlan = (result, respobj) => {
    console.log("План:", respobj);

    let tb_id = "tb_plan";
    clearTable(tb_id);

    let select_products = document.getElementById("select_add_plan_product");
    removeOptionsSetValue("select_add_plan_product", "Выберите изделие");
    addToDropdown(select_products, "products_list");

    let plan_list = respobj.answ;
    localStorage.setItem("plan_list", JSON.stringify(plan_list));
    for (let key in respobj.answ){
        let obj      = respobj.answ[key];
        let uinprod  = obj.uinproduct;
        let nameprod = obj.name;
        let count    = obj.count;
        let date     = obj.date;
        let prim     = obj.prim;
        let del      = obj.del;
        let uin      = obj.uin;
        addPlanRow(uinprod, nameprod, count, date, prim, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-plan");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"planpp", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-plan");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"planpp", "uinproduct":"", "count":"", "date":"", "prim":"", "uin":`${elem.value}`};

            let target_table = tb_plan;

            body.uinproduct = findForUpdateSelect(target_table, "plan_product_select_", elem.value);
            body.count      = findForUpdateInput(`plan_count_${elem.value}`, target_table);
            body.date       = findForUpdateInput(`plan_date_${elem.value}`, target_table);
            body.prim       = findForUpdateInput(`plan_prim_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetPlan()}, 100);
        })
    })
}

const addPlanRow = (uinprod, nameprod, count, date, prim, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellProd  = newRow.insertCell(0); cellProd.classList  = "td";
    let cellCount = newRow.insertCell(1); cellCount.classList = "td td__text_align_center";
    let cellDate  = newRow.insertCell(2); cellDate.classList  = "td td__text_align_center";
    let cellPrim  = newRow.insertCell(3); cellPrim.classList  = "td td__text_align_center";
    let cellBtn   = newRow.insertCell(4); cellBtn.classList   = "td";

    makeSelect("plan_product_select_", uin, nameprod, uinprod, "products_list", "select", cellProd);
    cellCount.innerHTML = `<input class="input__type-text" type="text" value="${count}" name="plan_count_${uin}">`
    cellDate.innerHTML  = `<div class="input__type-date_wrapper"><input class="input__type-text input__type-date" type="date" value="${date}" name="plan_date_${uin}"><label for="" class="input__type-date_icon"><img src="assets/images/calendar.svg" alt=""></label></div>`
    cellPrim.innerHTML  = `<input class="input__type-text" type="text" value="${prim}" name="plan_prim_${uin}">`

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-plan" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="" title="Обновить"></button><button class="button__control button__control_mdel button__control_mdel-plan${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

let button_control_add_product = document.querySelector(".button__control_add-plan");
button_control_add_product.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"planpp", "uinproduct":"", "count":"", "date":"", "prim":""};

    let prod_value  = document.getElementById("select_add_plan_product").value;
    let count_value = document.getElementById("input_add_plan_count").value;
    let date_value  = document.getElementById("input_add_plan_date").value;
    let prim_value  = document.getElementById("input_add_plan_prim").value;

    if(prod_value === "" || count_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.uinproduct = prod_value;
        body.count      = count_value;
        body.date       = date_value;
        body.prim       = prim_value;
        
        removeOptionsSetValue("select_add_plan_product", "-- Выберите изделие --");
        document.getElementById("input_add_plan_count").value = "";
        document.getElementById("input_add_plan_date").value  = "";
        document.getElementById("input_add_plan_prim").value  = "";

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetPlan()}, 100);
    }
})

customSortSelect("sort_plan");
const dropdown = document.getElementById("sort_plan");
const options  = dropdown.querySelectorAll('li');
options.forEach(option => {
    option.addEventListener('click', () => {
        switch (option.getAttribute('data-value')){
            case '1':
                let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"planpp", "count":"5000", "asort":"name"};
                funcCommand(body1, funcProcessGetPlan);
            break;
            case '2':
                let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"planpp", "count":"5000", "sort":"name"};
                funcCommand(body2, funcProcessGetPlan);
            break;
            case '3':
                let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"planpp", "count":"5000", "asort":"date"};
                funcCommand(body3, funcProcessGetPlan);
            break;
            case '4':
                let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"planpp", "count":"5000", "sort":"date"};
                funcCommand(body4, funcProcessGetPlan);
            break;
        }
    })
})