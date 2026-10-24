import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();
app.listen(env.PORT, () => {
  process.stdout.write(`Occasio API listening on port ${String(env.PORT)}\n`);
});
