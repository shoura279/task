import bcrypt from "bcryptjs";

export const hash = ({ plaintext, salt = 8 } = {}) => {
	const hashResult = bcrypt.hashSync(plaintext, Number(salt));
	return hashResult;
};

export const compare = ({ plaintext, hashValue } = {}) => {
	const match = bcrypt.compareSync(plaintext, hashValue);
	return match;
};
