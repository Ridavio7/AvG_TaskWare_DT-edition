import {funcCommand} from '../../../js/common/common.js';

/* соответствия типов елементов-комплектующих и свойств комплект-х */
export const funcGetComponentInfoTypesProps = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"typesprops", "count":"100", "uintypes":`${uin}`}
    funcCommand(body, funcProcessGetComponentInfoTypesProps);
}

const funcProcessGetComponentInfoTypesProps = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Комплектующее TypesProps:", respobj);

    let typesprops_list = respobj.answ;
    localStorage.setItem("typesprops_list", JSON.stringify(typesprops_list));
}