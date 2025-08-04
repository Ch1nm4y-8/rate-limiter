import express from "express";
import RateLimiter from "./services/RateLimiter.js";
import { expressRateLimiter } from "./ExpressAdaptor.js";

const app = express();
const PORT = 3000;

const limiter = new RateLimiter();
// const limiter = new RateLimiter(new FixedWindowCounterStrategy({}));
// const limiter = new RateLimiter(new LeakyBucketStrategy({ capacity: 5, leakIntervalMs: 5000 }));

app.use(express.json());
app.use(expressRateLimiter(limiter));

app.get("/", (req, res) => {
  res.send("GETTING DATA");
});

app.listen(PORT, () => {
  console.log("Server listening on port ", PORT);
});
