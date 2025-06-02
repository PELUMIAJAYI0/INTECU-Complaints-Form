// card_issue_script.js (or whatever you named your standalone form's JS)
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('form-toggle-theme');
    const body = document.body;
    const form = document.getElementById('cardIssueForm');
    const readablePartSelect = document.getElementById('readablePart');
    const visibleUsernameGroup = document.getElementById('visibleUsernameGroup');
    const visiblePasswordGroup = document.getElementById('visiblePasswordGroup');
    const visibleUsernameInput = document.getElementById('visibleUsername');
    const visiblePasswordInput = document.getElementById('visiblePassword');
    const otherIssueDescriptionGroup = document.getElementById('otherIssueDescriptionGroup');
    const otherIssueDescriptionTextarea = document.getElementById('otherIssueDescription');
    const visibleCredentialsSection = document.getElementById('visibleCredentialsSection');
    const bothUnreadableMessageDiv = document.getElementById('bothUnreadableMessage');
    const submitButton = form.querySelector('.form-submit-btn'); // Ensure this selector is correct for your button

    // --- Theme Toggle Logic ---
    const currentTheme = localStorage.getItem('formPageTheme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        if (themeToggle) themeToggle.checked = true;
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            body.classList.toggle('light-mode');
            let theme = 'dark';
            if (body.classList.contains('light-mode')) {
                theme = 'light';
            }
            localStorage.setItem('formPageTheme', theme);
            updateThemeIcon(body.classList.contains('light-mode'));
        });
    }

    function updateThemeIcon(isLightMode) {
        const label = document.querySelector('.theme-toggle-form-page label');
        if (label) {
            label.textContent = isLightMode ? '☀️' : '🌙';
        }
    }

    // --- Dynamic Form Fields Logic & Submit Button State ---
    if (readablePartSelect && submitButton) {
        readablePartSelect.addEventListener('change', function () {
            const selectedValue = this.value;

            // Hide all conditional groups and messages first
            visibleUsernameGroup.style.display = 'none';
            visiblePasswordGroup.style.display = 'none';
            otherIssueDescriptionGroup.style.display = 'none';
            visibleCredentialsSection.style.display = 'none';
            if (bothUnreadableMessageDiv) bothUnreadableMessageDiv.style.display = 'none';

            // Make inputs non-required by default when hidden
            if(visibleUsernameInput) visibleUsernameInput.required = false;
            if(visiblePasswordInput) visiblePasswordInput.required = false;
            if(otherIssueDescriptionTextarea) otherIssueDescriptionTextarea.required = false;
            
            submitButton.disabled = false; // Enable submit button by default

            if (selectedValue === 'username_unreadable') {
                visiblePasswordGroup.style.display = 'block';
                visibleCredentialsSection.style.display = 'block';
            } else if (selectedValue === 'password_unreadable') {
                visibleUsernameGroup.style.display = 'block';
                visibleCredentialsSection.style.display = 'block';
            } else if (selectedValue === 'both_unreadable_visit_intecu') {
                if (bothUnreadableMessageDiv) bothUnreadableMessageDiv.style.display = 'block';
                visibleCredentialsSection.style.display = 'none';
                submitButton.disabled = true; // Disable submit button
                console.log("Submit button disabled: 'Both unreadable' selected.");
            } else if (selectedValue === 'other_issue') {
                otherIssueDescriptionGroup.style.display = 'block';
                if(otherIssueDescriptionTextarea) otherIssueDescriptionTextarea.required = true;
            } else {
                // Default case or empty selection
                submitButton.disabled = false;
            }
        });
        // Trigger change on load to set initial state
        readablePartSelect.dispatchEvent(new Event('change'));
    } else {
        if (!readablePartSelect) console.error("readablePartSelect element not found");
        if (!submitButton) console.error("Submit button element not found");
    }

    // --- Form Submission Handling ---
    if (form) {
        form.addEventListener('submit', function (event) {
            // If "both_unreadable_visit_intecu" is selected, the button should be disabled.
            // This listener primarily handles cases where the form *could* be submitted.
            // Since the action is empty, default submission will just reload the page.
            if (readablePartSelect && readablePartSelect.value === 'both_unreadable_visit_intecu') {
                console.log("Form submission prevented: 'Both unreadable' is selected.");
                event.preventDefault(); // Explicitly prevent submission
                // The message is already visible due to the 'change' event logic.
                return;
            }

            // If you wanted to do something before a *valid* (non-"both") submission (if action was set):
            console.log('Form submit event triggered for a valid case (or empty action).');
            // Example: show a temporary "processing" message if you were to add AJAX back later
            // For now, with empty action, it will just attempt to submit to the current page.
            // If you want to prevent even that for valid cases, you'd add event.preventDefault() here too.
        });
    }

    // --- Set current year in footer ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});