const UserManagmentController = require("../Controllers/UserManagmentController");
const { adminAuth } = require("../middleware/auth");

const express = require("express");
const router = express.Router();

router.post("/", adminAuth, UserManagmentController.addUser);
router.delete("/:id", adminAuth, UserManagmentController.deleteUser);
router.put("/:id", UserManagmentController.updateUser);
router.get("/:id", adminAuth, UserManagmentController.getById);
router.get("/", adminAuth, UserManagmentController.getAllUser);

module.exports = router;
