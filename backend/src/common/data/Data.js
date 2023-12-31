class Data {

    static ANSWERS = {
        DEFAULT: {
            DEFAULT_OK_ANSWER: { "message": "ok" }
        },
        ERRORS_401: {
            EXPIRED_TOKEN: { "message": "Token has expired." },
            INVALID_TOKEN: { "message": "Token is invalid." },
            INVALID_CREDENTIALS: { "message": "Invalid login or password" },
            INSUFFICIENT_PERMS: { "message": "You don't have the permission to do this operation." }
        },
        ERRORS_400: {
            MISSING_FIELDS: {"message": "Mandatory fields are missing."},
            NO_FIELDS: {"message": "No fields were provided."},
            PASSWORD_DONT_MATCH: {"message": "Passwords do not match."},
            LOGIN_ALREADY_USED: {"message": "Provided login was already used."},
            MAIL_ALREADY_USED: {"message": "Provided mail was already used."},
            ACCESS_SHEET_INVALID: {"message": "This type of access does not exist."}
        },
        ERRORS_404: {
            NOT_EXIST: {"message": "The requested resource does not exist."}
        }
    }

    static SERVER_COMPARISON_DATA = {
        TOKENS: {
            EXPIRED: "expired",
            INVALID: "invalid",
            BANNED: "banned",
            EXPIRED_JWT_ERROR: "TokenExpiredError: jwt expired",
            TYPES: {
                AUTH: "auth",
                REFRESH: "refresh"
            }
        },
        PERMISSIONS: {
            OWNER: "owner",
            READ: "reader",
            WRITE: "writer"
        }
    }

    static SAVE_AFTER_MODIFICATION_COUNT = 50;
}

export default Data