import connectDB from "../DB/connection.js";
import userRouter from "./modules/user/user.router.js";
const initiApp = (app, express) => {
	// parse data
	app.use(express.json());

	// routes
	// user
	app.use("/user", userRouter);

	// db
	connectDB();
};
export default initiApp;
