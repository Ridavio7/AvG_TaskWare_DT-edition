let expand_btn = document.querySelector(".sidebar__expand-button");
expand_btn.addEventListener("click", () => {
    document.body.classList.toggle("collapsed");
});

/* sidebar первые кнопки */
let sidebar_links = document.querySelectorAll(".sidebar__link");
sidebar_links.forEach((elem) => {
    elem.addEventListener("click", () => {
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("sidebar__tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("sidebar__link");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" sidebar__link_active", "");
        }
        document.getElementById(elem.classList[1]).style.display = "flex";
        document.getElementById(elem.classList[1]).style.flexDirection = "column";
        elem.className += " sidebar__link_active";

        if(!document.URL.includes("tasks.html")){
            localStorage.setItem("sidebar_tab_active", elem.id);
        }
    });
});