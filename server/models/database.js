const mongoose = require("mongoose");
const db = process.env.DATABASE.replace("<password>", process.env.PASSWORD);
mongoose.connect(db, {}).then(() => console.log("DATABASE connnected.."));

// Models
require("./Category");
require("./Recipe");
