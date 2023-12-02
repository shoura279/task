import { Router } from "express";
import * as userController from "./controller/user.js";
import isAuthenticated from "../../middleware/authentication.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router();

// add user (sign up)
router.post("/", asyncHandler(userController.addUser));

// login
router.post("/login", asyncHandler(userController.logIn));

// use auth in all route expecte sign up and sign in
router.use(isAuthenticated);

// get all users
router.get("/", asyncHandler(userController.getAll));

// update user
router.put("/:id", asyncHandler(userController.updateUser));

// delete user
router.delete("/:id", asyncHandler(userController.deleteUser));

export default router;
