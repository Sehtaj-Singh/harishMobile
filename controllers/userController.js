exports.getHomePage = (req,res,next) => {
  res.render(`store/index`);
};

exports.getStore = (req,res,next) => {
  res.render(`store/store`);
};

exports.getOrders = (req,res,next) => {
  res.render(`store/orders`);
};

exports.getRepair = (req,res,next) => {
  res.render(`store/repair`);
};

exports.getContact = (req,res,next) => {
  res.render(`store/contact`);
};