const mongoose = require('mongoose');

// Your MongoDB Atlas connection string (replace <username>, <password>, and <dbname>)
const mongoURI = "mongodb+srv://admin:mypassword123@diabetescluster.xg8tr.mongodb.net/?retryWrites=true&w=majority&appName=DiabetesCluster";

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));
