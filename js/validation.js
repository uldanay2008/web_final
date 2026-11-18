/* Shared explicit JavaScript validation; browser constraint validation is not used. */
'use strict';
window.WinxValidation = {
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    password: value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value),
    phone: value => /^\+?[\d\s()-]+$/.test(value) && value.replace(/\D/g, '').length >= 7 && value.replace(/\D/g, '').length <= 15,
    setError(input, message) {
        input.setAttribute('aria-invalid', String(Boolean(message)));
        const error = document.getElementById(input.id + '-error');
        if (error) error.textContent = message;
    },
    validateFields(form, ids) {
        let firstInvalid = null;
        ids.forEach(id => {
            const input = form.querySelector('#' + id);
            if (!input) return;
            const value = input.value.trim();
            let message = '';
            const optionalPhone = id === 'phone' && !form.querySelector('#byPhone')?.checked;
            if (!value && !(optionalPhone && id === 'phone')) message = 'This field is required.';
            else if (id === 'email' && !this.email(value)) message = 'Enter a valid email address.';
            else if (id === 'password' && !this.password(input.value)) message = 'Use 8+ characters with uppercase, lowercase, a number and a symbol.';
            else if (id === 'confirm-password' && input.value !== form.querySelector('#password').value) message = 'Passwords do not match.';
            else if (id === 'phone' && value && !this.phone(value)) message = 'Enter a valid phone number with 7–15 digits.';
            this.setError(input, message);
            if (message && !firstInvalid) firstInvalid = input;
        });
        return firstInvalid;
    }
};
