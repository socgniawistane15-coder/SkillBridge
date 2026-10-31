/* COURSE CATALOGUE SEARCH AND FILTERS */

const searchForm = document.getElementById("courseSearchForm");
const searchInput = document.getElementById("courseSearch");
const categoryFilter = document.getElementById("categoryFilter");
const levelFilter = document.getElementById("levelFilter");
const clearButton = document.getElementById("clearFilters");
const courseGrid = document.getElementById("courseGrid");
const courseCount = document.getElementById("courseCount");
const noCourses = document.getElementById("noCourses");

if (
    searchForm &&
    searchInput &&
    categoryFilter &&
    levelFilter &&
    courseGrid
) {
    const cards = courseGrid.querySelectorAll(".catalogue-card");

    function filterCourses() {
        const searchText = searchInput.value.trim().toLowerCase();

        // Treat options such as "All Categories" as "all".
        const selectedCategory =
            categoryFilter.value.toLowerCase().includes("all")
                ? "all"
                : categoryFilter.value.trim().toLowerCase();

        const selectedLevel =
            levelFilter.value.toLowerCase().includes("all")
                ? "all"
                : levelFilter.value.trim().toLowerCase();

        let visible = 0;

        cards.forEach(function (card) {
            const name =
                card.querySelector("h3")?.textContent.toLowerCase() || "";

            const description =
                card.querySelector(".course-body p")?.textContent.toLowerCase() || "";

            const keywords =
                (card.dataset.search || "").toLowerCase();

            const category =
                (card.dataset.category || "").toLowerCase();

            const level =
                (card.dataset.level || "").toLowerCase();

            const matchesSearch =
                name.includes(searchText) ||
                description.includes(searchText) ||
                keywords.includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            const matchesLevel =
                selectedLevel === "all" ||
                level === selectedLevel;

            const show =
                matchesSearch && matchesCategory && matchesLevel;

            card.hidden = !show;

            if (show) {
                visible++;
            }
        });

        if (courseCount) {
            courseCount.textContent =
                visible + (visible === 1 ? " course found" : " courses found");
        }

        if (noCourses) {
            noCourses.hidden = visible !== 0;
        }
    }

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        filterCourses();
    });

    searchInput.addEventListener("input", filterCourses);
    categoryFilter.addEventListener("change", filterCourses);
    levelFilter.addEventListener("change", filterCourses);

    if (clearButton) {
        clearButton.addEventListener("click", function () {
            searchInput.value = "";
            categoryFilter.selectedIndex = 0;
            levelFilter.selectedIndex = 0;
            filterCourses();
        });
    }

    filterCourses();
}

/* SKILLBRIDGE LOGIN DEMO */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");
        const message = document.getElementById("loginMessage");

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        // Demo account for testing only
        const demoEmail = "learner@skillbridge.test";
        const demoPassword = "Learn123!";

        if (email === "" || password === "") {
            message.textContent = "Please enter your email and password.";
            message.style.color = "#c0392b";
            return;
        }

        if (email !== demoEmail || password !== demoPassword) {
            message.textContent =
                "Demo login failed. Check the demo account details.";
            message.style.color = "#c0392b";
            return;
        }

        // Keep the demo session for this browser tab
        sessionStorage.setItem("skillbridgeLoggedIn", "true");
        sessionStorage.setItem("skillbridgeLearnerName", "Learner");

        // Open the learner dashboard
        window.location.href = "learner-dashboard.html";
    });
}

