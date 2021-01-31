const mongoose = require("mongoose");
mongoose.set("debug", true);

mongoose.connect("mongodb://localhost:27017/learn-a-bit", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports.User = require("./user");