'use strict'

const sqlite3 = require('sqlite3').verbose();
const DB_STATUS_CLOSED = 0;
const DB_STATUS_OPEN = 1;
const DB_STATUS_ERROR = 2;
const bcrypt = require('bcrypt'); //to crypt passwords

/*
    SOCIALDATABASE
    The methods of this class manage the communication with the database,
    sending the string with the query and eventually returning back the results.
    A string containing the query is needed.
    Useful with complex queries.
*/

class SocialDatabase {
    // # means private
    #db; // database object sqlite
    #db_file_path; // database path
    #err; // eventual error
    #status; // connession status

    constructor(db_file_path) {
        this.#db_file_path = db_file_path;
        this.#status = DB_STATUS_CLOSED;
        this.#err = null;

        // create a Database object to manage the connession to the sqlite database
        this.#db = new sqlite3.Database(db_file_path, (err) => {
            if (err) {
                this.#err = err;
                this.#status = DB_STATUS_ERROR;
            }
            else {
                this.#err = null;
                this.#status = DB_STATUS_OPEN;
            }
        });
    }

    // close the sqlite database
    close() {
        this.#db.close((err) => {
            if (err) {
                this.#err = err;
                this.#status = DB_STATUS_ERROR;
            }
            else {
                this.#err = null;
                this.status = DB_STATUS_CLOSED;
            }
        });
        return this.#status;
    }

    // Getters

    getFilePath() {
        return this.#db_file_path;
    }

    getError() {
        return this.#err;
    }

    getStatus() {
        return this.#status;
    }

    //----------------------------------------------------------------------
    // UPDATE
    //----------------------------------------------------------------------
    
    // Executes an update on the database

    executeUpdate(sql, params) {
        return new Promise((resolve, reject) => {
            this.#db.run(sql, params, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });
    }

    //----------------------------------------------------------------------
    // EXECUTING A GIVEN QUERY
    //----------------------------------------------------------------------
    
    // Executes a query on the database and returns data

    executeQuery(sql, params) {
        let result = [];
        return new Promise((resolve, reject) => {
            this.#db.each(sql, params,
                // 1st callback: for each row
                (err, row) => {
                    if (err) {
                        reject(err); // the promise manages the error
                    }
                    else {
                        result.push(row);
                    }
                },
                //2nd callback: at the end
                //count = number of rows read
                (err, count) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                }
            );
        });
    }

}

/*
    DBTABLE
    This class is useful to manage comunication with the database when you need to refer to a particular table.
    It uses SocialDatabase.
 */
class DbTable {
    #db; //contains the database
    #tableName;

    constructor(db, tableName) {
        if (!(db instanceof SocialDatabase)) {
            throw new Error("db is not an instance of SocialDatabase");
        }
        this.#db = db;
        this.#tableName = tableName;
    }

    // Getter
    
    getName() {
        return this.#tableName;
    }

    //----------------------------------------------------------------------
    // INSERT
    //----------------------------------------------------------------------

