export const setSidebarEvents = (elem, tabcontent_name, tablinks_name, tablinks_active_name) => {
    elem.addEventListener("click", () => {
        let i, tabcontent, tablinks;
        /* скрываем все контенты */
        tabcontent = document.getElementsByClassName(tabcontent_name);
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove('sidebar__tabcontent_active');
            tabcontent[i].classList.remove('sidebar__tabcontent_task-active');
        }

        /* убираем активный класс со всех кнопок sidebar и добавляем к нажатой */
        tablinks = document.getElementsByClassName(tablinks_name);
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(` ${tablinks_active_name}`, "");
        }
        elem.className += ` ${tablinks_active_name}`;

        //content.style.display = "flex";
        //content.style.flexDirection = "column";
        
        if(document.URL.includes("tasks.html")){
            /* находим контент и отображаем его */
            let content = document.getElementById(elem.classList[1]);
            content.classList.add('sidebar__tabcontent_task-active');

            document.querySelector('.user-tasks-content__container').style.display = 'block';

            localStorage.setItem("sidebar_task_tab_active", elem.id);
            updateCloseButtonVisibility();
        } else if(document.URL.includes("tasks_test.html")) {
            /* находим контент и отображаем его */
            let content = document.getElementById(elem.classList[1]);
            content.classList.add('sidebar__tabcontent_task-active');

            localStorage.setItem("sidebar_task_tab_active", elem.id);
            updateCloseButtonVisibility();
        } else {
            /* находим контент и отображаем его */
            let content = document.getElementById(elem.classList[1]);
            content.classList.add('sidebar__tabcontent_active');

            setTimeout(() => {
                let tabs = content.querySelector('.sidebar__tabcontent__first-tabs');
                if(tabs){
                    let first_href = tabs.firstChild.nodeName === '#text' ? tabs.firstChild.nextSibling : tabs.firstChild;
                    let first_button = first_href.firstChild;
                    document.querySelector(`a[href="${first_href.hash}"]`).click();
                    first_button.click();
                    //localStorage.setItem("tabcontent_tab_active", first_button.classList[1]);
                }
            }, 100)

            localStorage.setItem("sidebar_tab_active", elem.id);
        }
    })
}

/* sidebar кнопки */
let sidebar_links = document.querySelectorAll(".sidebar__link");
sidebar_links.forEach((elem) => {
    setSidebarEvents(elem, "sidebar__tabcontent", "sidebar__link", "sidebar__link_active");
})

let expand_btn = document.querySelector(".sidebar__expand-button");
if(expand_btn != null){
    expand_btn.addEventListener("click", () => {
        document.body.classList.toggle("collapsed");
    })
}

export const updateCloseButtonVisibility = () => {
    const hasActiveTask = document.querySelector('.sidebar__tabcontent_task-active');

    if(window.innerWidth <= 1024){
        if(hasActiveTask != null){
            hasActiveTask.querySelector('.button__control_tabcontent-close').parentElement.style.display = 'flex';
            document.querySelector('.container').classList.remove('container_no-scroll');
        } else {
            //hasActiveTask.querySelector('.button__control_tabcontent-close').parentElement.style.display = 'none';
            document.querySelector('.container').classList.add('container_no-scroll');
        }
    } else {
        hasActiveTask.querySelector('.button__control_tabcontent-close').parentElement.style.display = 'none';
        document.querySelector('.container').classList.add('container_no-scroll');
    }
}