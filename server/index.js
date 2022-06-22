import express from "express";
import cors from "cors";
import fs from "fs";
import https from "https";


const app = express()
const controllers = require("./controllers");
const HTTPS_PORT = process.env.HTTPS_PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: ["https://localhost:3000"],
        credentials: true,
        methods: ["GET", "POST", "OPTIONS"],
    })
);
app.use(cookieParser());
app.post("/login", controllers.login);
app.get("/accesstokenrequest", controllers.accessTokenRequest);
app.get("/refreshtokenrequest", controllers.refreshTokenRequest);



let server;
if(fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")){
    const privateKey = fs.readFileSync(__dirname + "/key.pem", "utf8");
    const certificate = fs.readFileSync(__dirname + "/cert.pem", "utf8");
    const credentials = { key: privateKey, cert: certificate };
    server = https.createServer(credentials, app);
    server.listen(HTTPS_PORT, () => console.log("server runnning"));
} else {
    server = app.listen(HTTPS_PORT)
}
module.exports = server;
