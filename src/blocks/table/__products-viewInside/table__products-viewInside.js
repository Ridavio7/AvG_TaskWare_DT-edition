import {funcCommand, clearTable, funcProcessOnlyInfo, highlightButtonSave, findForUpdateInput, responseProcessor, funcProcessOnlyConsole} from '../../../js/common/common.js';
import {funcGetProductsTreeSelect} from '../../modal/__select-prod/modal__select-prod.js';
import {funcGetComponentsTreeSelect} from '../../modal/__select-comp/modal__select-comp.js';
import {funcFoundOneComponent} from '../__comp-found/table__comp-found.js';

let button__control_add_prod = document.getElementById('button__control_info_product_add_prod');
let button__control_add_comp = document.getElementById('button__control_info_product_add_comp');

let uinMainProd = null;
let uinMainSet  = null;
let fsetMain    = null;

export const funcGetProductViewInside = (uin, fset) => {
    let obj = fset == 0 ? "formula_products" : "formula_sets";
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"viewInside", "obj":`${obj}`};
    if(fset == 0){body.uinproduct = `${uin}`} else {body.uinset = `${uin}`}
    funcCommand(body, funcProcessGetProductViewInside);
}

const funcProcessGetProductViewInside = (result, respobj) => {
    console.log("viewInside:", respobj);

    uinMainProd = respobj.uinprod;
    uinMainSet  = respobj.uinset;
    fsetMain    = respobj.fset;
    let fset    = respobj.fset;

    let tb_id_prod = 'tb_info_product_prod';
    clearTable(tb_id_prod)

    for (let key in respobj.insP){
        let obj    = respobj.insP[key];
        let namepr = obj.namepr;
        let uinpr  = obj.uinpr;
        let count  = obj.count;
        let uin    = obj.uin;
        let del    = obj.del;
        addProducts(namepr, uinpr, count, fset, uin, del, tb_id_prod);
    }

    /* функция удаления */
    let button_control_mdel_product = document.querySelectorAll(".button__control_mdel_formula-product-innprod");
    button_control_mdel_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let obj   = elem.name == 0 ? "formula_products" : "formula_sets";
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":`${obj}`, "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })
    
    /* функция обновления */
    let button_control_update_product = document.querySelectorAll(".button__control_update_formula-product-innprod");
    button_control_update_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let uin  = elem.name == 0 ? uinMainProd : uinMainSet;
            let body;
            if(elem.name == 0){
                body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"formula_products", "uinproduct":`${uinMainProd}`, "innprod":"", "count":"", "uin":`${elem.value}`};
                body.innprod    = document.getElementById(`formula_product_select_innprod_${elem.value}`).value;
            } else {
                body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"formula_sets", "uinset":`${uinMainSet}`, "uinproduct":"", "count":"", "uin":`${elem.value}`};
                body.uinproduct = document.getElementById(`formula_product_select_innprod_${elem.value}`).value;
            }
            body.count      = findForUpdateInput(`formula_product_innprod_count_${elem.value}`, tb_info_product_prod);
            
            console.log(body)
            funcCommand(body, funcProcessOnlyConsole);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetProductViewInside(uin, elem.name)}, 100);
        })
    })

    /* выбор изделия */
    let button_select_innprod = document.querySelectorAll(".button__select_product_innprod");
    button_select_innprod.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcGetProductsTreeSelect();
            /*setTimeout(() => {
                funcFoundOneComponent(elem.name)
            }, 300)*/
            localStorage.setItem("button_select_product_id", elem.id);
            modal_select_products.style.display = "block";
        })
    })

//////////////////////////////////////////////////////////////////////////////

    let tb_id_comp = 'tb_info_product_comp';
    clearTable(tb_id_comp)
    for (let key in respobj.insC){
        let obj       = respobj.insC[key];
        let nameType  = obj.typename;
        let uinType   = obj.type;
        let countType = obj.typecount;
        let typeArr   = obj.typearr;
        addComponentsType(nameType, uinType, countType, typeArr, fset, tb_id_comp);
    }

    /* функция удаления */
    let button_control_mdel_comp = document.querySelectorAll(".button__control_mdel_formula-product-componenet");
    button_control_mdel_comp.forEach((elem) => {
        elem.addEventListener("click", () => {
            let obj   = elem.name == 0 ? "formula_products" : "formula_sets";
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":`${obj}`, "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })
    
    /* функция обновления */
    let button_control_update_comp = document.querySelectorAll(".button__control_update_formula-product-componenet");
    button_control_update_comp.forEach((elem) => {
        elem.addEventListener("click", () => {
            let uin  = elem.name == 0 ? uinMainProd : uinMainSet;
            let body = elem.name == 0 ?
            {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"formula_products", "uinproduct":`${uinMainProd}`, "uincompont":"", "count":"", "uin":`${elem.value}`} :
            {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"formula_sets", "uinset":`${uinMainSet}`, "uincompont":"", "count":"", "uin":`${elem.value}`};
            
            body.uincompont = document.getElementById(`formula_product_select_componenet_${elem.value}`).value;
            body.count = findForUpdateInput(`formula_product_componenet_count_${elem.value}`, tb_info_product_comp);
        
            funcCommand(body, funcProcessOnlyConsole);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetProductViewInside(uin, elem.name)}, 100);
        })
    })

    /* выбор комлпектующего */
    let button_select_component = document.querySelectorAll(".button__select_product_componenet");
    button_select_component.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcGetComponentsTreeSelect();
            setTimeout(() => {
                funcFoundOneComponent(elem.name)
            }, 300)
            localStorage.setItem("button_select_component_id", elem.id);
            modal_select_component.style.display = "block";
        })
    })
}

