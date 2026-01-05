import {funcCommand, funcProcessOnlyInfo, formatDate, funcProcessOnlyConsole} from '../../../js/common/common.js';
import {dragElement, resizeModalWindow, openModal, updateOverlay} from '../modal.js';

let chat_task_modal         = document.getElementById("modal_chat_task");
let modal_resize            = document.getElementById("modal_chat_task_resize");
let chat_task_title         = document.getElementById("modal_chat_task_title");
let chat_task_close         = document.getElementById("close_chat_task");
let chat_task_msgs          = document.getElementById("chat_task_messages");
let chat_task_scroll        = document.getElementById("chat_task_scroll");
let chat_task_badge         = document.getElementById("chat_task_badge");
let chat_task_input         = document.getElementById("chat_task_input");
let chat_task_send_button   = document.getElementById("chat_task_send_button");
let chat_task_change_button = document.getElementById("chat_task_change_button");
let chat_task_cont_m        = document.getElementById("context_menu_chat_task");
let chat_task_cont_m_change = document.getElementById("context_menu_chat_task_change");
let chat_task_cont_m_del    = document.getElementById("context_menu_chat_task_delete");
let chat_task_cont_m_read   = document.getElementById("context_menu_chat_task_read");
let chat_task_cont_m_users  = document.getElementById("context_menu_chat_task_users");
let timerId;
let newMessagesCount = 0;
let hasSentRequest = false;

chat_task_close.onclick = () => {
    chat_task_modal.style.display = "none";
    chat_task_input.value = '';
    chat_task_input.style.height = '37px';

    clearInterval(timerId);
    updateOverlay();
}

chat_task_close.ontouchend = (e) => {
    e.preventDefault();
    chat_task_modal.style.display = "none";
    chat_task_input.value = '';
    chat_task_input.style.height = '37px';

    clearInterval(timerId);
    updateOverlay();
}

dragElement(chat_task_modal);
resizeModalWindow(modal_resize, "whchattask", "Размеры окна чата");

/* настройка размера окна */
const funcGetResize = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whchattask", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResize)
}

const funcProcessGetResize = (result, respobj) => {
    modal_resize.style.width  = `${respobj.answ.val[0]}px`;
    modal_resize.style.height = `${respobj.answ.val[1]}px`;
}

/* открытие окна */
export const funcInfoChatTaskOpenModal = (uin) => {
    funcGetResize();
    openModal(chat_task_modal);

    chat_task_send_button.value = uin;

    funcGetInfoChatTask(uin, scrollToBottom);
    
    timerId = setInterval(() => {
        funcGetInfoChatTask(uin);
    }, 1500)
}

/* запрос сообщений */
const funcGetInfoChatTask = (uin, onComplete) => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"chattask", "uintask":`${uin}`, "count":"1000", "sort":"date"};
    funcCommand(body, (result, respobj) => {
        funcProcessGetInfoChatTask(result, respobj);
        if (result && onComplete) {
            onComplete();
        }
    })
}

const funcProcessGetInfoChatTask = (result, respobj) => {
    console.log("Чат:", respobj);
    onNewMessageAdded();

    chat_task_msgs.innerHTML = '';

    newMessagesCount = respobj.answDop.noread;
    chat_task_title.innerHTML = respobj.answDop.nametask;
    for (let key in respobj.answ){
        let obj        = respobj.answ[key];
        let name       = obj.name;
        let date       = obj.date;
        let change     = obj.change;
        let read       = obj.read;
        let whoreadcnt = obj.whoreadcnt;
        let whoreadusr = obj.whoreadusr;
        let nameUser   = obj.user.name;
        let uinUser    = obj.user.uin;
        let uin        = obj.uin;
        let del        = obj.del;
        addMsgs(name, date, change, read, whoreadcnt, whoreadusr, nameUser, uinUser, uin, del);
    }
}

const addMsgs = (name, date, change, read, whoreadcnt, whoreadusr, nameUser, uinUser, uin, del) => {
    let msg_container = document.createElement('div');
    if(uinUser == localStorage.getItem('user_uin')){
        msg_container.classList = 'chat-task__message right';
        msg_container.addEventListener('contextmenu', (elem) => { elem.preventDefault(); showContextMenu(elem, uin, name, whoreadusr); })
        msg_container.innerHTML = craeteMsgRight(nameUser, name, date, whoreadcnt, change);
    } else {
        msg_container.classList = 'chat-task__message left';
        msg_container.innerHTML = craeteMsgLeft(nameUser, name, date, change);
    }
    chat_task_msgs.append(msg_container);
}

const craeteMsgRight = (nameUser, name, date, whoreadcnt, change) => {
    return `
        <div class="chat-task__username">${nameUser}</div>
            <div class="chat-task__text">
                ${name}
            </div>
        <div class="chat-task__time">${formatDate(date)} ${whoreadcnt > 0 ? '<img class="chat-task__check" src="assets/images/check.svg" alt="" title="Прочитано">' : '<img class="chat-task__check" src="assets/images/no-check.svg" alt="" title="Не прочитано">'}</div>
        ${change == 1 ? '<div class="chat-task__time">Изменено</div>' : ''}
    `
}

