import {funcCommand, addToDropdownTaskSelect, responseProcessor} from '../../../js/common/common.js.js';

export const funcGetUsers = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"users", "count":"1000"};
    funcCommand(body, funcProcessGetUsers);
}

const funcProcessGetUsers = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    console.log("Пользователи:", respobj);

    let select_id = "mount_users";
    for (let key in respobj.answ) {
        let obj  = respobj.answ[key];
        let name = obj.name;
        let buy  = 1;
        let del  = obj.del;
        let uin  = obj.uin;
        addToDropdownTaskSelect(name, buy, del, uin, select_id);
    }
}