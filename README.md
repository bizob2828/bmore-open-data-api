# Baltimore Restaurant API
Provides CRUD for Baltimore Restaurants.  There is an association with the police district.  It also does geocoding to obtain lat, long based on Address.  This is intended to be used with https://github.com/bizob2828/bmore-open-data-ui.

## Prerequisites
1. MySQL must installed on your local machine

```
brew install mysql
```

2. Node.js > 4.x
https://github.com/creationix/nvm

3. Google Map API Key that is set as an environment var
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
```
npm test
```
