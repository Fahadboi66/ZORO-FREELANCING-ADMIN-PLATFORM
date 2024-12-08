import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit : "16kb" }));
app.use(cookieParser());



//Import routes:
import authRouter from "./Routes/auth.routes.js";
import userRouter from "./Routes/user.routes.js";
import dashboardRouter from "./Routes/dashboard.routes.js"
import jobRouter from "./Routes/job.routes.js"
import disputeRouter from "./Routes/dispute.routes.js"
import paymentRouter from "./Routes/payment.routes.js"
import notificationRouter from "./Routes/notification.routes.js"



//Endpoints:
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/disputes", disputeRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/notifications", notificationRouter);







//Error handler middleware:
import errorMiddleware from "./Middlewares/error.middleware.js"
app.use(errorMiddleware);


export default app;