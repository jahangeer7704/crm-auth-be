import { Router } from "express";
import { register } from "@/shared/observability/metrics.js";


const router = Router();

router.get('/',async(_req, res) => {
    console.log("metrics route"); 
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
})

export default router;