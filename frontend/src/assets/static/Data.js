class Data {
    static PROGRAM_VALUES = {
        TIMEOUT_BEFORE_REQUEST_FAILURE: 6000,                  // Timeout for requests in ms.
        TIMEOUT_BEFORE_REDIRECT: 2000,  // Timeout for redirections in ms.
        PHONE_SEPARATION_CHAR: '.',     // Character used to make phone number separators.
    }

    static COMPARISON_DATA = {
        ERROR_INVALID_CREDENTIALS: "L'identifiant ou le mot de passe est incorrect.",
    }

    // Qualifiers for the Input component.
    static INPUT_TYPES = {
        PHONE_NUMBER: "phone_number",
        MAIL: "email",
        CHECKBOX: "checkbox",
        PASSWORD: "password",
        TEXTAREA: "textarea",
        TEXT: "text",
    }
}

export default Data