const express       = require("express");
const app           = express();
const bodyParser    = require("body-parser");
const cors          = require("cors");
const PORT          = process.env.PORT || 3001;
const dotenv        = require("dotenv");
dotenv.config();

const errorHandler  = require("./handlers/error");
const authRoutes    = require("./routes/auth");
const summaryRoutes = require("./routes/summaries");

const { ensureLogin, ensureLoginAndCorrectUser } = require("./middleware/auth");

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res, next) => {
    res.send("HI")
})

app.use("/api/auth", authRoutes);
app.use(
    "/api/users/:user_id/summaries", 
    ensureLoginAndCorrectUser, 
    summaryRoutes
);

// If no routes are good
app.use((req, res, next) => {
    return next({
        status: 404,
        message: "Not found."
    })
})

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})