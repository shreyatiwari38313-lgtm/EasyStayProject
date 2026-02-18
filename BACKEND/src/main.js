import dotenv from 'dotenv';
import { app } from './app.js';
import { connectDB } from './db/main.js';

// Load env variables FIRST
dotenv.config({
    path: './.env'      
})

// Connect to database
connectDB()
  .then(() => {
    // Start server only after DB connects
    app.listen(process.env.PORT || 8000, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });




