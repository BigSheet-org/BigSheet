class SocketProtocols {

    #handlers

    /**
     * Constructor for socket protocols.
     */
    constructor() {
        this.#handlers = {};
    }

    addHandler(qualifier, method) { this.#handlers[qualifier] = method; }

    getHandler(qualifier) { return this.#handlers[qualifier]; }
}

export default SocketProtocols;