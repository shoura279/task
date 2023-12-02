import { ErrorClass } from "../utils/ErrorClass.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";
import { userModel } from "../../DB/model/user.model.js";
import { StatusCodes } from "http-status-codes";
import { tokenModel } from "../../DB/model/Token.model.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
	const { authorization } = req.headers;
	// check token existence
	if (!authorization?.startsWith("hamada__")) {
		return next(new ErrorClass("In-valid bearer key"));
	}
	// check token type
	const token = authorization.split("hamada__")[1];
	if (!token) {
		return next(new ErrorClass("In-valid token"));
	}

	// check payload
	const decoded = verifyToken({ token });
	if (!decoded?.id) {
		return next(
			new ErrorClass("In-valid token payload", StatusCodes.BAD_REQUEST)
		);
	}

	// check token in database
	const tokenDB = await tokenModel.findOne({ token, isValid: true });
	if (!tokenDB)
		return next(new ErrorClass("Token destroied!", StatusCodes.BAD_REQUEST));

	// check user existence
	const authUser = await userModel.findById(decoded.id);
	if (!authUser) {
		return next(new ErrorClass("user not found", StatusCodes.BAD_REQUEST));
	}

	// pass user
	req.user = authUser;
	req.token = token;
	return next();
});

export default isAuthenticated;
