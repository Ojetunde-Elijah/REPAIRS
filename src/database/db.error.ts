export class DbError extends Error{
    public constructor(message = "Unknown database error"){
        super(message)
    }
}

export class DbConnectionError extends DbError{
    public constructor(message = "Database connection error"){
        super(message)
    }
}
