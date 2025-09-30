let expand_btn = document.querySelector(".sidebar__expand-button");
expand_btn.addEventListener("click", () => {
    document.body.classList.toggle("collapsed");
});

const setSidebarEvents = (elem, tabcontent_name, tablinks_name, tablinks_active_name) => {
    elem.addEventListener("click", () => {
        let i, tabcontent, tablinks;
        /* скрываем все контенты */
        tabcontent = document.getElementsByClassName(tabcontent_name);
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        /* убираем активный класс со всех кнопок sidebar и добавляем к нажатой */
        tablinks = document.getElementsByClassName(tablinks_name);
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(` ${tablinks_active_name}`, "");
        }
        elem.className += ` ${tablinks_active_name}`;

        /* находим контент и отображаем его */
        let content = document.getElementById(elem.classList[1]);
        content.style.display = "flex";
        content.style.flexDirection = "column";
        
        if(!document.URL.includes("tasks.html")){
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
        } else {
            localStorage.setItem("sidebar_task_tab_active", elem.id);
        }
    })
}

/* sidebar кнопки */
let sidebar_links = document.querySelectorAll(".sidebar__link");
sidebar_links.forEach((elem) => {
    setSidebarEvents(elem, "sidebar__tabcontent", "sidebar__link", "sidebar__link_active");
})

/* sidebar кнопки задач */
setTimeout(() => {
    let sidebar_links = document.querySelectorAll(".sidebar__link_task");
    sidebar_links.forEach((elem) => {
        setSidebarEvents(elem, "sidebar__tabcontent", "sidebar__link_task", "sidebar__link_active");
    })
}, 800)