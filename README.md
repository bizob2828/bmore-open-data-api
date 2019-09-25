[![codecov](https://codecov.io/gh/bizob2828/bmore-open-data-api/branch/master/graph/badge.svg)](https://codecov.io/gh/bizob2828/bmore-open-data-api)
commit
![](https://github.com/bizob2828/bmore-open-data-api/workflows/CI/badge.svg)

# Baltimore Restaurant API
Provides CRUD for Baltimore Restaurants.  There is an association with the police district.  It also does geocoding to obtain lat, long based on Address.  This is intended to be used with https://github.com/bizob2828/bmore-open-data-ui.

## Prerequisites
* MySQL must installed on your local machine

```
brew install mysql
```

* Node.js > 8.x
https://github.com/creationix/nvm

* Google Map API Key that is set as an environment var
https://developers.google.com/maps/documentation/javascript/get-api-key
```
export GMAPS_KEY=<api_key>
```

## Installation

```
git clone git@github.com:bizob2828/bmore-open-data-api.git
cd bmore-open-data-api
npm install
```

## Seed data
**Note: Edit config/config.json and set the appropriate development username, password, and host**

Sequelize is being used as the model and there are baseline files to load the schema.

```
echo "CREATE DATABASE open_data_dev;" | mysql -h <HOST> -u <USERNAME> -p<PASSWORD>
npm run seed
```

**Note: There cannot be a space between -p and the password, otherwise you wil have to enter it in the terminal.**

## Start Express.js server
```
npm run serve
```

## Run tests
Unit:
```
npm test
```

Functional:
First run, create db and seed data:
```
echo "CREATE DATABASE open_data_test;" | mysql -h <HOST> -u <USERNAME> -p<PASSWORD>
NODE_ENV=test npm run seed
```

```
npm run func-test
```

## Instrumentation
In development, instrumentation is off by default.  If you want to enable it. Set instrumentation.enabled = true in config/development.json

You will see results of requests logged to ./instrumentation.log or directly in the console

```
{"level":"info","message":"Request ID: 589a9702-d926-4572-88ba-a7b0d5bc0ee3, Response Time: 29.926ms, Memory Used: -0.221184, String Objects: 832"}
```
