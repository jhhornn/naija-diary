class CustomAPIError extends Error {
    constructor(message) {
        super(message)
    }
}

modules.exports = CustomAPIError