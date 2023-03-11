import * as SQLite from "expo-sqlite";
class ToDoRepository {
  db: SQLite.WebSQLDatabase | any;
  constructor() {
    this.db = this.openDatabase();
  }

  openDatabase = () => {
    const db = SQLite.openDatabase("dbnew.db");
    return db;
  };
  createTable = () => {
    this.db.transaction((tx: SQLite.SQLTransaction) => {
        tx.executeSql(
          "create table if not exists items (id integer primary key not null, done int, value text, date text);"
        );
      });
  }

  insertItem = (text: string, date: string, calbackFn: void) => {
    this.db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql("insert into items (done, value, date) values (0, ?, ?)", [text, date]);
          tx.executeSql("select * from items", [], (_, { rows }) =>
            console.log(JSON.stringify(rows))
          );
        },
        null,
        calbackFn
      );
  }
  updateById = (id: number, func: void) => {
    this.db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(`update items set done = 1 where id = ?;`, [
            id,
          ]);
        },
        null,
        func
      )
  }
  deleteById = (id: number, func: void) => {
    this.db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(`delete from items where id = ?;`, [id]);
        },
        null,
        func
      )
  }
  selectItems = (doneHeading: any, func: any) => {
    this.db.transaction((tx: SQLite.SQLTransaction) => {
        tx.executeSql(
          `select * from items where done = ?;`,
          [doneHeading ? 1 : 0],
          (_, { rows: { _array } }) => func(_array)
        );
      });
  }
}

export default ToDoRepository
