export enum Loglevel {
    Error = "error",

    Warn = "warn",

    Info = "info",

    Debug = "debug",

    Http = "http",

    Verbose = "verbose",

    Silly = "silly"


}

const allLogLevels: string[] = [
    Loglevel.Debug,
    Loglevel.Error,
    Loglevel.Http,
    Loglevel.Info,
    Loglevel.Silly,
    Loglevel.Verbose,
    Loglevel.Warn
]

export function isLogLevel(value: unknown): value is Loglevel{
    if(typeof value !== "string"){return false}
    return allLogLevels.indexOf(value) !== -1;
}