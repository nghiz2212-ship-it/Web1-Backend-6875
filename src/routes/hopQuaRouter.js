const express = require("express");
const { createHopQua, deleteHopQua, getHopQua, updateHopQua } = require('../controllers/HopQua/hop.qua.controller');

const router = express.Router();

// find all hop-qua
router.get("/get-hop-qua", getHopQua );

// tao moi hop-qua
router.post("/create-hop-qua", createHopQua );

// update hop-qua
router.put("/update-hop-qua", updateHopQua );

// delete hop-qua
router.delete("/delete-hop-qua/:id", deleteHopQua );

module.exports = router;