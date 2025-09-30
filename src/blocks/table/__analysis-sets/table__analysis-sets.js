import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, findForUpdateSelect, listenCustomSelect, sendFiltAnalisys, clearCustomSelect, sortAnalisys, makeSelect, highlightButtonSave, responseProcessor, listenDate, clearTableAll} from '../../../js/common/common.js';
import {customSelect, customSortSelect} from '../../select/select.js';

export const funcGetShipSets = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shipSets", "count":"500", "filt":"", "asort": "uin", "filt":`${JSON.stringify(filt_analysis_sets)}`};
    funcCommand(body, funcProcessGetShipSets);
}

const funcProcessGetShipSets = (result, respobj) => {
    if(respobj.answ === "" && respobj.succ === 0){alert("Не найдено! Повторите запрос!"); document.getElementById("button_analysis_sets_reset").click()};
    console.log("Анализ комплектов:", respobj);

    let tb_id = "tb_analysis_sets";
    clearTableAll("tb_analysis_sets");

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

    let cellSNset  = newRow.insertCell(0); cellSNset.classList  = "td td__text_align_center";
    let cellNPset  = newRow.insertCell(1); cellNPset.classList  = "td td__text_align_center";
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
    celldate.innerHTML  = `<div class="input__type-date_wrapper"><input class="input__type-text input__type-date" type="date" value="${date}" name="shipsets_date_${uin}"><label for="" class="input__type-date_icon"><img src="assets/images/calendar.svg" alt=""></label></div>`;
    cellprim.innerHTML  = `<input class="input__type-text" type="text" value="${prim}" name="shipsets_prim_${uin}">`;
    cellBtn.innerHTML   = `<button class="button__control button__control_update button__control_update-ananlysis-set" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="" title="Обновить"></button>`;
}

customSelect('analysis_sets_set_customDropdown', JSON.parse(localStorage.getItem("sets_list")), 'комплект');
customSelect('analysis_sets_prod_customDropdown', JSON.parse(localStorage.getItem("products_list")), 'изделие');
customSelect('analysis_sets_contr_customDropdown', JSON.parse(localStorage.getItem("contragents_list")), 'контрагента');
customSelect('analysis_sets_status_customDropdown', JSON.parse(localStorage.getItem("statuses_list")), 'статус');

let filt_analysis_sets = [];
let filt_1 = {fld: "uin", on: "sets", vald: []};
let filt_2 = {fld: "uin", on: "products", vald: []};
let filt_3 = {fld: "uin", on: "contragents", vald: []};
let filt_4 = {fld: "uin", on: "statuses", vald: []};
let filt_5 = {fld: "date", vald: []};
filt_analysis_sets.push(filt_5);

listenCustomSelect("analysis_sets_set_customDropdown", filt_1, [], filt_analysis_sets);
listenCustomSelect("analysis_sets_prod_customDropdown", filt_2, [], filt_analysis_sets);
listenCustomSelect("analysis_sets_contr_customDropdown", filt_3, [], filt_analysis_sets);
listenCustomSelect("analysis_sets_status_customDropdown", filt_4, [], filt_analysis_sets);
listenDate(document.getElementById('filt_analysis_sets_date_first'), document.getElementById('filt_analysis_sets_date_second'), filt_5, [], filt_analysis_sets);

document.getElementById("button_analysis_sets_choose").addEventListener("click", () => {
    sendFiltAnalisys(filt_analysis_sets, 'tb_analysis_sets', 'shipSets', funcProcessGetShipSets);
})

document.getElementById("button_analysis_sets_reset").addEventListener("click", () => {
    filt_analysis_sets.length = 0;
    clearCustomSelect('analysis_sets_set_customDropdown', 'комплект');
    clearCustomSelect('analysis_sets_prod_customDropdown', 'изделие');
    clearCustomSelect('analysis_sets_contr_customDropdown', 'контрагента');
    clearCustomSelect('analysis_sets_status_customDropdown', 'статус');
    document.getElementById('filt_analysis_sets_date_first').value = '';
    document.getElementById('filt_analysis_sets_date_second').value = '';
    funcGetShipSets();
})

customSortSelect("sort_analysis_sets");
sortAnalisys("sort_analysis_sets", filt_analysis_sets, "shipSets", funcProcessGetShipSets);