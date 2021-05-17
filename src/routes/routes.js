const express = require("express");
const router = express.Router();

const register = require("../controllers/sharedService/partnerSignup");
const getLogin = require("../controllers/auth/login");

const addCharger = require("../controllers/sharedService/addCharger");

const otpController = require("../controllers/sharedService/verifyOtp");

const middleware = require("../controllers/auth/middelware");

//login and register
router.post("/register", register.registerCustomer);
router.post("/login", getLogin.login);

//add and get charger
router.post("/addCharger", addCharger.addCharger);

router.get("/getCharger", addCharger.getCharger);

router.post("/verifyNumber", otpController.verifyNumber);
router.post("/verifyEmailId", otpController.verifyEmailId);
router.post("/sendOtp", otpController.sendOtp);

module.exports = router;
