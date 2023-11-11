class Data {
    static PROGRAM_VALUES = {
        timeout: 6000,                  // Timeout for requests in ms.
        phone_separation_char: '.',     // Character used to make phone number separators.
    }

    static COMPARISON_DATA = {
        ERROR_INVALID_CREDENTIALS: "L'identifiant ou le mot de passe est incorrect.",
    }

    // Qualifiers for the Input component.
    static INPUT_TYPES = {
        phone_number: "phone_number",
        mail: "email",
        checkbox: "checkbox",
        password: "password",
        textarea: "textarea",
        text: "text",
    }
}

export default Data