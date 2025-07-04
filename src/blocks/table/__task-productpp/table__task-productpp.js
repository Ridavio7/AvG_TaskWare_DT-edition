import {funcCommand, addToDropdownTaskSelect} from '../../../js/common/common.js.js';

export const funcGetProductpp = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"getproductpp", "count":"1000", "sort":"name"};
    funcCommand(body, funcProcessGetProductpp);
}

const funcProcessGetProductpp = (result, respobj) => {
    console.log("Изделия монтаж:", respobj);
    
    let select_id = "mount_prod";
    for (let key in respobj.answ) {
        let obj  = respobj.answ[key];
        let name = obj.name;
        let buy  = 1;
        let del  = 0;
        let uin  = obj.uinproduct;
        addToDropdownTaskSelect(name, buy, del, uin, select_id);
    }
}