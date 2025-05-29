const Home = require(`../models/secondHandMobileDB`);


exports.getAddMobile = (req,res,next) => {
  res.render(`admin/adminAddMobile`);
};

exports.postAddMobile = (req, res, next) => {
  const {SHmobile,SHprice,condition,SHdiscount, _id} = req.body ;
  const SHimage = req.file ? req.file.filename : null; // ✅ multer से आने वाला image filename
  const home = new Home(SHmobile,SHprice,condition,SHdiscount, _id);
  home.save().then(() => {
    console.log(`home registered successfully at db` , req.body);
  })

  res.render(`admin/mobileAdded`);
};


exports.getmobileList = (req,res,next) => {
  Home.fetchAll().then(registeredHomes => {
    res.render( `admin/adminMobileList` , {registeredHomes:registeredHomes} );
  });
  };

exports.getrepair = (req,res,next) => {
  res.render(`admin/adminRepair`);
};

exports.getorder = (req,res,next) => {
  res.render(`admin/adminOrder`);
};
