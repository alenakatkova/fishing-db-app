 CREATE TABLE IF NOT EXISTS fs_ts_boat(
      boat_passport TEXT NOT NULL PRIMARY KEY, 
      name TEXT NOT NULL UNIQUE, 
      weight INTEGER NOT NULL,
      power INTEGER NOT NULL,
      construction_date INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS fs_ts_team(
      team_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS fs_ts_fishing_spot(
      fishing_spot_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS fs_ts_worker(
      worker_id TEXT NOT NULL PRIMARY KEY,
      surname TEXT NOT NULL,
      first_name TEXT NOT NULL,
      patronym TEXT NOT NULL,
      birth_date INTEGER NOT NULL,
      phone_number TEXT NOT NULL UNIQUE,
      job TEXT NOT NULL,
      team_id INTEGER NOT NULL,
      FOREIGN KEY (team_id) 
      REFERENCES fs_ts_team(team_id)
    );

    CREATE TABLE IF NOT EXISTS fs_tt_trip(
      trip_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      start_date INTEGER NOT NULL,
      finish_date INTEGER,
      team_id INTEGER NOT NULL,
      boat_passport TEXT NOT NULL,
      FOREIGN KEY(team_id) REFERENCES fs_ts_team(team_id),
      FOREIGN KEY(boat_passport) REFERENCES fs_ts_boat(boat_passport)
    );

    CREATE TABLE IF NOT EXISTS fs_tt_fishing(
      fishing_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      start_date INTEGER NOT NULL,
      finish_date INTEGER NOT NULL,
      haul INTEGER NOT NULL,
      quality TEXT NOT NULL,
      fishing_spot_id INTEGER NOT NULL,
      trip_id INTEGER NOT NULL,
      FOREIGN KEY(fishing_spot_id) REFERENCES fs_ts_fishing_spot(fishing_spot_id),
      FOREIGN KEY(trip_id) REFERENCES fs_tt_trip(trip_id)
    );

    CREATE TABLE IF NOT EXISTS fs_tt_fishing_by_worker(
      fishing_by_worker_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
      fishing_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      start_date INTEGER NOT NULL,
      finish_date INTEGER NOT NULL,
      haul INTEGER NOT NULL,
      quality TEXT NOT NULL,
      fishing_spot_id INTEGER NOT NULL,
      trip_id INTEGER NOT NULL,
      FOREIGN KEY(fishing_spot_id) REFERENCES fs_ts_fishing_spot(fishing_spot_id),
      FOREIGN KEY(trip_id) REFERENCES fs_tt_trip(trip_id)
    );

    CREATE TABLE IF NOT EXISTS fs_tt_fishing_by_worker(
      worker_id TEXT NOT NULL PRIMARY KEY,
      start_date INTEGER NOT NULL,
      finish_date INTEGER NOT NULL,
      haul INTEGER NOT NULL,
      FOREIGN KEY(worker_id) REFERENCES fs_ts_worker(worker_id),
      FOREIGN KEY(start_date) REFERENCES fs_tt_fishing(start_datet),
      FOREIGN KEY(finish_date) REFERENCES fs_tt_fishing(finish_datet)
 );