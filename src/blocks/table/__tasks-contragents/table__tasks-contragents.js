import {funcCommand, addToDropdownTaskSelect} from '../../../js/common/common.js.js';

export const funcGetContragents = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"contragents", "count":"1000"};
    funcCommand(body, funcProcessGetContragents);
}

const funcProcessGetContragents = (result, respobj) => {
    console.log("Контрагенты:", respobj);

    let select_id = "task_contragents";
    for (let key in respobj.answ) {
        let obj  = respobj.answ[key];
        let name = obj.name;
        let buy  = obj.buy
        let del  = obj.del;
        let uin  = obj.uin;
        addToDropdownTaskSelect(name, buy, del, uin, select_id);
    }
}