import 'normalize.css';
/* общие */
import '../blocks/#common/common.styles.scss';
import {funcCommand, togglePassword, responseProcessor} from './common/common.js.js';
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
/* модальные окна */
import '../blocks/modal/__notification/modal__notification.scss';
import '../blocks/modal/__notification/modal__notification.js';

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
    if(responseProcessor(respobj.succ) === true){
        localStorage.setItem('srtf', respobj.srtf);
        localStorage.setItem('user_name', respobj.name);
        window.location = 'tasks.html';
    }
}

document.getElementById('logon').addEventListener('submit', handleFormSubmit);

document.getElementById('logon_pass_toggle').addEventListener('click', (elem) => togglePassword(elem, 'logon_pass'));