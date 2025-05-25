export class DbError extends Error {
    constructor(message = "Unknown database error"){
        super(message)

    }

}

export class DbConfigError extends DbError {
    constructor(message = "Database configuration error"){
        super(message)
    }
}