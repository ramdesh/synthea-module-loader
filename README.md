## MongoDB module loader for Synthea

Simple script that loads [Synthea](https://github.com/synthetichealth/synthea) modules in to MongoDB for various applications. 

### Configuration

```
config = {
    modulePath: 'path/to/synthea/modules/folder',
    mongodb: {
        host: 'MongoDB hostname',
        port: 'MongoDB port',
        username: 'MongoDB username',
        password: 'MongoDB password',
        database: 'Collection to store module JSON objects in'
    }
};

```
