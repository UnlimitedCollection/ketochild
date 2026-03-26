import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

router.post("/storage/uploads/request-url", async (_req: Request, res: Response) => {
  res.status(501).json({ error: "NOT_IMPLEMENTED", message: "Object storage not configured" });
});

router.get("/storage/public-objects/*filePath", async (_req: Request, res: Response) => {
  res.status(501).json({ error: "NOT_IMPLEMENTED", message: "Object storage not configured" });
});

router.get("/storage/objects/*path", async (_req: Request, res: Response) => {
  res.status(501).json({ error: "NOT_IMPLEMENTED", message: "Object storage not configured" });
});

export default router;
