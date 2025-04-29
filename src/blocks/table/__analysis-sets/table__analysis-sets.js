import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, findForUpdateSelect, listenFiltSelectAnalisys, sendFiltAnalisys, clearFiltAnalisys, sortAnalisys, clearTableAll, makeSelect, highlightButtonSave} from '../../../js/common/common.js';
import {addToDropdownPsevdo, psevdoSelect} from '../../select/select.js';

let filt_analysis_sets = [];

export const funcGetShipSets = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shipSets", "count":"500", "filt":"", "asort": "uin", "filt":`${JSON.stringify(filt_analysis_sets)}`};
    funcCommand(body, funcProcessGetShipSets);
}

const funcProcessGetShipSets = (result, respobj) => {
    if( result === 0 ) return;
    if(respobj.answ === "" && respobj.succ === 0){alert("Не найдено! Повторите запрос!"); document.getElementById("button_analysis_sets_reset").click()};
    console.log("Анализ комплектов:", respobj);

    let tb_id = "tb_analysis_sets";

    for (let key in respobj.answ) {
        let val = respobj.answ[key];
        let NPset     = val.NPset;
        let SNset     = val.SNset;
        let name      = val.set;
        let status    = val.status.name;
        let uinstatus = val.status.uin;
        let kontr     = val.kontr;
        let date      = val.date;
        let prim      = val.prim;
        let comp      = val.comp;
        let uin       = val.uin;
        addRowColumsShipSets(NPset, SNset, name, status, uinstatus, kontr, date, prim, comp, uin, tb_id);
    }

    /* функция обновления */
    let button_control_update_ananlysis_set = document.querySelectorAll(".button__control_update-ananlysis-set");
    button_control_update_ananlysis_set.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"shipSets", "uinstatus":"", "date":"", "prim":"", "uin":`${elem.value}`};

            let target_table = tb_analysis_sets;

            body.uinstatus = findForUpdateSelect(target_table, "shipsets_select_", elem.value);
            body.date      = findForUpdateInput(`shipsets_date_${elem.value}`, target_table);
            body.prim      = findForUpdateInput(`shipsets_prim_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            //setTimeout(function(){funcGetShipSets()}, 100);
        })
    })
}

const addRowColumsShipSets = (NPset, SNset, name, status, uinstatus, kontr, date, prim, comp, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellNPset  = newRow.insertCell(0); cellNPset.classList  = "td td__text_align_center";
    let cellSNset  = newRow.insertCell(1); cellSNset.classList  = "td td__text_align_center";
    let cellname   = newRow.insertCell(2); cellname.classList   = "td";
    let cellcomp   = newRow.insertCell(3);
    let cellstatus = newRow.insertCell(4); cellstatus.classList = "td td__text_align_center";
    let cellkontr  = newRow.insertCell(5); cellkontr.classList  = "td";
    let celldate   = newRow.insertCell(6); celldate.classList   = "td td__text_align_center";
    let cellprim   = newRow.insertCell(7); cellprim.classList   = "td td__text_align_center";
    let cellBtn    = newRow.insertCell(8); cellBtn.classList    = "td";

    let prodTable = document.createElement('table');
    prodTable.className = "table table__little-product";
    cellcomp.append(prodTable);

    for(let key in comp){
        let val    = comp[key];
        let prod   = val.prod;
        let SNprod = val.snprod;
        let color  = val.color;
    
        let prodTableRow = prodTable.insertRow(-1);
        let cellSNprod   = prodTableRow.insertCell(0); cellSNprod.classList = "td td__little-product";
        let cellProd     = prodTableRow.insertCell(1); cellProd.classList   = "td td__little-product";
        let cellColor    = prodTableRow.insertCell(2); cellColor.classList  = "td td__little-product";

        cellSNprod.innerHTML = SNprod;
        cellProd.innerHTML   = prod;
        cellColor.innerHTML  = color;
    }

    makeSelect("shipsets_select_", uin, status, uinstatus, "statuses_list", "select", cellstatus);
    cellNPset.innerHTML = NPset;
    cellSNset.innerHTML = SNset;
    cellname.innerHTML  = name;
    cellkontr.innerHTML = kontr;
    celldate.innerHTML  = `<input class="input__type-text" type="date" value="${date}" name="shipsets_date_${uin}">`;
    cellprim.innerHTML  = `<input class="input__type-text" type="text" value="${prim}" name="shipsets_prim_${uin}">`;
    cellBtn.innerHTML   = `<button class="button__control button__control_update button__control_update-ananlysis-set" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button>`;
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
    filt_analysis_sets.length = 0;
    clearFiltAnalisys('filt_analysis_sets_sets_items', 'filt_analysis_sets_products_items', 'filt_analysis_sets_components_items', 'filt_analysis_sets_contragents_items',
    'filt_analysis_sets_status_items', "filt_analysis_sets_date_first", "filt_analysis_sets_date_second", 'tb_analysis_sets', filt_analysis_sets, funcGetShipSets())
});

listenFiltSelectAnalisys("filt_analysis_sets_sets_items", "filt_analysis_sets_products_items", 'filt_analysis_sets_components_items', "filt_analysis_sets_contragents_items",
"filt_analysis_sets_status_items", "filt_analysis_sets_date_first", "filt_analysis_sets_date_second", filt_analysis_sets)

sortAnalisys("sort_analysis_sets", "tb_analysis_sets", filt_analysis_sets, "shipSets", funcProcessGetShipSets);