/* таблица изделия */
const addProducts = (namepr, uinpr, count, fset, uin, del, tb_id_prod) => {
    let tableRef = document.getElementById(tb_id_prod);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellProduct = newRow.insertCell(0); cellProduct.classList = "td";
    let cellCount   = newRow.insertCell(1); cellCount.classList   = "td td__text_align_center";
    let cellBtn     = newRow.insertCell(2); cellBtn.classList     = "td";

    cellProduct.innerHTML = `<button class="button__select button__select_product_innprod" id="formula_product_select_innprod_${uin}" value="${uinpr}" name="${namepr}">${namepr}</button>`;
    cellCount.innerHTML = `<input class="input__type-text input__type-text__small" type="text" value="${count}" name="formula_product_innprod_count_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update_formula-product-innprod" value="${uin}" name="${fset}"><img class="button__control__img" src="assets/images/arrow_3.svg" title="Обновить"></button><button class="button__control button__control_mdel button__control_mdel_formula-product-innprod${bx_color}" value="${uin}" name="${fset}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

/* добавление изделия */
button__control_add_prod.onclick = () => {
    let innprod_value = document.getElementById("button_info_product_add_prod");
    let count_value   = document.getElementById("input_info_product_add_prod");

    let uin  = fsetMain == 0 ? uinMainProd : uinMainSet;
    let body;
    if(fsetMain == 0){
        body = {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"formula_products", "uinproduct":`${uinMainProd}`, "innprod":"", "count":""};
        body.innprod    = innprod_value.value;
    } else {
        body = {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"formula_sets", "uinset":`${uinMainSet}`, "uinproduct":"", "count":"" };
        body.uinproduct = innprod_value.value;
    }

    if(innprod_value.value === "" || count_value.value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.count      = count_value.value;
    
        innprod_value.innerText = "Выберите изделие";
        innprod_value.value     = "";
        count_value.value       = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetProductViewInside(uin, fsetMain)}, 100);
    }
}

/* таблица комлпектующего */
const addComponentsType = (nameType, uinType, countType, typeArr, fset, tb_id_comp) => {
    let tableRef = document.getElementById(tb_id_comp);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr tr_mark";

    let cellType  = newRow.insertCell(0); cellType.classList  = "td"; 
    let cellComp  = newRow.insertCell(1); cellComp.classList  = "td";
    let cellCount = newRow.insertCell(2); cellCount.classList = "td";
    let cellBtn   = newRow.insertCell(3); cellBtn.classList   = "td";

    cellType.innerHTML = nameType === '' ? "Нет" : nameType;

    for (let i in typeArr){
        let obj         = typeArr[i];
        let nameCompont = obj.name;
        let uinCompont  = obj.uincompont;
        let count       = obj.count;
        let uin         = obj.uin;
        let del         = obj.del;
        addComponents(nameCompont, uinCompont, count, fset, uin, del, tb_id_comp);
    }
}

const addComponents = (nameCompont, uinCompont, count, fset, uin, del, tb_id_comp) => {
    let tableRef = document.getElementById(tb_id_comp);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellType  = newRow.insertCell(0); cellType.classList  = "td";
    let cellComp  = newRow.insertCell(1); cellComp.classList  = "td";
    let cellCount = newRow.insertCell(2); cellCount.classList = "td";
    let cellBtn   = newRow.insertCell(3); cellBtn.classList   = "td";

    cellComp.innerHTML = `<button class="button__select button__select_product_componenet" id="formula_product_select_componenet_${uin}" value="${uinCompont}" name="${nameCompont}">${nameCompont}</button>`;
    cellCount.innerHTML = `<input class="input__type-text input__type-text__small" type="text" value="${count}" name="formula_product_componenet_count_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update_formula-product-componenet" value="${uin}" name="${fset}"><img class="button__control__img" src="assets/images/arrow_3.svg" title="Обновить"></button><button class="button__control button__control_mdel button__control_mdel_formula-product-componenet${bx_color}" value="${uin}" name="${fset}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

/* добавление комлпектующего */
button__control_add_comp.onclick = () => {
    let uin  = fsetMain == 0 ? uinMainProd : uinMainSet;
    let body = fsetMain == 0 ? 
    {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"formula_products", "uinproduct":`${uinMainProd}`, "uincompont":"", "count":""} : 
    {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"formula_sets", "uinset":`${uinMainSet}`, "uincompont":"", "count":"" };

    let uincompont_value = document.getElementById("button_info_product_add_comp");
    let count_value      = document.getElementById("input_info_product_add_comp");
    
    if(uincompont_value.value === "" || count_value.value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.uincompont = uincompont_value.value;
        body.count      = count_value.value;
    
        uincompont_value.innerText = "Выберите комплектующее";
        uincompont_value.value     = "";
        count_value.value          = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetProductViewInside(uin, fsetMain)}, 100);
    }
}