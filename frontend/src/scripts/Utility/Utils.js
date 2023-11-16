class Utils {

    /**
     * This method checks if the mail provided is valid or not.
     *
     * @param mail Mail to check/
     * @returns {boolean} If the mail is valid or not.
     */
    static validateEmail(mail) {
        // REGEX to validate mail.
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(mail);
    }

    /**
     * This method checks if the password provided is secure enough.
     * It must have :
     *  - At least 8 chars
     *  - At least 1 digit
     *  - At least 1 capital letter
     *  - At least 1 small letter
     *
     * @param password Password to check.
     * @returns {boolean} If the password is valid or not.
     */
    static validatePassword(password) {
        // REGEX to validate password.
        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
        return passwordRegex.test(password);
    }
}

export default Utils