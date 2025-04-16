/* общие */
import '../blocks/#common/common.styles.scss';
import {funcCommand} from '../js/common/common.js.js';
/* шапка */
import '../blocks/header/header.scss';
import '../blocks/header/header.js';
/* боковая панель */
import '../blocks/sidebar/sidebar.scss';
import '../blocks/sidebar/sidebar.js';
/* кнопки */
import '../blocks/button/__control/button__control.scss';
import '../blocks/button/__control/_modal/button__control_modal.scss';
import '../blocks/button/__control/button__control.js';
import '../blocks/button/__tab/button__tab.scss';
import '../blocks/button/__tab/button__tab.js';
import '../blocks/button/__select/button__select.scss'
/* input */
import '../blocks/input/__type-text/input__type-text.scss';
import '../blocks/input/__type-text/_modal/input__type-text_modal.scss';
import '../blocks/input/__type-checkbox/input__type-checkbox.scss';
import '../blocks/input/__type-date/input__type-date.scss';
import '../blocks/input/__type-radio/input__type-radio.scss';
import '../blocks/input/__type-file/input__type-file.scss';
import '../blocks/input/__type-file/input__type-file.js';
/* select */
import '../blocks/select/select.scss';
import '../blocks/select/select.js';
import '../blocks/select/_modal/select_modal.scss';
/* модальные окна */
import '../blocks/modal/modal.scss';
/* дерево */
import '../blocks/_tree/tree.js';
import '../blocks/_tree/tree.scss';
/* таблицы */
import '../blocks/table/table.scss';
/* карусель */
import '../blocks/carousel/carousel.scss';
import '../blocks/carousel/carousel.js';

/* Отгрузка */
import {funcGetGrfShipSets} from '../blocks/table/__schedule/table__schedule.js';
import '../blocks/table/__schedule/table__schedule.scss'
import {funcGetSNProd} from '../blocks/table/__snprod/table__snprod.js';
import {funcGetShipSets} from '../blocks/table/__analysis-sets/table__analysis-sets.js';
import '../blocks/table/__analysis-sets/table__analysis-sets.scss';
import {funcGetShipProducts} from '../blocks/table/__analysis-products/table__analysis-products.js';
import '../blocks/table/__analysis-products/table__analysis-products.scss';
import {funcGetShipProductsAll} from '../blocks/table/__analysis-products-all/table__analysis-products-all.js';
import {funcGetShipComponentsAll} from '../blocks/table/__analysis-components/table__analysis-components.js';

/* монтаж/сборка */
import {funcGetLentapp} from '../blocks/table/__production-lentapp/table__production-lentapp.js';
import {funcGetPlan} from '../blocks/table/__production-plan/table__production-plan.js';
import {funcGetPivTablepp} from '../blocks/table/__production-pivtablepp/table__production-pivtablepp.js';
import {funcGetTechproc} from '../blocks/table/__production-techproc/table__production-techproc.js';

/* поставка */
import {funcGetDocpost} from '../blocks/table/__provider/table__provider.js';

/* склад */
import {funcGetProductsTree} from '../blocks/table/__storage-main/table__storage-main.js';

/* вкладка комплекты */
import {funcGetSets} from '../blocks/table/__sets-main/table__sets-main.js';
import {funcGetFormulaSets} from '../blocks/table/__sets-formula/table__sets-formula.js';

/* вкладка изделия */
import {funcGetProducts} from '../blocks/table/__products-main/table__products-main.js';
import {funcGetFormulaProducts} from '../blocks/table/__products-formula/table__products-formula.js';
import {funcGetColors} from '../blocks/table/__products-colors/table__products-colors.js';
import {funcGetVerapp} from '../blocks/table/__products-verapp/table__products-verapp.js';
import {funcGetVerpp} from '../blocks/table/__products-verpp/table__products-verpp.js';

