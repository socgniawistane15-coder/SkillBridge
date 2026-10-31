document.addEventListener("DOMContentLoaded", function () {

    // 1. Display the current year in the footer
    const footer = document.querySelector(".dashboard-footer");

    if (footer) {
        footer.innerHTML = `
            <p>© ${new Date().getFullYear()} SkillBridge.
            Learn skills. Build projects. Grow your future.</p>
        `;
    }

    // 2. Make the sidebar links show which section is selected
    const navLinks = document.querySelectorAll(".dashboard-nav a");

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {

            navLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            this.classList.add("active");
        });
    });

    // 3. Show a message when a learner clicks Continue Learning
    const continueButton = document.querySelector(".welcome-banner .btn");

    if (continueButton) {
        continueButton.addEventListener("click", function (event) {
            event.preventDefault();

            document.querySelector("#progress").scrollIntoView({
                behavior: "smooth"
            });
        });
    }

});


document.addEventListener("DOMContentLoaded", function () {

    // Find every course card on the dashboard
    const courseCards = document.querySelectorAll(".learning-card");

    courseCards.forEach(function (card) {

        const button = card.querySelector(".lesson-complete-btn");
        const percentageText = card.querySelector(".progress-percent");
        const progressBar = card.querySelector(".progress-fill");

        // Skip a card if an expected element is missing
        if (!button || !percentageText || !progressBar) {
            return;
        }

        // Read the starting percentage from the HTML
        let progress = parseInt(percentageText.textContent, 10) || 0;

        button.addEventListener("click", function () {

            // Stop when the course reaches 100%
            if (progress >= 100) {
                return;
            }

            // Increase progress by 10%
            progress = Math.min(progress + 10, 100);

            // Update the displayed percentage
            percentageText.textContent = progress + "%";

            // Update the visual progress bar
            progressBar.style.width = progress + "%";

            // Update the button when the course is complete
            if (progress === 100) {
                button.textContent = "Course completed ✓";
                button.disabled = true;
            }
        });

    });

});



/* UPCOMING TASKS */

document.addEventListener("DOMContentLoaded", function () {

    const taskItems = document.querySelectorAll(
        "#assignments .task-item"
    );

    const taskCount = document.getElementById("taskCount");

    // Load previously completed tasks from this browser
    let completedTasks = {};

    try {
        completedTasks = JSON.parse(
            localStorage.getItem("skillBridgeCompletedTasks") || "{}"
        );
    } catch (error) {
        completedTasks = {};
    }

    // Update one task's appearance
    function updateTask(task, isCompleted) {
        const button = task.querySelector(".task-status");

        task.classList.toggle("is-completed", isCompleted);
        button.classList.toggle("completed", isCompleted);

        button.textContent = isCompleted
            ? "Completed ✓"
            : "Mark complete";

        button.disabled = isCompleted;
    }

    // Count how many tasks are still pending
    function updateTaskCount() {
        let remaining = 0;

        taskItems.forEach(function (task) {
            if (!completedTasks[task.dataset.taskId]) {
                remaining++;
            }
        });

        if (taskCount) {
            taskCount.textContent =
                remaining + (remaining === 1
                    ? " task remaining"
                    : " tasks remaining");
        }
    }

    taskItems.forEach(function (task) {
        const taskId = task.dataset.taskId;
        const button = task.querySelector(".task-status");

        // Restore the saved state
        updateTask(task, Boolean(completedTasks[taskId]));

        button.addEventListener("click", function () {

            if (completedTasks[taskId]) {
                return;
            }

            // Mark this task as completed
            completedTasks[taskId] = true;

            // Save the updated list in this browser
            try {
                localStorage.setItem(
                    "skillBridgeCompletedTasks",
                    JSON.stringify(completedTasks)
                );
            } catch (error) {
                // The task still updates for this page session
            }

            updateTask(task, true);
            updateTaskCount();
        });
    });

    updateTaskCount();

});

/* DISPLAY DEMO LEARNER NAME */

const learnerName = sessionStorage.getItem("skillbridgeLearnerName");

if (learnerName) {
    const profileName = document.querySelector(".learner-profile strong");
    const welcomeHeading = document.querySelector(".welcome-banner h1");
    const avatar = document.querySelector(".profile-avatar");

    if (profileName) {
        profileName.textContent = learnerName;
    }

    if (welcomeHeading) {
        welcomeHeading.textContent = "Welcome back, " + learnerName + "!";
    }

    if (avatar) {
        avatar.textContent = learnerName.charAt(0).toUpperCase();
    }
}


/* LOG OUT */

const logoutLink = document.getElementById("logoutLink");

if (logoutLink) {
    logoutLink.addEventListener("click", function () {
        sessionStorage.removeItem("skillbridgeLoggedIn");
        sessionStorage.removeItem("skillbridgeLearnerName");
    });
}



/* SKILLBRIDGE PROFILE */

document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById("profileForm");

    // Do nothing on pages that don't contain the profile form
    if (!profileForm) return;

    const nameInput = document.getElementById("profileName");
    const emailInput = document.getElementById("profileEmail");
    const goalInput = document.getElementById("profileGoal");
    const initial = document.getElementById("profileInitial");
    const message = document.getElementById("profileMessage");

    // Load saved profile details
    let profile = {};

    try {
        profile = JSON.parse(
            localStorage.getItem("skillBridgeProfile") || "{}"
        );
    } catch (error) {
        profile = {};
    }

    // Use the saved name, or the current demo name
    const savedName =
        profile.name ||
        sessionStorage.getItem("skillbridgeLearnerName") ||
        "";

    nameInput.value = savedName;
    emailInput.value = profile.email || "";
    goalInput.value = profile.goal || "";

    function updateProfileDisplay(name) {
        const cleanName = name.trim();

        initial.textContent = cleanName
            ? cleanName.charAt(0).toUpperCase()
            : "L";

        const sidebarName = document.querySelector(
            ".learner-profile strong"
        );

        const welcomeHeading = document.querySelector(
            ".welcome-banner h1"
        );

        if (sidebarName && cleanName) {
            sidebarName.textContent = cleanName;
        }

        if (welcomeHeading && cleanName) {
            welcomeHeading.textContent = "Welcome back, " + cleanName + "!";
        }
    }

    updateProfileDisplay(savedName);

    // Save profile details when the form is submitted
    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const goal = goalInput.value.trim();

        if (!name || !email) {
            message.textContent = "Please enter your name and email.";
            message.style.color = "#c0392b";
            return;
        }

        const updatedProfile = {
            name: name,
            email: email,
            goal: goal
        };

        try {
            localStorage.setItem(
                "skillBridgeProfile",
                JSON.stringify(updatedProfile)
            );
        } catch (error) {
            message.textContent =
                "Could not save your profile in this browser.";
            message.style.color = "#c0392b";
            return;
        }

        sessionStorage.setItem("skillbridgeLearnerName", name);

        updateProfileDisplay(name);

        message.textContent = "Profile saved successfully!";
        message.style.color = "#08784f";
    });
});
