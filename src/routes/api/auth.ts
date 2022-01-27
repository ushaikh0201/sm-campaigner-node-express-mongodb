import { Router } from "express";

import {auth, schema} from "../../middleware";
import schemas from "../schemas";
import AuthController from "../../controllers/AuthController";

const router: Router = Router();

// @route   GET api/auth
// @desc    Get authenticated user given the token
// @access  Private
router.get("/", auth, AuthController.getAuthUser);

// @route   POST api/auth
// @desc    Login user and get token
// @access  Public
router.post("/", schema(schemas.auth.login), AuthController.login);

// @route   POST api/register
// @desc    Register user and get token
// @access  Public
router.post("/register", schema(schemas.auth.register), AuthController.register);

export default router;