/* вкладка комплектующие */
import {funcGetComponentsTree} from '../blocks/table/__comp-main/table__comp-main.js';
import {funcGetMeas} from '../blocks/table/__comp-meas/table__comp-meas.js';
import {funcGetCoeffs} from '../blocks/table/__comp-coeffs/table__comp-coeffs.js';
import {funcGetProps} from '../blocks/table/__comp-props/table__comp-props.js';
import {funcGetTypeselem} from '../blocks/table/__comp-typeselem/table__comp-typeselem.js';

/* контрагенты */
import {funcGetContragents} from '../blocks/table/__contragents/table__contragents.js';

/* склады */
import {funcGetStorages} from '../blocks/table/__storages/table__storages.js';

/* статусы */
import {funcGetStatuses} from '../blocks/table/__status-shipment/table__status-shipment.js';
import {funcGetStatussn} from '../blocks/table/__status-sn/table__status-sn.js';
import {funcGetStatusDoc} from '../blocks/table/__status-document/table__status-document.js';

window.onload = function(){
    updateDirectory();
    funcGetShipProductsAll();
    returnTabsBuisness();
}

const returnTabsBuisness = () => {
    let sidebar_tab_first_active = document.getElementById(localStorage.getItem("buisness_sidebar_tab_first_active"));
    sidebar_tab_first_active.click();
    if(sidebar_tab_first_active.className.includes("sidebar__link_no-child")){localStorage.removeItem("buisness_sidebar_tab_second_active"); /*localStorage.removeItem("buisness_tabcontent_tab_active")*/};

    let sidebar_tab_second_active = document.getElementById(localStorage.getItem("buisness_sidebar_tab_second_active"));
    if(sidebar_tab_second_active != null){
        sidebar_tab_second_active.parentElement.parentElement.previousElementSibling.click();
        sidebar_tab_second_active.click();

        if(sidebar_tab_second_active.className.includes("sidebar__menu__link_no-child")){localStorage.removeItem("buisness_tabcontent_tab_active")};
    
        //let buisness_sidebar_arrow_active = localStorage.getItem("buisness_sidebar_arrow_active");
        //document.getElementById(buisness_sidebar_arrow_active).className += " sidebar__wrapper_menu-visibale";
    }

    document.getElementById("sidebar_tablink_6").className += " sidebar__wrapper_menu-visibale";

    let tabcontent_tab_active = document.getElementsByClassName(localStorage.getItem("buisness_tabcontent_tab_active"));
    tabcontent_tab_active[0].click();
}

