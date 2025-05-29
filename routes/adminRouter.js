//external module
const express = require(`express`);
const adminRouter = express.Router();

//local module
const adminController = require(`../controllers/adminController`);
const upload = require('../middlewares/multer');  // ✅ Import multer

adminRouter.get(`/Admin/addMobile`, adminController.getAddMobile);
// adminRouter.post("/Admin/addMobile", adminController.postAddMobile);
adminRouter.post("/Admin/addMobile", upload.single('SHimage'), adminController.postAddMobile);


adminRouter.get(`/Admin/mobileList`, adminController.getmobileList);
adminRouter.get(`/Admin/repair`, adminController.getrepair);
adminRouter.get(`/Admin/order`, adminController.getorder);

//adminRouter.post(`/Admin` , )




exports.adminRouter = adminRouter;