    /**
     * values = {
     *     @col1: value1,
     *     @col2: value2,
     *     ...
     * }
     * 
     * becomes 
     * INSERT INTO #tableName (col1, col2, ...) VALUES (@col1, @col2,....)
     * 
     */
    insert(values) {
        let sql1 = 'INSERT INTO '.concat(this.#tableName, ' (');
        let sql2 = 'VALUES (';
        let first = true;
        Object.keys(values).forEach(column => {
            if (column.startsWith('@') || column.startsWith('$')) {
                sql1 = sql1.concat(((first) ? '' : ','), column.substring(1));
                sql2 = sql2.concat(((first) ? '' : ','), column);
            }
            else {
                throw new Error(`Column ${column} is not a valid paramenter`);
            }
            first = false;
        });
        let sql = sql1.concat(') ', sql2, ')');
        return this.#db.executeUpdate(sql, values);
    };

    //----------------------------------------------------------------------
    // UPDATE
    //----------------------------------------------------------------------

    /**
     * setValues = {
     *    @col1: value1,
     *    @col2: value2,
     *    ...
     * }
     * 
     * whereValues = {
     *    $col1: value1,
     *    $col2: value2,
     *    ...
     * }
     * 
     * diventa 
     *  UPDATE #tableName SET col1=@col1, col2=@col2, ... WHERE col1=$col1 AND col2=$col2 ....
     * 
     */
    update(setValues, whereValues) {
        let sql = 'UPDATE '.concat(this.#tableName, ' SET ');
        let first = true;
        Object.keys(setValues).forEach(column => {
            if (column.startsWith('@')) {
                sql = sql.concat(((first) ? '' : ','), column.substring(1), '=', column);
            }
            else {
                throw new Error(`Column ${column} is not a valid paramenter`);
            }
            first = false;
        });
        first = true;
        sql = sql.concat(' WHERE ');
        Object.keys(whereValues).forEach(column => {
            if (column.startsWith('$')) {
                sql = sql.concat(((first) ? '' : ' AND '), column.substring(1), '=', column);
            }
            else {
                throw new Error(`Column ${column} is not a valid paramenter`);
            }
            first = false;
        });
        let params = Object.assign({}, setValues, whereValues); // il primo paramentro è oggetto che viene modificato
        return this.#db.executeUpdate(sql, params);
    }

    //----------------------------------------------------------------------
    // DELETE
    //----------------------------------------------------------------------

    /**
     * whereValues = {
     *    $col1: value1,
     *    $col2: value2,
     *    ...
     * }
     * 
     * diventa
     *   DELETE FROM #tableName WHERE col1=$col1 and col2=$col2 ...
     * 
     */
    delete(whereValues) {
        let keys = Object.keys(whereValues);
        if (keys.length == 0) {
            throw new Error("Can't execute delete without where conditions");
        }
        let sql = 'DELETE FROM '.concat(this.#tableName, ' WHERE ');
        let first = true;
        keys.forEach(column => {
            if (column.startsWith('$')) {
                sql = sql.concat(((first) ? '' : ' AND '), column.substring(1), '=', column);
            }
            else {
                throw new Error(`Column ${column} is not a valid paramenter`);
            }
            first = false;
        });
        return this.#db.executeUpdate(sql, whereValues);
    }

    //----------------------------------------------------------------------
    // SELECT
    //----------------------------------------------------------------------

    /**
     * whereValues = {
     *    $col1: value1,
     *    $col2: value2,
     *    ...
     * }
     * 
     * columns = ['colA','colB',...]
     * 
     * becomes
     *   SELECT colA, colB, ... FROM #tableName WHERE col1=$col1 and col2=$col2 ...
     * 
     * if columns = []
     *   SELECT * FROM #tableName WHERE col1=$col1 and col2=$col2 ...
     * 
     * and if also whereValues = {}
     *   SELECT * FROM #tableName 
     */

    select(whereValues = {}, columns = []) {
        let sql = 'SELECT ';
        let first = true;
        if (columns.length == 0) {
            sql = sql.concat('*');
        }
        else {
            columns.forEach(column => {
                sql = sql.concat(((first) ? '' : ','), column);
                first = false;
            });
        }
        sql = sql.concat(' FROM ', this.#tableName);
        let keys = Object.keys(whereValues);
        if (keys.length != 0) {
            first = true;
            sql = sql.concat(' WHERE ')
            keys.forEach(column => {
                if (column.startsWith('$')) {
                    sql = sql.concat(((first) ? '' : ' AND '), column.substring(1),' = ', column);
                }
                else {
                    throw new Error(`Column ${column} is not a valid paramenter`);
                }
                first = false;
            });
        }
        return this.#db.executeQuery(sql, whereValues);
    }
}

/**
 * PASSWORDMANAGEMENT
 * - passwordEncrypt: encrypts password
 * - passwordCheck: confronts encrypted passwords
 */

class PasswordManagement {
    #pEncrypt(password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10).then(hash => {
                resolve(hash);
            }).catch(err => {
                reject(err);
            });
        });
    }
    
    //encrypts a given password
    passwordEncrypt(password) {
        let hash = this.#pEncrypt(password);
        return hash;
    }
    
    //checks the encrypted version of two passwords
    passwordCheck(password1,password2) {
        //returns true if the encrypted passwords are the same
        return bcrypt.compareSync(password1,password2);
    }
}

//Exports what needed

module.exports = {
    SocialDatabase,
    DbTable,
    DB_STATUS_CLOSED,
    DB_STATUS_OPEN,
    DB_STATUS_ERROR,
    PasswordManagement
}