const updateDirectory = () => {
    let body_1 = {"user":"demo", "meth":"view", "obj":"sets", "count":"5000"};
    funcCommand(body_1, funcProcessGetSets);
    function funcProcessGetSets(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("sets_list", JSON.stringify(respobj.answ));
        
        let model_tain_nf = [];
        for(let key in respobj.answ){
            let set = respobj.answ[key];
            if(set.del === 0){
                let model = set.model_train;
                model_tain_nf.push(model);
            }
        }
        let model_train = Array.from(new Set(model_tain_nf.map(model_tain_nf => JSON.stringify(model_tain_nf)))).map(model_tain_nf => JSON.parse(model_tain_nf));
        localStorage.setItem("model_train", JSON.stringify(model_train));
    }

    let body_2 = {"user":"demo", "meth":"view", "obj":"products", "count":"5000"};
    funcCommand(body_2, funcProcessGetProducts);
    function funcProcessGetProducts(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("products_list", JSON.stringify(respobj.answ));
    }

    let body_3 = {"user":"demo", "meth":"view", "obj":"colors", "count":"5000"};
    funcCommand(body_3, funcProcessGetColors);
    function funcProcessGetColors(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("colors_list", JSON.stringify(respobj.answ));
    }

    let body_4 = {"user":"demo", "meth":"view", "obj":"verapp", "count":"5000"};
    funcCommand(body_4, funcProcessGetVerapp);
    function funcProcessGetVerapp(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("verapp_list", JSON.stringify(respobj.answ));
    }

    let body_5 = {"user":"demo", "meth":"view", "obj":"verpp", "count":"5000"};
    funcCommand(body_5, funcProcessGetVerpp);
    function funcProcessGetVerpp(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("verpp_list", JSON.stringify(respobj.answ));
    }

    let body_6 = {"user":"demo", "meth":"view", "obj":"meas", "count":"5000"};
    funcCommand(body_6, funcProcessGetMeas);
    function funcProcessGetMeas(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("meas_list", JSON.stringify(respobj.answ));
    }

    let body_7 = {"user":"demo", "meth":"view", "obj":"coeffs", "count":"5000", "sort":"uin"};
    funcCommand(body_7, funcProcessGetCoeffs);
    function funcProcessGetCoeffs(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("coeffs_list", JSON.stringify(respobj.answ));
    }

    let body_8 = {"user":"demo", "meth":"view", "obj":"props", "count":"5000"};
    funcCommand(body_8, funcProcessGetProps);
    function funcProcessGetProps(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("props_list", JSON.stringify(respobj.answ));
    }

    let body_9 = {"user":"demo", "meth":"view", "obj":"typeselem", "count":"5000"};
    funcCommand(body_9, funcProcessGetTypeselem);
    function funcProcessGetTypeselem(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("typelm_list", JSON.stringify(respobj.answ));
    }

    let body_10 = {"user":"demo", "meth":"view", "obj":"contragents", "count":"5000"};
    funcCommand(body_10, funcProcessGetContragents);
    function funcProcessGetContragents(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("contragents_list", JSON.stringify(respobj.answ));
    }

    let body_11 = {"user":"demo", "meth":"view", "obj":"storages", "count":"5000"};
    funcCommand(body_11, funcProcessGetStorages);
    function funcProcessGetStorages(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("storages_list", JSON.stringify(respobj.answ));
    }

    let body_12 = {"user":"demo", "meth":"view", "obj":"statuses", "count":"5000"};
    funcCommand(body_12, funcProcessGetStatuses);
    function funcProcessGetStatuses(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("statuses_list", JSON.stringify(respobj.answ));
    }

    let body_13 = {"user":"demo", "meth":"view", "obj":"statussn", "count":"5000"};
    funcCommand(body_13, funcProcessGetStatussn);
    function funcProcessGetStatussn(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("statussn_list", JSON.stringify(respobj.answ));
    }

    let body_14 = {"user":"demo", "meth":"view", "obj":"statusdoc", "count":"5000"};
    funcCommand(body_14, funcProcessGetStatusDoc);
    function funcProcessGetStatusDoc(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("statusdoc_list", JSON.stringify(respobj.answ));
    }

    let body_15 = {"user":"demo", "meth":"view", "obj":"users", "count":"5000"};
    funcCommand(body_15, funcProcessGetUsers);
    function funcProcessGetUsers(result, respobj){
        if( result === 0 ) return;
        localStorage.setItem("users_list", JSON.stringify(respobj.answ));
    }
}

const addEventButtonTab = (button_tab, func) => {
    button_tab.forEach((elem) => {
        elem.addEventListener("click", () => {
            func();
        })
    })
}

let button_tab_schedule        = document.querySelectorAll(".button__tab__first_schedule");
addEventButtonTab(button_tab_schedule, funcGetGrfShipSets);

let button_tab_snprod          = document.querySelectorAll(".button__tab__first_snprod");
addEventButtonTab(button_tab_snprod, funcGetSNProd);

let button_tab_analysis_sets   = document.querySelectorAll(".button__tab__first_analysis_sets");
addEventButtonTab(button_tab_analysis_sets, funcGetShipSets);

let button_tab_analysis_prod   = document.querySelectorAll(".button__tab__first_analysis_products");
addEventButtonTab(button_tab_analysis_prod, funcGetShipProducts);

let button_tab_analysis_comp   = document.querySelectorAll(".button__tab__first_analysis_components");
addEventButtonTab(button_tab_analysis_comp, funcGetShipComponentsAll);

