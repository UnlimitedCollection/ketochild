import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import kidsRouter from "./kids";
import foodsRouter from "./foods";
import mealPlansRouter from "./meal-plans";
import storageRouter from "./storage";
import tokensRouter from "./tokens";
import recipesRouter from "./recipes";
import { requireAuth } from "../middleware/requireAuth";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);

router.use(requireAuth);

router.use("/dashboard", dashboardRouter);
router.use("/kids", kidsRouter);
router.use("/foods", foodsRouter);
router.use("/meal-plans", mealPlansRouter);
router.use("/tokens", tokensRouter);
router.use("/recipes", recipesRouter);
router.use(storageRouter);

export default router;
