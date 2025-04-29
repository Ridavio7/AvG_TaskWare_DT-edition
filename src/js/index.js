import 'normalize.css';
/* общие */
import '../blocks/#common/common.styles.scss';
import {funcCommand, funcProcessOnlyInfo} from './common/common.js.js';

const handleFormSubmit = (event) => {
    event.preventDefault()
    let login = document.getElementById('logon_login').value;
    let pass = document.getElementById('logon_pass').value;
    
    let body  =  {"meth":"logon", "log": login, "psw": pass};
    funcCommand(body, funcGetToken);
}

const funcGetToken = (result, respobj) => {
    if( result === 0 ) return;
    console.log(respobj);
    if(respobj.succ === 0){
        alert('Ошибка авторизации!');
    } else {
        localStorage.setItem('srtf', respobj.srtf);

        funcGetUserInfo(respobj.uinuser);
    }
}

const funcGetUserInfo = (uin) => {
    let body = {"user":"demo", "meth":"view", "obj":"users", "count":"1", "filt":`[{"fld":"uin","val":["${uin}"]}]`};
    funcCommand(body, funcProcessGetUserInfo);
}

const funcProcessGetUserInfo = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Пользователь:", respobj);

    let name    = respobj.answ[0].name;
    alert(`${name}, добро пожаловать на платформу TW! Вы успешно авторизованы!`)
    window.location = 'tasks.html';
}

const applicantForm = document.getElementById('logon');
applicantForm.addEventListener('submit', handleFormSubmit);