let button_tab_sets_main       = document.querySelectorAll(".button__tab__first_sets_main");
addEventButtonTab(button_tab_sets_main, funcGetSets);

let button_tab_prod_lentapp    = document.querySelectorAll(".button__tab__first_events");
addEventButtonTab(button_tab_prod_lentapp, funcGetLentapp);

let button_tab_prod_plan       = document.querySelectorAll(".button__tab__first_plan");
addEventButtonTab(button_tab_prod_plan, funcGetPlan);

let button_tab_prod_pivtablepp       = document.querySelectorAll(".button__tab__first_pivtablepp");
addEventButtonTab(button_tab_prod_pivtablepp, funcGetPivTablepp('', new Date().toISOString().split('T')[0].replace(/[\.\-/\\\s]/g, '')));

let button_tab_storage_main   = document.querySelectorAll(".button__tab__first_storage_main");
addEventButtonTab(button_tab_storage_main, funcGetProductsTree);

let button_tab_prod_techproc   = document.querySelectorAll(".button__tab__first_process");
addEventButtonTab(button_tab_prod_techproc, funcGetTechproc);

let button_tab_sets_formula    = document.querySelectorAll(".button__tab__first_sets_formula");
addEventButtonTab(button_tab_sets_formula, funcGetFormulaSets);

let button_tab_product_main    = document.querySelectorAll(".button__tab__first_product_main");
addEventButtonTab(button_tab_product_main, funcGetProducts);

let button_tab_product_formula = document.querySelectorAll(".button__tab__first_product_formula");
addEventButtonTab(button_tab_product_formula, funcGetFormulaProducts);

let button_tab_product_colors  = document.querySelectorAll(".button__tab__first_product_colors");
addEventButtonTab(button_tab_product_colors, funcGetColors);

let button_tab_product_verapp  = document.querySelectorAll(".button__tab__first_product_verapp");
addEventButtonTab(button_tab_product_verapp, funcGetVerapp);

let button_tab_product_verpp   = document.querySelectorAll(".button__tab__first_product_verpp");
addEventButtonTab(button_tab_product_verpp, funcGetVerpp);

let button_tab_components      = document.querySelectorAll(".button__tab__first_components");
addEventButtonTab(button_tab_components, funcGetComponentsTree);

let button_tab_measurement     = document.querySelectorAll(".button__tab__first_measurement");
addEventButtonTab(button_tab_measurement, funcGetMeas);

let button_tab_coeffs          = document.querySelectorAll(".button__tab__first_coeffs");
addEventButtonTab(button_tab_coeffs, funcGetCoeffs);

let button_tab_props           = document.querySelectorAll(".button__tab__first_props");
addEventButtonTab(button_tab_props, funcGetProps);

let button_tab_typeselem       = document.querySelectorAll(".button__tab__first_typeselem");
addEventButtonTab(button_tab_typeselem, funcGetTypeselem);

let button_tab_shipment        = document.querySelectorAll(".button__tab__first_shipment");
addEventButtonTab(button_tab_shipment, funcGetStatuses);

let button_tab_statussn        = document.querySelectorAll(".button__tab__first_statussn");
addEventButtonTab(button_tab_statussn, funcGetStatussn);

let button_tab_document        = document.querySelectorAll(".button__tab__first_document");
addEventButtonTab(button_tab_document, funcGetStatusDoc);

let sidebar_menu_schedule      = document.querySelectorAll(".sidebar__menu__link_schedule");
addEventButtonTab(sidebar_menu_schedule, funcGetGrfShipSets);

let sidebar_menu_provider      = document.querySelectorAll(".sidebar__link_provider");
addEventButtonTab(sidebar_menu_provider, funcGetDocpost);

let sidebar_menu_contr         = document.querySelectorAll(".sidebar__menu__link_contr");
addEventButtonTab(sidebar_menu_contr, funcGetContragents);

let sidebar_menu_storages      = document.querySelectorAll(".sidebar__menu__link_storages");
addEventButtonTab(sidebar_menu_storages, funcGetStorages);