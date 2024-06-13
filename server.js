import express from "express" ;
import  colors from "colors" ;
import dotenv from 'dotenv' ;
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cors from "cors";
import Stripe from "stripe";



dotenv.config();

connectDB();

//rest object
const app = express();
//middlewares
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/product",productRoutes);
// rest api
app.get('/',(req,res) => {

         res.send("<h1>welcome to ecommerce app</h1>")
}  )

// port
const PORT = process.env.port || 8080
clearImmediate
// run listen
app.listen(PORT,() => {

    console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
    
})


const stripe = Stripe("sk_test_51P9TlSSFaZQtL47c9kqf2Yby0QQcWF4JDRZR5mX3yvELkC6gSTFOd6JATqy8tQ5Cj0hQ0vXoBKWpDctbnVeN3THL00FLxkO1M0")
app.post("/api/checkout",async(req,res)=>{
    try {
        const {product} = req.body;
            const line_items = product.map(  (product)=>({
                    price_data:{
                        current:"inr",
                        product_data:{
                            name:product.name
                        },
                        unit_amount:(product.price)*100,
                    },
                    quantity:1
            }));
           const session = await stripe.checkout.session.create({
            payment_methods_type:["card"],
            line_items:line_items,
            mode:"payment",
            success_url:"",
            cancel_url:""
           })
           res.json({id:session.id})
        }       
    catch (error) {
       res.status(500).json({error:error.message}) 
    }
})



