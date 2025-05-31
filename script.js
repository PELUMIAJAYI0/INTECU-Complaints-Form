// card_issue_script.js
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
    const submissionStatusDiv = document.getElementById('formSubmissionStatus');
    const submitButton = form.querySelector('.form-submit-btn');
    const submitButtonText = submitButton.querySelector('.btn-text');
    const submitButtonLoader = submitButton.querySelector('.btn-loader');

    // --- Theme Toggle ---
    const currentTheme = localStorage.getItem('formPageTheme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        if (themeToggle) themeToggle.checked = true;
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false); // Default to dark mode visual
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

    // --- Dynamic Form Fields Logic ---
    if (readablePartSelect) {
        readablePartSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            
            // Hide all conditional groups first
            visibleUsernameGroup.style.display = 'none';
            visiblePasswordGroup.style.display = 'none';
            otherIssueDescriptionGroup.style.display = 'none';
            visibleCredentialsSection.style.display = 'none';

            // Make inputs non-required by default when hidden
            visibleUsernameInput.required = false;
            visiblePasswordInput.required = false;
            otherIssueDescriptionTextarea.required = false;


            if (selectedValue === 'username_unreadable') {
                visiblePasswordGroup.style.display = 'block';
                visibleCredentialsSection.style.display = 'block'; // Show the whole section
                // visiblePasswordInput.required = true; // Optional: make it required
            } else if (selectedValue === 'password_unreadable') {
                visibleUsernameGroup.style.display = 'block';
                visibleCredentialsSection.style.display = 'block'; // Show the whole section
                // visibleUsernameInput.required = true; // Optional: make it required
            } else if (selectedValue === 'both_unreadable') {
                // No extra fields needed, but keep credentials section hidden or show it empty
                visibleCredentialsSection.style.display = 'none'; 
            } else if (selectedValue === 'other_issue') {
                otherIssueDescriptionGroup.style.display = 'block';
                otherIssueDescriptionTextarea.required = true; // "Other" description is required if selected
            }
        });
    }

    // --- Form Submission ---
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual browser submission
            
            // Show loader, hide text
            submitButtonText.classList.add('hidden');
            submitButtonLoader.style.display = 'inline-block';
            submitButton.disabled = true;

            submissionStatusDiv.style.display = 'none'; // Hide previous status
            submissionStatusDiv.className = 'form-status-message'; // Reset classes


            // Simulate API call / backend processing
            setTimeout(() => {
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => { data[key] = value; });

                console.log('Form Data Submitted:', data);

                // Hide loader, show text
                submitButtonText.classList.remove('hidden');
                submitButtonLoader.style.display = 'none';
                submitButton.disabled = false;

                // Display success message (for demo)
                submissionStatusDiv.textContent = 'Report submitted successfully! INTECU will review your request.';
                submissionStatusDiv.classList.add('success');
                submissionStatusDiv.style.display = 'block';
                
                form.reset(); // Reset form fields
                // Manually trigger change on select to reset conditional fields visibility
                if(readablePartSelect) readablePartSelect.dispatchEvent(new Event('change')); 

            }, 2000); // Simulate 2 seconds delay
        });
    }

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});