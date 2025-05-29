const mongo = require(`mongodb`);

const MongoClient =mongo.MongoClient;

const MONGO_URL = "mongodb+srv://hrmobile837:HRmobile123@hr-mobile.y8u6xm4.mongodb.net/?retryWrites=true&w=majority&appName=HR-Mobile"

let _db;

const mongoConnect =(callback) => {
  MongoClient.connect(MONGO_URL).then(client => {
     callback ();
    _db = client.db(`HrMobile`);
  }).catch(err => {
    console.log(`error while connecting to Mongo :` , err);
  });
};

const getDB = ( ) => {
  if (!_db){
    throw new Error(`mongo not connected`);
  }
  return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;