let nodewalk = require('walk');
let mongodb = require('mongodb').MongoClient;
let fs = require('fs');

let fileList = [];

let config = {
    modulePath: '/Users/rdeshapriya/projects/synthea/src/main/resources/modules/proxi',
    mongodb: {
        host: '﻿﻿35.174.168.103',
        port: '27017',
        username: '',
        password: '',
        database: 'synthea-modules'
    }
};


let walker = nodewalk.walk(config.modulePath);
walker.on('file', (root, fileStats, next) => {
   fileList.push({
       path: root + '/' + fileStats.name,
       submodule: !root.endsWith('proxi'),
       relPath: root.endsWith('proxi') ? fileStats.name.replace('.json', '')
           : root.substring(root.lastIndexOf('/') + 1) + '/' + fileStats.name.replace('.json', '')
   });
   next();
});

walker.on('end', () => {
   loadToDb();
});

let insertDocs = (db) => {
    let collection = db.collection('module');
    for(let i = 0; i < fileList.length; i++) {
        fs.readFile(fileList[i].path, (err, data) => {
            console.log('Inserting file ' + fileList[i].path + ' - ' + i + ' of ' + fileList.length);
            let jsonObject = JSON.parse(data);
            jsonObject.submodule = fileList[i].submodule;
            jsonObject.relPath = fileList[i].relPath;
            collection.insertOne(jsonObject, (err, result) => {
                if(err) {
                    console.err("error inserting file");
                    console.err(err);
                }
            });
        });
    }
};

let loadToDb = () => {
    mongodb.connect('mongodb://' + config.mongodb.host + ':'
        + config.mongodb.port, {useNewUrlParser : true}, (err, client) => {
        if(err) {
            console.error("Error connecting to mongo");
            console.error(err);
        } else {
            insertDocs(client.db(config.mongodb.database));
        }
    });
};
