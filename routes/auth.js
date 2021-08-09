const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
router.post('/registertry2', authController.registertry2)
router.post('/logintry', authController.logintry)
router.post('/logincustomer', authController.logincustomer)
router.post('/registercustomer', authController.registercustomer)

module.exports = router;