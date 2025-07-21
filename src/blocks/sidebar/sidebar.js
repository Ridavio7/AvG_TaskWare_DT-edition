let expand_btn = document.querySelector(".sidebar__expand-button");
expand_btn.addEventListener("click", () => {
    document.body.classList.toggle("collapsed");
});

const setSidebarEvents = (elem, tabcontent_name, tablinks_name, tablinks_active_name) => {
    elem.addEventListener("click", () => {
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName(tabcontent_name);
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName(tablinks_name);
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(` ${tablinks_active_name}`, "");
        }
        document.getElementById(elem.classList[1]).style.display = "flex";
        document.getElementById(elem.classList[1]).style.flexDirection = "column";
        elem.className += ` ${tablinks_active_name}`;

        if(!document.URL.includes("tasks.html")){
            localStorage.setItem("sidebar_tab_active", elem.id);
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
}, 600)