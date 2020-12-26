const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    datavase: "new_schema",
    password: "Nikita1994Pavel2001"
});

conn.connect(err => {
    if (err) {
        console.log(err);
        return err;
    }
    else {
        console.log('database -- ok');
    }
})
