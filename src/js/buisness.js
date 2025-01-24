/* общие */
import '../blocks/#common/common.styles.scss';
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
import '../blocks/input/__type-date/input__type-date.scss';
import '../blocks/input/__type-radio/input__type-radio.scss';
/* select */
import '../blocks/select/select.scss';
import '../blocks/select/select.js';
import '../blocks/select/_modal/select_modal.scss';
/* checkbox */
import '../blocks/checkbox/checkbox.scss';
/* модальные окна */
import '../blocks/modal/modal.scss';
/* дерево */
import '../blocks/tree/jstree.scss';
import '../blocks/tree/jstree.js';
/* таблицы */
import '../blocks/table/table.scss';

import {funcGetGrfShipSets} from '../blocks/table/__schedule/table__schedule.js';
import '../blocks/table/__schedule/table__schedule.scss'

import {funcGetSNProd} from '../blocks/table/__snprod/table__snprod.js';

import {funcGetShipSets} from '../blocks/table/__analysis-sets/table__analysis-sets.js';
import '../blocks/table/__analysis-sets/table__analysis-sets.scss';
import {funcGetShipProducts} from '../blocks/table/__analysis-products/table__analysis-products.js';
import '../blocks/table/__analysis-products/table__analysis-products.scss';
import {funcGetShipProductsAll} from '../blocks/table/__analysis-products-all/table__analysis-products-all.js';
import {funcGetShipComponentsAll} from '../blocks/table/__analysis-components/table__analysis-components.js';

import {funcGetDocpost} from '../blocks/table/__provider/table__provider.js';

import {funcGetSets} from '../blocks/table/__sets-main/table__sets-main.js';
import {funcGetFormulaSets} from '../blocks/table/__sets-formula/table__sets-formula.js';

import {funcGetProducts} from '../blocks/table/__products-main/table__products-main.js';
import {funcGetFormulaProducts} from '../blocks/table/__products-formula/table__products-formula.js';
import {funcGetColors} from '../blocks/table/__products-colors/table__products-colors.js';
import {funcGetVerapp} from '../blocks/table/__products-verapp/table__products-verapp.js';
import {funcGetVerpp} from '../blocks/table/__products-verpp/table__products-verpp.js';

import {funcGetComponentsTree} from '../blocks/table/__comp-main/table__comp-main.js';
import {funcGetMeas} from '../blocks/table/__comp-meas/table__comp-meas.js';
import {funcGetCoeffs} from '../blocks/table/__comp-coeffs/table__comp-coeffs.js';
import {funcGetProps} from '../blocks/table/__comp-props/table__comp-props.js';
import {funcGetTypeselem} from '../blocks/table/__comp-typeselem/table__comp-typeselem.js';

import {funcGetContragents} from '../blocks/table/__contragents/table__contragents.js';

import {funcGetStorages} from '../blocks/table/__storages/table__storages.js';

import {funcGetStatuses} from '../blocks/table/__status-shipment/table__status-shipment.js';
import {funcGetStatussn} from '../blocks/table/__status-sn/table__status-sn.js';
import {funcGetStatusDoc} from '../blocks/table/__status-document/table__status-document.js';

window.onload = function(){
    funcGetGrfShipSets();
    funcGetSets();
    funcGetFormulaSets();
    funcGetProducts();
    funcGetFormulaProducts();
    funcGetColors();
    funcGetVerapp();
    funcGetVerpp();
    
    funcGetComponentsTree();
    funcGetMeas();
    funcGetCoeffs();
    funcGetProps();
    funcGetTypeselem();
    
    funcGetSNProd();
    funcGetShipSets();
    funcGetShipProducts();
    funcGetShipProductsAll();
    funcGetShipComponentsAll();
    funcGetDocpost();
    funcGetContragents();
    funcGetStorages();

    funcGetStatuses();
    funcGetStatussn();
    funcGetStatusDoc();
    //funcGetUsers();
    returnTabsBuisness();
}

const returnTabsBuisness = () => {
    let sidebar_tab_first_active = document.getElementById(localStorage.getItem("buisness_sidebar_tab_first_active"));
    sidebar_tab_first_active.click();
    if(sidebar_tab_first_active.className.includes("sidebar__link_no-child")){localStorage.removeItem("buisness_sidebar_tab_second_active"); localStorage.removeItem("buisness_tabcontent_tab_active")};

    let sidebar_tab_second_active = document.getElementById(localStorage.getItem("buisness_sidebar_tab_second_active"));
    if(sidebar_tab_second_active != null){
        sidebar_tab_second_active.parentElement.parentElement.previousElementSibling.click();
        sidebar_tab_second_active.click();

        if(sidebar_tab_second_active.className.includes("sidebar__menu__link_no-child")){localStorage.removeItem("buisness_tabcontent_tab_active")};
    
        let buisness_sidebar_arrow_active = localStorage.getItem("buisness_sidebar_arrow_active");
        document.getElementById(buisness_sidebar_arrow_active).className += " sidebar__wrapper_menu-visibale";
    }

    let tabcontent_tab_active = document.getElementsByClassName(localStorage.getItem("buisness_tabcontent_tab_active"));
    tabcontent_tab_active[0].click();
}