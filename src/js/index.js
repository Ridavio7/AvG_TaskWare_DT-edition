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
import {showNotification} from '../blocks/modal/__notification/modal__notification.js';

let initcheckUser = false;

const handleFormSubmit = (event) => {
    event.preventDefault()
    let login = document.getElementById('logon_login').value;
    let pass = document.getElementById('logon_pass').value;
    
    let body  =  {"meth":"logon", "log": login, "psw": pass};
    funcCommand(body, funcGetToken);
}

const funcGetToken = (result, respobj) => {
    console.log(respobj)
    //responseProcessor(result, respobj.succ);
    showNotification('error', 'Ошибка!', 'Неверный логин и/или пароль');

    if(respobj.succ != 0){
        localStorage.setItem('srtf', respobj.srtf);
        localStorage.setItem('user_name', respobj.name);
        localStorage.setItem('user_uin', respobj.uinuser);
        localStorage.setItem('user_bm', JSON.stringify(respobj.bm));
        window.location = 'tasks.html';
    } else {
        document.getElementById('captchaBox').style.display = 'flex';
        document.getElementById('captchaInput').ariaRequired = true;
        document.getElementById('logon').removeEventListener('submit', handleFormSubmit);
        if(!initcheckUser){
            initcheckUser = true;
            checkUser();
        }
    }
}

document.getElementById('logon').addEventListener('submit', handleFormSubmit);

document.getElementById('logon_pass_toggle').addEventListener('click', (elem) => togglePassword(elem, 'logon_pass'));

const checkUser = () => {
    let startTime = Date.now();
    let answerHash = null;

    function sha256(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).substring(0, 8);
    }

    function generateObfuscatedCaptcha() {
        const ops = ['+', '-', '×'];
        const a = Math.floor(Math.random() * 15) + 5; // 5–19
        const b = Math.floor(Math.random() * 10) + 3; // 3–12
        const opIndex = Math.floor(Math.random() * 3);
        const op = ops[opIndex];

        let correct;
        if (op === '+') correct = a + b;
        else if (op === '-') correct = a - b;
        else if (op === '×') correct = a * b;

        answerHash = sha256(correct.toString());

        const expr = `${a} ${op} ${b}`;
        const visual = document.getElementById('captchaVisual');
        visual.innerHTML = '';

        for (let i = 0; i < expr.length; i++) {
            const char = expr[i];
            if (char === ' ') continue;

            const span = document.createElement('span');
            const r = (Math.random() - 0.5) * 40; // от -10 до +10 градусов
            span.style.setProperty('--r', r);
            span.textContent = char === '×' ? '×' : char;
            visual.appendChild(span);
        }

        startTime = Date.now();
    }

    function verifyAnswer(input) {
        const elapsed = Date.now() - startTime;

        if (elapsed < 800) { return { valid: false, reason: 'Слишком быстро! Вы бот?' } }

        if (elapsed > 120_000) { return { valid: false, reason: 'Время вышло. Обновите капчу.' } }

        if (sha256(input.trim()) === answerHash) {
            return { valid: true };
        } else {
            return { valid: false, reason: 'Неверный ответ.' };
        }
    }

    generateObfuscatedCaptcha();

    document.getElementById('logon').addEventListener('submit', function (e) {
        e.preventDefault();
        const input = document.getElementById('captchaInput').value;
        const msg = document.getElementById('captchaMessage');

        const result = verifyAnswer(input);
        if (result.valid) {
            //msg.textContent = 'Успешно!';
            //msg.style.color = '#039d2e';

            handleFormSubmit(e);

            generateObfuscatedCaptcha();
            document.getElementById('captchaInput').value = '';
            msg.textContent = '';
        } else {
            msg.textContent = `${result.reason}`;
            msg.style.color = '#ff6666';

            generateObfuscatedCaptcha();
            document.getElementById('captchaInput').value = '';
        }
    })
}