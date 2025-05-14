import 'normalize.css';
/* общие */
import '../blocks/#common/common.styles.scss';
import {funcCommand, togglePassword} from './common/common.js.js';
/* шапка */
import '../blocks/header/header.scss';
/* кнопки */
import '../blocks/button/__control/button__control.scss';
import '../blocks/button/__control/_modal/button__control_modal.scss';
import '../blocks/button/__tab/button__tab.scss';
import '../blocks/button/__select/button__select.scss'
/* input */
import '../blocks/input/__type-text/input__type-text.scss';
import '../blocks/input/__type-text/_modal/input__type-text_modal.scss';
import '../blocks/input/__type-checkbox/input__type-checkbox.scss';
import '../blocks/input/__type-date/input__type-date.scss';
import '../blocks/input/__type-radio/input__type-radio.scss';
import '../blocks/input/__type-file/input__type-file.scss';

import '../blocks/entrance/entrance.scss';

const handleFormSubmit = (event) => {
    event.preventDefault()
    let login = document.getElementById('logon_login').value;
    let pass = document.getElementById('logon_pass').value;
    
    let body  =  {"meth":"logon", "log": login, "psw": pass};
    funcCommand(body, funcGetToken);
}

const funcGetToken = (result, respobj) => {
    if( result === 0 ) return;
    if(respobj.succ === 0){
        alert('Ошибка авторизации!');
    } else {
        localStorage.setItem('srtf', respobj.srtf);

        funcGetUserInfo(respobj.uinuser);
    }
}

const funcGetUserInfo = (uin) => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"users", "count":"1", "filt":`[{"fld":"uin","val":["${uin}"]}]`};
    funcCommand(body, funcProcessGetUserInfo);
}

const funcProcessGetUserInfo = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Пользователь:", respobj);

    let name = respobj.answ[0].name;
    localStorage.setItem('user_name', name);
    alert(`${name}, добро пожаловать на платформу TW! Вы успешно авторизованы!`)
    window.location = 'tasks.html';
}

document.getElementById('logon').addEventListener('submit', handleFormSubmit);

document.getElementById('logon_pass_toggle').addEventListener('click', (elem) => togglePassword(elem, 'logon_pass'));