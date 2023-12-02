import { StatusCodes } from "http-status-codes";
import { userModel } from "../../../../DB/model/user.model.js";
import { ApiFeatures } from "../../../utils/APIFeatures.js";
import { ErrorClass } from "../../../utils/ErrorClass.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import { generateToken } from "../../../utils/GenerateAndVerifyToken.js";
import { tokenModel } from "../../../../DB/model/Token.model.js";
//================== get all user ===========
export const getAll = async (req, res, next) => {
	const apiFeatures = new ApiFeatures(userModel.find(), req.query)
		.pagination(userModel)
		.filter()
		.sort();
	const users = await apiFeatures.mongooseQuery;
	return res.json({
		success: true,
		message: "done",
		result: { users },
	});
};

//================== add user sign up ===============
export const addUser = async (req, res, next) => {
	// get data from req
	const { userName, password, email, role } = req.body;

	// check existence
	const isExist = await userModel.findOne({ email });
	if (isExist) {
		return next(new ErrorClass("email already exist", 409));
	}
	// prepare user object
	const user = {
		userName,
		email,
		password: hash({ plaintext: password }),
		role,
	};
	// add user to db
	await userModel.create(user);
	// send response
	return res.status(201).json({
		success: true,
		message: "user added successfully",
		result: { user },
	});
};

//================== log in =======================
export const logIn = (async (req, res, next) => {
	// get data from req
	const { email, password } = req.body;

	// check user existence
	const user = await userModel.findOne({ email });
	if (!user) return next(new ErrorClass("user not found", 404));

	// check password (compare)
	const match = compare({ plaintext: password, hashValue: user.password });
	if (!match) return next(new ErrorClass("incorrect password", 400));

	// generate token
	const payload = {
		id: user._id,
		email: user.email,
	};
	const token = generateToken({ payload });

	// save token in database
	await tokenModel.create({ token, user: user._id });

	// send response
	return res.json({
		success: true,
		message: "welcome!",
		result: { token },
	});
});
//================== update user ============
export const updateUser = async (req, res, next) => {
	// get data from req
	const { email, userName, password } = req.body;
	const { id } = req.params;
	// check user existence
	const isExist = await userModel.findById(id);
	if (!isExist) {
		return next(new ErrorClass("invalid id!", 404));
	}
	// check email exist
	const isEmailExist = await userModel.findOne({ email, _id: { $ne: id } });
	if (isEmailExist) {
		return next(new ErrorClass("email already exist", 409));
	}
	// update user
	const user = await userModel.findByIdAndUpdate(
		{ id },
		{ email, userName, password: hash({ plaintext: password }) },
		{ new: true }
	);
	// send response
	return res.status(200).json({
		success: true,
		message: "user updated successfully",
		result: { user },
	});
};

//================== delete user ============
export const deleteUser = async (req, res, next) => {
	// get data from req
	const { id } = req.params;
	// check existence
	const isExist = await userModel.findById(id);
	if (!isExist) {
		return next(new ErrorClass("invalid id", 404));
	}
	// delete user
	await userModel.deleteOne({ _id: id });
	// send response
	return res.status(200).json({
		success: true,
		message: "user deleted successfully",
	});
};