const craeteMsgLeft = (nameUser, name, date, change) => {
    return `
        <div class="chat-task__username">${nameUser}</div>
            <div class="chat-task__text">
                ${name}
            </div>
        <div class="chat-task__time">${formatDate(date)}</div>
        ${change == 1 ? '<div class="chat-task__time">Изменено</div>' : ''}
    `
}

/* добавление сообщения */
chat_task_send_button.addEventListener('click', (elem) => {
    if(!document.URL.includes('#tasksArch')){
        let uintask = elem.currentTarget.value
        let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"chattask", "uinuser":`${localStorage.getItem('user_uin')}`, "uintask":`${uintask}`, "name":""};

        if(chat_task_input.value != ''){
            body.name = chat_task_input.value;
            funcCommand(body, funcProcessOnlyInfo, () => {
                funcGetInfoChatTask(uintask, scrollToBottom);
            })
            
            chat_task_input.value = '';
            chat_task_input.style.height = '37px'; // сброс высоты
        }
    }
})

/* контекстное меню */
const showContextMenu = (elem, uin, text, arrUsers) => {
    chat_task_cont_m.style.display = 'block';
    chat_task_cont_m.style.left    = `${elem.pageX}px`;
    chat_task_cont_m.style.top     = `${elem.pageY}px`;

    chat_task_cont_m_change.onclick = () => {
        chat_task_change_button.classList.remove("modal__input-wrapper_display-none");
        chat_task_send_button.classList.add("modal__input-wrapper_display-none");
        chat_task_input.value = text;
        chat_task_input.focus();

        chat_task_cont_m.style.display = 'none';
    }

    /* удаление */
    chat_task_cont_m_del.onclick = () => {
        let result = confirm("Вы уверены, что ходите удалить это сообщение?");
        if(result){
            let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"fulldel", "obj":"chattask", "uinuser":`${localStorage.getItem('user_uin')}`, "uin":`${uin}`};
            funcCommand(body, funcProcessOnlyInfo);
        }
        chat_task_cont_m.style.display = 'none';
    }

    /* обновление */
    chat_task_change_button.onclick = () => {
        let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"chattask", "uinuser":`${localStorage.getItem('user_uin')}`, "uin":`${uin}`, "name":`${chat_task_input.value}`};
        funcCommand(body, funcProcessOnlyInfo);

        chat_task_change_button.classList.add("modal__input-wrapper_display-none");
        chat_task_send_button.classList.remove("modal__input-wrapper_display-none");
        chat_task_input.value = '';
    }

    chat_task_cont_m_users.innerHTML = '';
    arrUsers.forEach(userName => {
        const li = document.createElement('li');
        li.textContent = userName;
        chat_task_cont_m_users.appendChild(li);
    })

    chat_task_cont_m_read.addEventListener('mouseenter', () => {
        chat_task_cont_m_users.style.opacity = 1;
        chat_task_cont_m_users.style.visibility = 'visible';
    })

    chat_task_cont_m_read.addEventListener('mouseleave', () => {
        chat_task_cont_m_users.style.opacity = 0;
        chat_task_cont_m_users.style.visibility = 'hidden';
    })

    chat_task_cont_m_users.addEventListener('mouseleave', () => {
        chat_task_cont_m_users.style.opacity = 0;
        chat_task_cont_m_users.style.visibility = 'hidden';
    })
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.chat-task__message.right') === null) {
        chat_task_cont_m.style.display = 'none';
    }
})

chat_task_input.addEventListener('input', (elem) => {
    elem.target.style.height = 'auto';
    elem.target.style.height = (elem.target.scrollHeight) + 'px';
})

/* скролл */
const isScrolledToBottom = () => {
    const tolerance = 5;
    return chat_task_msgs.scrollHeight - chat_task_msgs.clientHeight - chat_task_msgs.scrollTop <= tolerance;
}

const updateScrollButton = () => {
    const atBottom = isScrolledToBottom();
    const shouldShow = !atBottom;

    if (shouldShow) {
        chat_task_scroll.style.opacity = '1';
        chat_task_scroll.style.transform = 'scale(1)';
        hasSentRequest = false;
    } else {
        chat_task_scroll.style.opacity = '0';
        chat_task_scroll.style.transform = 'scale(0.9)';

        if (newMessagesCount > 0) {
            newMessagesCount = 0;
            chat_task_badge.style.opacity = '0';
        }

        if (!hasSentRequest) {
            hasSentRequest = true;
            let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"read", "obj":"chattask", "uinuser":`${localStorage.getItem('user_uin')}`, "uintask":`${chat_task_send_button.value}`};
            funcCommand(body, funcProcessOnlyConsole);
            setTimeout(() => {funcGetInfoChatTask(chat_task_send_button.value)}, 100);
        }
    }
}

const scrollToBottom = () => {
    setTimeout(() => {
        chat_task_msgs.scrollTop = chat_task_msgs.scrollHeight;
        console.log("~~~ Scrolled to bottom");
    }, 0)
}

chat_task_msgs.addEventListener('scroll', updateScrollButton);

chat_task_scroll.addEventListener('click', () => {
    scrollToBottom();
    updateScrollButton();
})

const onNewMessageAdded = () => {
    if (!isScrolledToBottom()) {
        chat_task_badge.innerHTML = newMessagesCount;
        chat_task_badge.style.opacity = '1';
    } else {
        scrollToBottom();
    }
    updateScrollButton();
}

