import jwt from "jsonwebtoken";

export const generateToken = ({
	payload = {},
	signature = "1a2b3c",
	expiresIn = "364d",
} = {}) => {
	const token = jwt.sign(payload, signature, {
		expiresIn: expiresIn,
	});
	return token;
};

export const verifyToken = ({ token, signature = "1a2b3c" } = {}) => {
	const decoded = jwt.verify(token, signature);
	return decoded;
};
