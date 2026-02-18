import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// routers
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import amenityRouter from "./routes/amenity.routes.js";
import availabilityRouter from "./routes/availability.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import reviewRouter from "./routes/review.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import hostVerificationRouter from "./routes/hostVerification.routes.js";

const app = express();

/* =======================
   CORS CONFIG
======================= */
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:8080";
const allowedOrigins = corsOrigin.split(",").map(origin => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

/* =======================
   BODY PARSERS
======================= */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

/* =======================
   STATIC FILES
======================= */
app.use(express.static("public"));

/* =======================
   COOKIES
======================= */
app.use(cookieParser());

/* =======================
   CSP (DEV SAFE)
======================= */
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:8000 http://localhost:8080; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (_req, res) => {
  res.send("EasyStay API running 🚀");
});

/* =======================
   AUTH + USER ROUTES
======================= */
app.use("/api/v1/auth", authRouter); // register, login, logout, refresh
app.use("/api/v1/users", userRouter); // me, update, delete

/* =======================
   OTHER MODULE ROUTES
======================= */
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/amenities", amenityRouter);
app.use("/api/v1/availability", availabilityRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/host-verification", hostVerificationRouter);

export { app };
