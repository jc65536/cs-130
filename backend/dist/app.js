"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_endpoints_1 = require("./endpoints/user-endpoints");
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const login_endpoints_1 = require("./endpoints/login-endpoints");
const utils_1 = require("./endpoints/utils");
const db_client_1 = require("./lib/db-lib/db-client");
const SESSION_SECRET_KEY = process.env["SESSION_SECRET_KEY"] ?? "";
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const store = new MongoDBStore({
    uri: db_client_1.uri + "admin",
    collection: 'sessions'
});
const app = (0, express_1.default)();
const port = 8000;
app.use((0, cors_1.default)({ origin: process.env["FRONTEND_HOST"] }));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use(utils_1.validateUser);
app.use((0, express_session_1.default)({
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false, // Only create new session if client does not already have a session cookie
    store: store,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: true,
        maxAge: 24 * 60 * 60 * 1000 // Time is in miliseconds
    },
}));
app.use("/login", login_endpoints_1.login_router);
app.use("/user", user_endpoints_1.user_router);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
