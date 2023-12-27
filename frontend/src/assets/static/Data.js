class Data {

    static PROGRAM_VALUES = {
        TIMEOUT_BEFORE_REQUEST_FAILURE: 6000,                  // Timeout for requests in ms.
        TIMEOUT_BEFORE_REDIRECT: 1000,  // Timeout for redirections in ms.
        PHONE_SEPARATION_CHAR: '.',     // Character used to make phone number separators.
    };

    static COMPARISON_DATA = {
        ERROR_INVALID_CREDENTIALS: "L'identifiant ou le mot de passe est incorrect.",
    };

    // Qualifiers for the Input component.
    static INPUT_TYPES = {
        PHONE_NUMBER: "phone_number",
        MAIL: "email",
        CHECKBOX: "checkbox",
        PASSWORD: "password",
        TEXTAREA: "textarea",
        TEXT: "text",
    };

    static MESSAGES = {
        PASSWORD_DONT_MATCH: "Les mots de passe ne correspondent pas.",
        PASSWORD_NOT_SECURE: "Le mot de passe doit contenir au moins 1 lettre minuscule, 1 lettre majuscule et 1 chiffre.",
        MANDATORY_FIELD: "Ce champ est obligatoire.",
        LOGIN_ALREADY_USED: "Cet identifiant n'est pas disponible.",
        MAIL_ALREADY_USED: "Cette adresse mail est déjà utilisée.",
        MAIL_INVALID: "Cette adresse mail n'est pas valide.",

        API_ANSWERS : {
            LOGIN_ALREADY_USED: "Provided login was already used.",
            MAIL_ALREADY_USED: "Provided mail was already used."
        },
    };

    static SOCKET_PROTOCOLS_QUALIFIERS = {
        AUTH_REQUIRED: 'authReq',
        AUTH_REFUSED : 'authFail',
        AUTH_SUCCESS : 'authOk',
        WRITE_CELL : 'writeCell',
        ALERT_NEW_CONNECTION : 'newConnect',
        ALERT_USER_DISCONNECT : 'userDisconnected',
        RESPONSE_SELECT_CELL : 'responseSelectCell',
        USER_SELECT_CELL : 'userSelectCell',
        LOAD_CELLS : 'loadCells',
        SELECT_CELL : 'selectCell',
    }
}

export default Data;