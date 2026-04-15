const mongoose = require("mongoose");
const dotenv = require("dotenv");
const users = require("./data/users");
const products = require("./data/products");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // create users one by one to trigger pre-save middleware for password hashing
    const createdUsers = [];
    for (const user of users) {
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
    }
    
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map(p => {
      return { ...p, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  // We can add logic to destroy data if needed
  console.log("Destroy data not implemented yet");
  process.exit();
} else {
  importData();
}
