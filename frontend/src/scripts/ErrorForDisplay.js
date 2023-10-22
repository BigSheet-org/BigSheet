class ErrorForDisplay extends Error {

    constructor(props, error_code, error_message) {
        super(props);
        this._error_code = error_code;
        this._error_message = error_message;
    }

    get error_message() {
        return this._error_message;
    }
    get error_code() {
        return this._error_code;
    }
}

export default ErrorForDisplay