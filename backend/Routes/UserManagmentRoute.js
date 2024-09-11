const UserManagmentController = require('../Controllers/UserManagmentController');

const express = require('express')
const router = express.Router();

router.post("/", UserManagmentController.addUser);
router.delete("/:id", UserManagmentController.deleteUser);
router.put("/:id", UserManagmentController.updateUser);
router.get("/:id", UserManagmentController.getById);
router.get("/", UserManagmentController.getAllUser);


module.exports = router;