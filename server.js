const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/formDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema
const FormSchema = new mongoose.Schema({
  full_name: String,
  email: String,
  phone: String,
  course: String,
  state: String,
  university: String,
});

const Form = mongoose.model("Form", FormSchema);

// Store data in MongoDB and send to MUJ SMU API
app.post("/submit", async (req, res) => {
  try {
    // Save data to database
    const newForm = new Form(req.body);
    await newForm.save();

    // Prepare API request payload
    const apiData = [
      { Attribute: "FirstName", Value: req.body.full_name },
      { Attribute: "EmailAddress", Value: req.body.email },
      { Attribute: "Phone", Value: req.body.phone },
      { Attribute: "mx_course_applying_for", Value: req.body.course },
      { Attribute: "Source", Value: "Agents" },
      { Attribute: "Source Medium", Value: "BCMT" },
      { Attribute: "mx_Mobile", Value: req.body.phone },
      { Attribute: "mx_Enquired_University", Value: req.body.university },
    ];

    // Send data to MUJ SMU API
    await axios.post(
      "https://lapps-in21.leadsquared.com/executebylapptoken?name=da_54036_e738136c&stage=Live&xapikey=402809e910794df692e68da913bfee87",
      apiData,
      { headers: { "Content-Type": "application/json" } }
    );

    res.json({ message: "Data saved & sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing request" });
  }
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
