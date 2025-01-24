import {funcCommand, listenFiltSelectAnalisys, sendFiltAnalisys, clearFiltAnalisys, sortAnalisys, makeSelect} from '../../../js/common/common.js';
import {addToDropdownPsevdo, psevdoSelect} from '../../select/select.js';

let filt_analysis_components_all = [];

export const funcGetShipComponentsAll = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"shipCompontsAll", "count":"500", "filt":"", "asort": "uin"};
    funcCommand(body, funcProcessGetShipComponentsAll);
}

const funcProcessGetShipComponentsAll = (result, respobj) => {
    if( result === 0 ) return;
    if(respobj.answ === ""){alert("Не найдено! Повторите запрос!"); funcGetShipComponentsAll()};
    console.log("Анализ всех комплектующих:", respobj);

    let tb_id = "tb_analysis_components_all";

    for (let key in respobj.answ) {
        let val = respobj.answ[key];
        let SNset = val.SNset;
        let NPset = val.NPset;
        let set = val.set;
        let product = val.product;
        let innproduct = val.innprod;
        let count = val.count;
        let component = val.compont;
        let status = val.status.name;
        let uinstatus = val.status.uin;
        let kontr = val.kontr;
        let date = val.date;
        let prim = val.prim;
        let uin = val.uin;
        addRowColumsShipComponentsAll(SNset, NPset, set, product, innproduct, count, component, status, uinstatus, kontr, date, prim, uin, tb_id);
    }
}

function addRowColumsShipComponentsAll(SNset, NPset, set, product, innproduct, count, component, status, uinstatus, kontr, date, prim, uin, tb_id){
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellSNset      = newRow.insertCell(0);  cellSNset.classList      = "td";
    let cellNPset      = newRow.insertCell(1);  cellNPset.classList      = "td";
    let cellSet        = newRow.insertCell(2);  cellSet.classList        = "td";
    let cellProduct    = newRow.insertCell(3);  cellProduct.classList    = "td";
    let cellInnproduct = newRow.insertCell(4);  cellInnproduct.classList = "td";
    let cellCount      = newRow.insertCell(5);  cellCount.classList      = "td";
    let cellComp       = newRow.insertCell(6);  cellComp.classList       = "td";
    let cellStatus     = newRow.insertCell(7);  cellStatus.classList     = "td";
    let cellKontr      = newRow.insertCell(8);  cellKontr.classList      = "td";
    let cellDate       = newRow.insertCell(9);  cellDate.classList       = "td";
    let cellPrim       = newRow.insertCell(10); cellPrim.classList       = "td";

    makeSelect("shipcomponents_all_select_", uin, status, uinstatus, "statuses_list", "select", cellStatus);

    cellDate.innerHTML = `<input class="input__type-text" type="date" value="${date}" name="shipcomponents_all_date_${uin}">`;
    cellPrim.innerHTML = `<input class="input__type-text" type="text" value="${prim}" name="shipcomponents_all_prim_${uin}">`;

    let cellSNsetText      = document.createTextNode(SNset);      cellSNset.appendChild(cellSNsetText);
    let cellNPsetText      = document.createTextNode(NPset);      cellNPset.appendChild(cellNPsetText);
    let cellSetText        = document.createTextNode(set);        cellSet.appendChild(cellSetText);
    let cellProductText    = document.createTextNode(product);    cellProduct.appendChild(cellProductText);
    let cellCountText      = document.createTextNode(count);      cellCount.appendChild(cellCountText);
    let cellCompText       = document.createTextNode(component);  cellComp.appendChild(cellCompText);
    let cellInnproductText = document.createTextNode(innproduct); cellInnproduct.appendChild(cellInnproductText);
    let cellKontrText      = document.createTextNode(kontr);      cellKontr.appendChild(cellKontrText);
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
    clearFiltAnalisys('filt_analysis_components_all_sets_items', 'filt_analysis_components_all_products_items', 'filt_analysis_components_all_components_items', 'filt_analysis_components_all_contragents_items',
        'filt_analysis_components_all_status_items', "filt_analysis_components_all_date_first", "filt_analysis_components_all_date_second", 'tb_analysis_components_all', filt_analysis_components_all, funcGetShipComponentsAll());
});

listenFiltSelectAnalisys('filt_analysis_components_all_sets_items', 'filt_analysis_components_all_products_items', 'filt_analysis_components_all_components_items', 'filt_analysis_components_all_contragents_items',
'filt_analysis_components_all_status_items', "filt_analysis_components_all_date_first", "filt_analysis_components_all_date_second", filt_analysis_components_all);

sortAnalisys("sort_analysis_components", "tb_analysis_components_all", filt_analysis_components_all, "shipCompontsAll", funcProcessGetShipComponentsAll);