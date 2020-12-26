const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const db = require('./db');
const Image = db.image;

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "new_schema",
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

let queryStr = "SELECT * FROM questions";

conn.query(queryStr, (err, result, field) =>{
    console.log(err);
    console.log(result[1].id);
    console.log(result);
    //console.log(field);
});

let string = "";
conn.query(queryStr, function(err, rows, fields) {
    if (err) throw err;

    for (let i in rows) {
        var a = rows[i].answers.split(', ');
        string += '<div>'
            +'<label>'+rows[i].quest+'</label>'
            +'<input type="radio" name="' +i+ '" id="ans'+i+'" value="'+a[0]+'">'
            +'<label for="ans'+i+'">'+a[0]+'</label>'
            +'<input type="radio" name="' +i+ '" id="ans'+i+'" value="'+a[1]+'">'
            +'<label for="ans'+i+'">'+a[1]+'</label>'
            +'<input type="radio" name="' +i+ '" id="ans'+i+'" value="'+a[2]+'">'
            +'<label for="ans'+i+'">'+a[2]+'</label>'
            +'</div>';
    }
});

http.createServer( (req, res) => {
    console.log(`req: ${req.url}`);
    if (req.url === '/') {
        sendRes('index.html', 'text/html', res);
    }
    else if (req.url === '/save-form'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log(body);
            writeToDb(body, res);
            let det = JSON.parse(body, true);
            console.log(det['input-0']);
        })
    }
    else if (req.url === '/result'){
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(
            '<!DOCTYPE html>'
            +'<head>'
            +'<meta charset="utf-8">'
            +'<title>Test</title>'
            +'<link rel="stylesheet" href="style.css">'
            +'</head>'
            +'<body>'
            +'<div>');
        let queryOne = "SELECT * FROM answers";
        let strochka = "";
        conn.query(queryOne, function(err, rows, fields) {
            if (rows.length >= 3) {
                if (rows[rows.length - 3].answer === 'Да' && rows[rows.length - 2].answer === 'Да' && rows[rows.length - 1].answer === 'Разумеется'){
                    strochka = '<h1 class="h1-y">Тест решен!</h1>';
                    res.write(strochka);
                    res.write(
                        '</div>'
                        +'<script src="db.js"></script>'
                        +'</body>'
                        +'</html>');
                    res.end();
                }
                else {
                    strochka = '<h1 class="h1-n">Тест не решен!</h1>';
                    res.write(strochka);
                    res.write(
                        '</div>'
                        +'<script src="db.js"></script>'
                        +'</body>'
                        +'</html>');
                    res.end();
                }
            }
            else {
                strochka = '<h1 class="h1-n">Тест не решен!</h1>';
                res.write(strochka);
                res.write(
                    '</div>'
                    +'<script src="db.js"></script>'
                    +'</body>'
                    +'</html>');
                res.end();
            }
        });
    }
    else if (req.url === '/test'){
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(
            '<!DOCTYPE html>'
            +'<head>'
            +'<meta charset="utf-8">'
            +'<title>Test</title>'
            +'<link rel="stylesheet" href="style.css">'
            +'</head>'
            +'<body>'
            +'<div class="form-uniq">'
            +'<form class="form">'
            +string
            +'<div>'
            +'<button type="submit" class="boton1">Отправить результат</button>'
            +'<a href="/result" class="boton1">Посмотреть результаты</a>'
            +'</div>'
            +'</form>'
            +'</div>'
            +'<script src="db.js"></script>'
            +'</body>'
            +'</html>');
        res.end();
    }
    else {
        sendRes(req.url, getContentType(req.url), res);
    }
}).listen(3000, ()=> {
    console.log('node port 3000');
});

function sendRes(url, contentType, res) {
    let file = path.join(__dirname+'/static/', url);
    fs.readFile(file, (err, content) =>{
        if(err){
            res.writeHead(404);
            res.write('unknown address');
            res.end();
            console.log(`error 404 ${file}`);
        }
        else {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(content);
            res.end();
            console.log(`200 ${file}`);
        }
    })
}

function getContentType(url) {
    switch (path.extname(url)) {
        case ".html":
            return "text/html";
        case ".css":
            return "text/css";
        case ".js":
            return "text/javascript";
        case ".json":
            return "application/json";
        default:
            return "application/octate-stream";
    }
}

function writeToDb(data, res) {
    data = JSON.parse(data, true);
    console.log(data);
    Image.create({
        answer: data['input-0'],
        idq: 1
    })
    Image.create({
        answer: data['input-1'],
        idq: 2
    })
    Image.create({
        answer: data['input-2'],
        idq: 3
    })
        .then(result => {
            console.log(result);
            res.end('ok');
        }).catch(err => {
            console.log(err);
            res.end('error');
    })
}
