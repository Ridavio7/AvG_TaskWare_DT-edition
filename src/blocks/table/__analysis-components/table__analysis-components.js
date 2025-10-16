import {funcCommand, listenCustomSelect, sendFiltAnalisys, clearCustomSelect, sortAnalisys, makeSelect, responseProcessor, listenDate, clearTableAll} from '../../../js/common/common.js';
import {customSelect, customSortSelect} from '../../select/select.js';

export const funcGetShipComponentsAll = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shipCompontsAll", "count":"500", "filt":"", "asort": "uin", "filt":`${JSON.stringify(filt_analysis_components_all)}`};
    funcCommand(body, funcProcessGetShipComponentsAll);
}

const funcProcessGetShipComponentsAll = (result, respobj) => {
    if(respobj.answ === "" && respobj.succ === 0){alert("Не найдено! Повторите запрос!"); document.getElementById("button_analysis_components_reset").click()};
    console.log("Анализ всех комплектующих:", respobj);

    let tb_id = "tb_analysis_components_all";
    clearTableAll("tb_analysis_components_all");

    for (let key in respobj.answ) {
        let val        = respobj.answ[key];
        let SNset      = val.SNset;
        let NPset      = val.NPset;
        let set        = val.set;
        let product    = val.product;
        let innproduct = val.innprod;
        let count      = val.count;
        let component  = val.compont;
        let status     = val.status.name;
        let uinstatus  = val.status.uin;
        let kontr      = val.kontr;
        let date       = val.date;
        let prim       = val.prim;
        let uin        = val.uin;
        addRowColumsShipComponentsAll(SNset, NPset, set, product, innproduct, count, component, status, uinstatus, kontr, date, prim, uin, tb_id);
    }
}

function addRowColumsShipComponentsAll(SNset, NPset, set, product, innproduct, count, component, status, uinstatus, kontr, date, prim, uin, tb_id){
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellSNset      = newRow.insertCell(0);  cellSNset.classList      = "td td__text_align_center";
    let cellNPset      = newRow.insertCell(1);  cellNPset.classList      = "td td__text_align_center";
    let cellSet        = newRow.insertCell(2);  cellSet.classList        = "td";
    let cellProduct    = newRow.insertCell(3);  cellProduct.classList    = "td";
    let cellInnproduct = newRow.insertCell(4);  cellInnproduct.classList = "td";
    let cellCount      = newRow.insertCell(5);  cellCount.classList      = "td";
    let cellComp       = newRow.insertCell(6);  cellComp.classList       = "td";
    let cellStatus     = newRow.insertCell(7);  cellStatus.classList     = "td td__text_align_center";
    let cellKontr      = newRow.insertCell(8);  cellKontr.classList      = "td";
    let cellDate       = newRow.insertCell(9);  cellDate.classList       = "td td__text_align_center";
    let cellPrim       = newRow.insertCell(10); cellPrim.classList       = "td td__text_align_center";

    makeSelect("shipcomponents_all_select_", uin, status, uinstatus, "statuses_list", "select", cellStatus);

    cellSNset.innerHTML      = SNset;
    cellNPset.innerHTML      = NPset;
    cellSet.innerHTML        = set;
    cellProduct.innerHTML    = product;
    cellCount.innerHTML      = count;
    cellComp.innerHTML       = component;
    cellInnproduct.innerHTML = innproduct;
    cellKontr.innerHTML      = kontr
    cellDate.innerHTML       = `<div class="input__type-date_wrapper"><input class="input__type-text input__type-date" type="date" value="${date}" name="shipcomponents_all_date_${uin}"><label for="" class="input__type-date_icon"><img src="assets/images/calendar.svg" alt=""></label></div>`;
    cellPrim.innerHTML       = `<input class="input__type-text" type="text" value="${prim}" name="shipcomponents_all_prim_${uin}">`;
}

customSelect('analysis_components_set_customDropdown', JSON.parse(localStorage.getItem("sets_list")), 'комплект');
customSelect('analysis_components_prod_customDropdown', JSON.parse(localStorage.getItem("products_list")), 'изделие');
customSelect('analysis_components_contr_customDropdown', JSON.parse(localStorage.getItem("contragents_list")), 'контрагента');
customSelect('analysis_components_status_customDropdown', JSON.parse(localStorage.getItem("statuses_list")), 'статус');

let filt_analysis_components_all = [];
let filt_1 = {fld: "uin", on: "sets"};
let filt_2 = {fld: "uin", on: "products"};
let filt_3 = {fld: "uin", on: "contragents"};
let filt_4 = {fld: "uin", on: "statuses"};
let filt_5 = {fld: "date", vald: []};
filt_analysis_components_all.push(filt_5);

listenCustomSelect("analysis_components_set_customDropdown", filt_1, [], filt_analysis_components_all);
listenCustomSelect("analysis_components_prod_customDropdown", filt_2, [], filt_analysis_components_all);
listenCustomSelect("analysis_components_contr_customDropdown", filt_3, [], filt_analysis_components_all);
listenCustomSelect("analysis_components_status_customDropdown", filt_4, [], filt_analysis_components_all);
listenDate(document.getElementById('filt_analysis_components_all_date_first'), document.getElementById('filt_analysis_components_all_date_second'), filt_5, [], filt_analysis_components_all);

document.getElementById("button_analysis_components_choose").addEventListener("click", () => {
    sendFiltAnalisys(filt_analysis_components_all, 'tb_analysis_components_all', 'shipCompontsAll', funcProcessGetShipComponentsAll);
})

document.getElementById("button_analysis_components_reset").addEventListener("click", () => {
    filt_analysis_components_all.length = 0;
    clearCustomSelect('analysis_components_set_customDropdown', 'комплект');
    clearCustomSelect('analysis_components_prod_customDropdown', 'изделие');
    clearCustomSelect('analysis_components_contr_customDropdown', 'контрагента');
    clearCustomSelect('analysis_components_status_customDropdown', 'статус');
    document.getElementById('filt_analysis_components_all_date_first').value = '';
    document.getElementById('filt_analysis_components_all_date_second').value = '';
    funcGetShipComponentsAll();
    filt_analysis_components_all.push(filt_5);
})

customSortSelect("sort_analysis_components");
sortAnalisys("sort_analysis_components", filt_analysis_components_all, "shipCompontsAll", funcProcessGetShipComponentsAll);