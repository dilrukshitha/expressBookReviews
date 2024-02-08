const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Update the authentication middleware for routes under "/customer/auth/*"
app.use("/customer/auth/*", async function auth(req, res, next) {
    try{
        if (req.session.authorization.accessToken) {
            const token = req.session.authorization.accessToken;
            jwt.verify(token, "access", (err, user) => {
                if (!err) {
                    req.user = user;
                    next(); // Proceed to the next middleware/route handler
                } else {
                    return res.status(403).json({ message: "User not authenticated" });
                }
            });
        } else {
            return res.status(403).json({ message: "User not logged in" });
        }
    }catch(err){
        return res.status(500).json({ message: "Internal server error." });
    }
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
