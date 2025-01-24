import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, findForUpdateSelect, listenFiltSelectAnalisys, sendFiltAnalisys, clearFiltAnalisys, sortAnalisys, clearTableAll, makeSelect, highlightButtonSave} from '../../../js/common/common.js';
import {addToDropdownPsevdo, psevdoSelect} from '../../select/select.js';

let filt_analysis_sets = [];

export const funcGetShipSets = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"shipSets", "count":"500", "filt":"", "asort": "uin"};
    funcCommand(body, funcProcessGetShipSets);
}

const funcProcessGetShipSets = (result, respobj) => {
    if( result === 0 ) return;
    if(respobj.answ === ""){alert("Не найдено! Повторите запрос!"); funcGetShipSets()};
    console.log("Анализ комплектов:", respobj);

    let tb_id = "tb_analysis_sets";

    for (let key in respobj.answ) {
        let val = respobj.answ[key];
        let NPset = val.NPset;
        let SNset = val.SNset;
        let name = val.set;
        let status = val.status.name;
        let uinstatus = val.status.uin;
        let kontr = val.kontr;
        let date = val.date;
        let prim = val.prim;
        let comp = val.comp;
        let uin = val.uin;
        addRowColumsShipSets(NPset, SNset, name, status, uinstatus, kontr, date, prim, comp, uin, tb_id);
    }

    /* функция обновления */
    let button_control_update_ananlysis_set = document.querySelectorAll(".button__control_update-ananlysis-set");
    button_control_update_ananlysis_set.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update", "obj":"shipSets", "uinstatus":"", "date":"", "prim":"", "uin":`${elem.value}`};

            let target_table = tb_analysis_sets;

            body.uinstatus = findForUpdateSelect(target_table, "shipsets_select_", elem.value);
            body.date      = findForUpdateInput(`shipsets_date_${elem.value}`, target_table);
            body.prim      = findForUpdateInput(`shipsets_prim_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetShipSets()}, 100);
        })
    })
}

const addRowColumsShipSets = (NPset, SNset, name, status, uinstatus, kontr, date, prim, comp, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellNPset  = newRow.insertCell(0); cellNPset.classList  = "td";
    let cellSNset  = newRow.insertCell(1); cellSNset.classList  = "td";
    let cellname   = newRow.insertCell(2); cellname.classList   = "td";
    let cellcomp   = newRow.insertCell(3); cellcomp.classList   = "td";
    let cellstatus = newRow.insertCell(4); cellstatus.classList = "td";
    let cellkontr  = newRow.insertCell(5); cellkontr.classList  = "td";
    let celldate   = newRow.insertCell(6); celldate.classList   = "td";
    let cellprim   = newRow.insertCell(7); cellprim.classList   = "td";
    let cellBtn    = newRow.insertCell(8); cellBtn.classList    = "td";

    let prodTable = document.createElement('table');
    prodTable.className = "table table_little-product";
    cellcomp.append(prodTable);

    for(let key in comp){
        let val    = comp[key];
        let prod   = val.prod;
        let SNprod = val.snprod;
        let color  = val.color;
    
        let prodTableRow = prodTable.insertRow(-1);
        let cellSNprod   = prodTableRow.insertCell(0);
        let cellProd     = prodTableRow.insertCell(1);
        let cellColor    = prodTableRow.insertCell(2);
    
        let cellProdText   = document.createTextNode(prod);   cellProd.appendChild(cellProdText);
        let cellSNprodText = document.createTextNode(SNprod); cellSNprod.appendChild(cellSNprodText);
        let cellColorText  = document.createTextNode(color);  cellColor.appendChild(cellColorText);
    }

    makeSelect("shipsets_select_", uin, status, uinstatus, "statuses_list", "select", cellstatus);

    celldate.innerHTML = `<input class="input__type-text" type="date" value="${date}" name="shipsets_date_${uin}">`;
    cellprim.innerHTML = `<input class="input__type-text" type="text" value="${prim}" name="shipsets_prim_${uin}">`;

    let cellNPsettext = document.createTextNode(SNset); cellNPset.appendChild(cellNPsettext);
    let cellSNsettext = document.createTextNode(NPset); cellSNset.appendChild(cellSNsettext);
    let cellnametext = document.createTextNode(name); cellname.appendChild(cellnametext);
    let cellkontrtext = document.createTextNode(kontr); cellkontr.appendChild(cellkontrtext);
    cellBtn.innerHTML = `<button class="button__control button__control_update-ananlysis-set" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button>`;
}

addToDropdownPsevdo("filt_analysis_sets_sets_items", JSON.parse(localStorage.getItem("sets_list")));
psevdoSelect("filt_analysis_sets_sets");

addToDropdownPsevdo("filt_analysis_sets_products_items", JSON.parse(localStorage.getItem("products_list")));
psevdoSelect("filt_analysis_sets_products");

addToDropdownPsevdo("filt_analysis_sets_components_items", JSON.parse(localStorage.getItem("components_list")));
psevdoSelect("filt_analysis_sets_components");

addToDropdownPsevdo("filt_analysis_sets_contragents_items", JSON.parse(localStorage.getItem("contragents_list")));
psevdoSelect("filt_analysis_sets_contragents");

addToDropdownPsevdo("filt_analysis_sets_status_items", JSON.parse(localStorage.getItem("statuses_list")));
psevdoSelect("filt_analysis_sets_status");

let button_analysis_sets_choose = document.getElementById("button_analysis_sets_choose");
button_analysis_sets_choose.addEventListener("click", () => {
    sendFiltAnalisys(filt_analysis_sets, 'tb_analysis_sets', 'shipSets', funcProcessGetShipSets);
});

let button_analysis_sets_reset = document.getElementById("button_analysis_sets_reset");
button_analysis_sets_reset.addEventListener("click", () => {
    clearFiltAnalisys('filt_analysis_sets_sets_items', 'filt_analysis_sets_products_items', 'filt_analysis_sets_components_items', 'filt_analysis_sets_contragents_items',
    'filt_analysis_sets_status_items', "filt_analysis_sets_date_first", "filt_analysis_sets_date_second", 'tb_analysis_sets', filt_analysis_sets, funcGetShipSets())
});

listenFiltSelectAnalisys("filt_analysis_sets_sets_items", "filt_analysis_sets_products_items", 'filt_analysis_sets_components_items', "filt_analysis_sets_contragents_items",
"filt_analysis_sets_status_items", "filt_analysis_sets_date_first", "filt_analysis_sets_date_second", filt_analysis_sets)

sortAnalisys("sort_analysis_sets", "tb_analysis_sets", filt_analysis_sets, "shipSets", funcProcessGetShipSets);