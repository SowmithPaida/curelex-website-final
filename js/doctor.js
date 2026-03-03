// doctor.js
// JavaScript logic for doctor pages (signup/login)

// Example: simple form validation

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(event) {
            const password = form.querySelector('#password');
            const confirm = form.querySelector('#confirm_password');
            if (password && confirm && password.value !== confirm.value) {
                alert('Passwords do not match');
                event.preventDefault();
            }
        });
    }
});
