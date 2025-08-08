import {funcCommand, funcProcessOnlyInfo, formatDate} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';

let chat_task_modal      = document.getElementById("modal_chat_task");
let chat_task_close      = document.getElementById("close_chat_task");
let chat_task_msgs       = document.getElementById("chat_task_messages");
let chat_task_input      = document.getElementById("chat_task_input");
let chat_task_s_b        = document.getElementById("chat_task_send_button");
let chat_task_c_b        = document.getElementById("chat_task_change_button");
let chat_task_cont_m     = document.getElementById("context_menu_chat_task");
let chat_task_cont_m_ch  = document.getElementById("context_menu_chat_task_change");
let chat_task_cont_m_del = document.getElementById("context_menu_chat_task_delete");
let timerId;

chat_task_close.onclick = () => {
    chat_task_modal.style.display = "none";
    chat_task_input.value = '';
    chat_task_input.style.height = '37px';

    clearInterval(timerId);
}

chat_task_close.ontouchend = (e) => {
    e.preventDefault();
    chat_task_modal.style.display = "none";
    chat_task_input.value = '';
    chat_task_input.style.height = '37px';

    clearInterval(timerId);
}

dragElement(chat_task_modal);

// Аворазмер textarea
chat_task_input.addEventListener('input', (elem) => {
    elem.target.style.height = 'auto';
    elem.target.style.height = (elem.target.scrollHeight) + 'px';
})

chat_task_s_b.addEventListener('click', (elem) => {
    let uintask = elem.currentTarget.value
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"chattask", "uinuser":`${localStorage.getItem('user_uin')}`, "uintask":`${uintask}`, "name":""};

    if(chat_task_input.value != ''){
        body.name = chat_task_input.value;
        funcCommand(body, funcProcessOnlyInfo);

        setTimeout(() => {chat_task_input.value = ''; funcGetInfoChatTask(uintask)}, 100);
    }
})

export const funcInfoChatTaskOpenModal = (uin) => {
    chat_task_modal.style.display = "block";

    chat_task_s_b.value = uin;

    funcGetInfoChatTask(uin);

    timerId = setInterval(() => funcGetInfoChatTask(uin), 1000);
}

const funcGetInfoChatTask = (uin) => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"chattask", "uintask":`${uin}`, "count":"100", "sort":"date"};
    funcCommand(body, funcProcessGetInfoChatTask);
}

const funcProcessGetInfoChatTask = (result, respobj) => {
    console.log("Чат:", respobj);

    chat_task_msgs.innerHTML = '';

    for (let key in respobj.answ){
        let obj      = respobj.answ[key];
        let name     = obj.name;
        let date     = obj.date;
        let change   = obj.change;
        let nameUser = obj.user.name;
        let uinUser  = obj.user.uin;
        let uin      = obj.uin;
        let del      = obj.del;
        addMsgs(name, date, change, nameUser, uinUser, uin, del);
    }

    chat_task_msgs.scrollTop = chat_task_msgs.scrollHeight;
}

const addMsgs = (name, date, change, nameUser, uinUser, uin, del) => {
    let msg_container = document.createElement('div');
    if(uinUser == localStorage.getItem('user_uin')){
        msg_container
        msg_container.classList = 'chat-task__message right';
        msg_container.addEventListener('contextmenu', (elem) => { elem.preventDefault(); showContextMenu(elem, uin, name); })
    } else {
        msg_container.classList = 'chat-task__message left';
    }
    msg_container.innerHTML = craeteMsg(nameUser, name, date);

    chat_task_msgs.append(msg_container);
}

const craeteMsg = (nameUser, name, date) => {
    return `
        <div class="chat-task__username">${nameUser}</div>
            <div class="chat-task__text">
                ${name}
            </div>
        <div class="chat-task__time">${formatDate(date)}</div>
    `
}

const showContextMenu = (elem, uin, text) => {
    chat_task_cont_m.style.display = 'block';
    chat_task_cont_m.style.left    = `${elem.pageX}px`;
    chat_task_cont_m.style.top     = `${elem.pageY}px`;

    chat_task_cont_m_ch.onclick = () => {
        chat_task_c_b.classList.remove("modal__input-wrapper_display-none");
        chat_task_s_b.classList.add("modal__input-wrapper_display-none");
        chat_task_input.value = text;

        chat_task_cont_m.style.display = 'none';
    }

    chat_task_cont_m_del.onclick = () => {
        let result = confirm("Вы уверены, что ходите удалить это сообщение?");
        if(result){
            let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"fulldel", "obj":"chattask", "uinuser":`${localStorage.getItem('user_uin')}`, "uin":`${uin}`};
            funcCommand(body, funcProcessOnlyInfo);
        }
        
        setTimeout(function(){
            funcGetInfoChatTask(chat_task_s_b.value);
            chat_task_cont_m.style.display = 'none';
        }, 100);
    }

    chat_task_c_b.onclick = () => {
        let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"chattask", "uinuser":`${localStorage.getItem('user_uin')}`, "uin":`${uin}`, "name":""};
        body.name = chat_task_input.value;

        funcCommand(body, funcProcessOnlyInfo);

        setTimeout(function(){
            funcGetInfoChatTask(chat_task_s_b.value);
            chat_task_input.value = '';

            chat_task_c_b.classList.add("modal__input-wrapper_display-none");
            chat_task_s_b.classList.remove("modal__input-wrapper_display-none");
        }, 100);
    }
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.chat-task__message.right') === null) {
        chat_task_cont_m.style.display = 'none';
    }
})