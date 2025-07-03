import {funcCommand, listenFiltSelectAnalisys, sendFiltAnalisys, clearFiltAnalisys, sortAnalisys, makeSelect, responseProcessor} from '../../../js/common/common.js';
import {addToDropdownPsevdo, psevdoSelect} from '../../select/select.js';

let filt_analysis_components_all = [];

export const funcGetShipComponentsAll = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shipCompontsAll", "count":"500", "filt":"", "asort": "uin", "filt":`${JSON.stringify(filt_analysis_components_all)}`};
    funcCommand(body, funcProcessGetShipComponentsAll);
}

const funcProcessGetShipComponentsAll = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    if(respobj.answ === "" && respobj.succ === 0){alert("Не найдено! Повторите запрос!"); document.getElementById("button_analysis_components_reset").click()};
    console.log("Анализ всех комплектующих:", respobj);

    let tb_id = "tb_analysis_components_all";

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
    cellDate.innerHTML       = `<input class="input__type-text input__type-date" type="date" value="${date}" name="shipcomponents_all_date_${uin}">`;
    cellPrim.innerHTML       = `<input class="input__type-text" type="text" value="${prim}" name="shipcomponents_all_prim_${uin}">`;
}

addToDropdownPsevdo("filt_analysis_components_all_sets_items", JSON.parse(localStorage.getItem("sets_list")));
psevdoSelect("filt_analysis_components_all_sets");

addToDropdownPsevdo("filt_analysis_components_all_products_items", JSON.parse(localStorage.getItem("products_list")));
psevdoSelect("filt_analysis_components_all_products");

addToDropdownPsevdo("filt_analysis_components_all_components_items", JSON.parse(localStorage.getItem("components_list")));
psevdoSelect("filt_analysis_components_all_components");

addToDropdownPsevdo("filt_analysis_components_all_contragents_items", JSON.parse(localStorage.getItem("contragents_list")));
psevdoSelect("filt_analysis_components_all_contragents");

addToDropdownPsevdo("filt_analysis_components_all_status_items", JSON.parse(localStorage.getItem("statuses_list")));
psevdoSelect("filt_analysis_components_all_status");

let button_analysis_components_choose = document.getElementById("button_analysis_components_choose");
button_analysis_components_choose.addEventListener("click", () => {
    sendFiltAnalisys(filt_analysis_components_all, 'tb_analysis_components_all', 'shipCompontsAll', funcProcessGetShipComponentsAll);
});

let button_analysis_components_reset = document.getElementById("button_analysis_components_reset");
button_analysis_components_reset.addEventListener("click", () => {
    filt_analysis_components_all.length = 0;
    clearFiltAnalisys('filt_analysis_components_all_sets_items', 'filt_analysis_components_all_products_items', 'filt_analysis_components_all_components_items', 'filt_analysis_components_all_contragents_items',
        'filt_analysis_components_all_status_items', "filt_analysis_components_all_date_first", "filt_analysis_components_all_date_second", 'tb_analysis_components_all', filt_analysis_components_all, funcGetShipComponentsAll());
});

listenFiltSelectAnalisys('filt_analysis_components_all_sets_items', 'filt_analysis_components_all_products_items', 'filt_analysis_components_all_components_items', 'filt_analysis_components_all_contragents_items',
'filt_analysis_components_all_status_items', "filt_analysis_components_all_date_first", "filt_analysis_components_all_date_second", filt_analysis_components_all);

sortAnalisys("sort_analysis_components", "tb_analysis_components_all", filt_analysis_components_all, "shipCompontsAll", funcProcessGetShipComponentsAll);