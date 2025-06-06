import {useEffect} from "react";

useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector("#btn");
    const searchBtn = document.querySelector(".bx-search");

    const toggleSidebar = () => {
        sidebar.classList.toggle("open");
        menuBtnChange();
    };

    const menuBtnChange = () => {
        if (sidebar.classList.contains("open")) {
            closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
        } else {
            closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
        }
    };

    if (closeBtn && searchBtn) {
        closeBtn.addEventListener("click", toggleSidebar);
        searchBtn.addEventListener("click", toggleSidebar);
    }

    // Nettoyage (important pour React)
    return () => {
        if (closeBtn && searchBtn) {
            closeBtn.removeEventListener("click", toggleSidebar);
            searchBtn.removeEventListener("click", toggleSidebar);
        }
    };
}, []);
