const express = require("express");
const router = express.Router();
const user = require("../services/user");
const {sertificate} = require("../controllers/sertificate");

router.get("/user", async function(req, res, next) {
    try {
        const data = await user.getDataUser(req.query.registerNumber);
        res.json(data);
    } catch (err) {
        console.error(`Error while getting data `, err.message);
        next(err);
    }
})

router.get("/html", async function(req, res, next) {
    res.render('sertificate')
})

router.get("/sertificate", sertificate)

module.exports = {
    router
};