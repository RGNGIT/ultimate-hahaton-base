export enum Commands {
    // pg_start_backup = "SELECT pg_start_backup()",
    // pg_stop_backup = "SELECT pg_stop_backup()",
    pg_reload_conf = "pg_reload_conf",
    pg_rotate_logfile = "pg_rotate_logfile",
    pg_last_xact_replay_timestamp = "pg_last_xact_replay_timestamp", //Получает отметку времени последней транзакции, воспроизведённой при восстановлении. 
}