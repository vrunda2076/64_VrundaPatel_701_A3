const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  empId: String,
  name: String,
  email: String,
  password: String,
  salary: Number,
  role: String
});

module.exports = mongoose.model("Employee", employeeSchema);