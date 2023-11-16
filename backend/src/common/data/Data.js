class Data {

    static ANSWERS = {
        DEFAULT: {
            DEFAULT_OK_ANSWER: { "message": "ok" }
        },
        ERRORS_401: {
            EXPIRED_TOKEN: { "message": "Token has expired."},
            INVALID_TOKEN: { "message": "Token is invalid."},
            INVALID_CREDENTIALS: { "message": "Invalid login or password"},
        },
        ERRORS_400: {
            MISSING_FIELDS: {"message": "Mandatory fields are missing."}
        }
    }

    static SERVER_COMPARISON_DATA = {
        TOKENS: {
            EXPIRED: "expired",
            INVALID: "invalid"
        }
    }
}

export default Data