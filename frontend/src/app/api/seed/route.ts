import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import bcrypt from "bcryptjs";

const CHILLI_TYPES = ["Teja S17", "Guntur Sannam", "Byadgi", "Kashmiri", "334", "341", "Wonder Hot", "No.5", "Resham Patti", "Mundu", "Bird's Eye"];
const GRADES = ["Premium Export", "Grade A", "Grade B", "Machine Clean", "Hand Picked"];
const HEAT_LEVELS = ["Very High (75000-100000 SHU)", "High (50000-75000 SHU)", "Medium (25000-50000 SHU)", "Low (10000-25000 SHU)"];
const COLOR_VALUES = ["80-100 ASTA", "60-80 ASTA", "40-60 ASTA", "30-40 ASTA"];
const STOCK_TYPES = ["godown", "ac_storage"];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    
    // Create Users
    const password = await bcrypt.hash("password123", 10);
    const usersData = [];
    for (let i = 1; i <= 10; i++) {
      usersData.push({
        name: `User ${i}`,
        email: i === 1 ? "admin@trademirchi.com" : `user${i}@example.com`,
        password,
        role: i === 1 ? "superadmin" : "customer",
        isEmailVerified: true,
      });
    }
    const createdUsers = await User.insertMany(usersData);
    
    // Create Products
    const productsData = [];
    for (let i = 1; i <= 100; i++) {
      const variety = CHILLI_TYPES[Math.floor(Math.random() * CHILLI_TYPES.length)];
      const grade = GRADES[Math.floor(Math.random() * GRADES.length)];
      
      productsData.push({
        name: `${variety} Red Chilli - ${grade}`,
        variety: variety,
        category: "Red Chilli",
        description: `Premium quality ${variety} sourced directly from farmers. Perfect for export and bulk wholesale.`,
        images: ["https://res.cloudinary.com/ddkbtk9xf/image/upload/v1717326084/samples/food/spices.jpg"], 
        stock: getRandomInt(5000, 50000), // Stock in KG
        availableStockType: STOCK_TYPES[getRandomInt(0, 1)],
        moq: getRandomInt(100, 1000), // MOQ in KG
        origin: "Malakpet Mirchi Market, Hyderabad",
        grade: grade,
        heatLevel: HEAT_LEVELS[getRandomInt(0, HEAT_LEVELS.length - 1)],
        colorValue: COLOR_VALUES[getRandomInt(0, COLOR_VALUES.length - 1)],
        moisturePercentage: getRandomInt(8, 12),
        stemPercentage: getRandomInt(1, 5),
        packingSizes: ["25kg Jute Bag", "40kg PP Bag", "50kg Jute Bag"],
        currentPrice: getRandomInt(120, 250), // Price per KG (e.g. ₹150/kg)
        status: "active",
      });
    }
    const createdProducts = await Product.insertMany(productsData);
    
    // Create Orders
    const ordersData = [];
    for (let i = 1; i <= 50; i++) {
      const user = createdUsers[getRandomInt(1, createdUsers.length - 1)];
      const numItems = getRandomInt(1, 3);
      const items = [];
      let totalAmount = 0;
      
      for (let j = 0; j < numItems; j++) {
        const product = createdProducts[getRandomInt(0, createdProducts.length - 1)];
        const quantity = getRandomInt(1, 10);
        items.push({
          product: product._id,
          name: product.name,
          quantity: quantity,
          price: product.currentPrice
        });
        totalAmount += quantity * product.currentPrice;
      }
      
      ordersData.push({
        user: user._id,
        items,
        totalAmount,
        status: ["pending", "processing", "shipped", "delivered"][getRandomInt(0, 3)],
        paymentMethod: "Bank Transfer",
        paymentStatus: ["pending", "completed"][getRandomInt(0, 1)],
        shippingAddress: {
          street: "123 Market Road",
          city: "Hyderabad",
          state: "Telangana",
          country: "India",
          zipCode: "500001"
        }
      });
    }
    await Order.insertMany(ordersData);
    
    return NextResponse.json({ message: "Database seeded successfully with 100 products, 10 users, and 50 orders." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
