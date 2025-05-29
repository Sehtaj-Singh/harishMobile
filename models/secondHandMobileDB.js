const {getDB} = require(`../utils/databaseUtil`);
const { ObjectId} = require(`mongodb`);

module.exports = class Home {
  constructor(SHmobile,SHprice,SHimage,condition,SHdiscount, _id) {
    this.SHmobile = SHmobile;
    this.SHprice = SHprice;
    this.SHimage = SHimage;
    this.condition = condition;
    this.SHdiscount = SHdiscount;
    if(_id) {
      this._id = _id;
    }
  }
  save() {
    const db = getDB();
    return db.collection(`homes`).insertOne(this)
    };
    
  static fetchAll(){
    const db = getDB();
    return db.collection(`homes`).find().toArray().then((homes) => {
      return homes;
    }).catch((err) => {
      console.log(err);
    });
  }

  static findById(homeId){
    const db = getDB();
    return db.collection(`homes`).find({_id:new ObjectId(String(homeId))}).next();
  }
  
  static deleteById(homeId) {
    const db = getDB();
    return db.collection(`homes`).deleteOne({_id:new ObjectId(String(homeId))});
  }

};

