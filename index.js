// import express module
import express from "express";
import initiApp from "./src/index.router.js";

// create server
const app = express();
const port = 3000;

// bootStrap
initiApp(app, express);

app.listen(port, () => {
	console.log("server is running on port : ", port);
});
