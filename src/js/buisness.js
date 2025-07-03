import 'normalize.css';
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
import '../blocks/input/__type-time/input__type-time.scss';
import '../blocks/input/__type-radio/input__type-radio.scss';
import '../blocks/input/__type-file/input__type-file.scss';
import '../blocks/input/__type-file/input__type-file.js';
/* select */
import '../blocks/select/select.scss';
import '../blocks/select/select.js';
import '../blocks/select/_modal/select_modal.scss';
/* модальные окна */
import '../blocks/modal/modal.scss';
import '../blocks/modal/__notification/modal__notification.scss';
import '../blocks/modal/__notification/modal__notification.js';
/* дерево */
import '../blocks/_tree/tree.js';
import '../blocks/_tree/tree.scss';
/* таблицы */
import '../blocks/table/table.scss';
/* карусель */
import '../blocks/carousel/carousel.scss';
import '../blocks/carousel/carousel.js';

import {addEventButtonTab, returnTabs, updateDirectory} from '../js/common/common.js.js';

/* Отгрузка */
import {funcGetGrfShipSets} from '../blocks/table/__schedule/table__schedule.js';
import '../blocks/table/__schedule/table__schedule.scss'
import {funcGetSNProd} from '../blocks/table/__snprod/table__snprod.js';
import {funcGetStatuses} from '../blocks/table/__status-shipment/table__status-shipment.js';
import {funcGetStatussn} from '../blocks/table/__status-sn/table__status-sn.js';
import {funcGetShipSets} from '../blocks/table/__analysis-sets/table__analysis-sets.js';
import '../blocks/table/__analysis-sets/table__analysis-sets.scss';
import {funcGetShipProducts} from '../blocks/table/__analysis-products/table__analysis-products.js';
import '../blocks/table/__analysis-products/table__analysis-products.scss';
import {funcGetShipProductsAll} from '../blocks/table/__analysis-products-all/table__analysis-products-all.js';
import {funcGetShipComponentsAll} from '../blocks/table/__analysis-components/table__analysis-components.js';

/* монтаж/сборка */
import {funcGetLentapp} from '../blocks/table/__production-lentapp/table__production-lentapp.js';
import {funcGetPlan} from '../blocks/table/__production-plan/table__production-plan.js';
import {funcGetPivTableppTab} from '../blocks/table/__production-pivtablepp/table__production-pivtablepp.js';
import {funcGetTechproc} from '../blocks/table/__production-techproc/table__production-techproc.js';

/* поставка */
import {funcGetDocpost} from '../blocks/table/__provider/table__provider.js';
import {funcGetStatusDoc} from '../blocks/table/__status-document/table__status-document.js';

/* проектирование */

/* склад */
import {funcGetProductsTree} from '../blocks/table/__storage-main/table__storage-main.js';
import {funcGetColors} from '../blocks/table/__products-colors/table__products-colors.js';
import {funcGetVerapp} from '../blocks/table/__products-verapp/table__products-verapp.js';
import {funcGetVerpp} from '../blocks/table/__products-verpp/table__products-verpp.js';

/* вкладка комплекты */
import {funcGetSets} from '../blocks/table/__sets-main/table__sets-main.js';
import {funcGetFormulaSets} from '../blocks/table/__sets-formula/table__sets-formula.js';

/* вкладка изделия */
import {funcGetProducts} from '../blocks/table/__products-main/table__products-main.js';
import {funcGetFormulaProducts} from '../blocks/table/__products-formula/table__products-formula.js';


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


window.onload = function(){
    updateDirectory();
    funcGetShipProductsAll();
    returnTabs();
}

// отгрузка
addEventButtonTab(document.querySelectorAll(".button__tab__first_shipment-schedule"), funcGetGrfShipSets);
addEventButtonTab(document.querySelectorAll(".button__tab__first_shipment-snprod"), funcGetSNProd);
addEventButtonTab(document.querySelectorAll(".button__tab__first_shipment-statussn"), funcGetStatussn);
addEventButtonTab(document.querySelectorAll(".button__tab__first_shipment-statusship"), funcGetStatuses);
addEventButtonTab(document.querySelectorAll(".button__tab__first_shipment-analysis-sets"), funcGetShipSets);
addEventButtonTab(document.querySelectorAll(".button__tab__first_shipment-analysis-products"), funcGetShipProducts);
addEventButtonTab(document.querySelectorAll(".button__tab__first_shipment-analysis-components"), funcGetShipComponentsAll);

// монтаж
addEventButtonTab(document.querySelectorAll(".button__tab__first_production-events"), funcGetLentapp);
addEventButtonTab(document.querySelectorAll(".button__tab__first_production-plan"), funcGetPlan);
addEventButtonTab(document.querySelectorAll(".button__tab__first_production-pivtablepp"), funcGetPivTableppTab);
addEventButtonTab(document.querySelectorAll(".button__tab__first_production-process"), funcGetTechproc);
addEventButtonTab(document.querySelectorAll(".button__tab__first_production-install-coil"), '');

// проектирование

// поставка
addEventButtonTab(document.querySelectorAll(".button__tab__first_provider-main"), funcGetDocpost);
addEventButtonTab(document.querySelectorAll(".button__tab__first_provider-statusdoc"), funcGetStatusDoc);

// проектирование
addEventButtonTab(document.querySelectorAll(".button__tab__first_development-begunok"), '');

// склад
addEventButtonTab(document.querySelectorAll(".button__tab__first_storage-main"), funcGetProductsTree);
addEventButtonTab(document.querySelectorAll(".button__tab__first_storage-storages"), funcGetStorages);
addEventButtonTab(document.querySelectorAll(".button__tab__first_storage-colors"), funcGetColors);
addEventButtonTab(document.querySelectorAll(".button__tab__first_storage-verapp"), funcGetVerapp);
addEventButtonTab(document.querySelectorAll(".button__tab__first_storage-verpp"), funcGetVerpp);

// комплектующие
addEventButtonTab(document.querySelectorAll(".button__tab__first_components-main"), funcGetComponentsTree);
addEventButtonTab(document.querySelectorAll(".button__tab__first_components-measurement"), funcGetMeas);
addEventButtonTab(document.querySelectorAll(".button__tab__first_components-coeffs"), funcGetCoeffs);
addEventButtonTab(document.querySelectorAll(".button__tab__first_components-props"), funcGetProps);
addEventButtonTab(document.querySelectorAll(".button__tab__first_components-typeselem"), funcGetTypeselem);

// контрагенты
addEventButtonTab(document.querySelectorAll(".sidebar__link_contragents"), funcGetContragents);