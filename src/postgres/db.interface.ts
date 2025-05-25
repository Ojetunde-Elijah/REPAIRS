
export interface DbConfig {
    entities: Function[] | string[];
    synchronize?: boolean;
    logging?: boolean;
    ssl?: boolean;
}