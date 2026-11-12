import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';

const PORT = process.env.PORT || 5000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`[StoryWorld Server] Running on http://localhost:${PORT}`);
  console.log(`[StoryWorld Server] Health check: http://localhost:${PORT}/api/v1/health`);
});
