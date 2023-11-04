export enum Commands {
    // pg_start_backup = "SELECT pg_start_backup()",
    // pg_stop_backup = "SELECT pg_stop_backup()",
    pg_reload_conf = "pg_reload_conf",
    pg_rotate_logfile = "pg_rotate_logfile",
    pg_export_snapshot = "pg_export_snapshot" //Сохраняет снимок текущего состояния и возвращает его идентификатор
}