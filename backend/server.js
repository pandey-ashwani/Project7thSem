const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`[SwasthyaSankalp] Backend Server Running on Port ${PORT}`);
      console.log(`[SwasthyaSankalp] REST API base: http://localhost:${PORT}/api`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('[SwasthyaSankalp] Fatal server boot error:', error);
    process.exit(1);
  }
};

startServer();
