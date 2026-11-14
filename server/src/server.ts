
import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';

const PORT = Number(process.env.PORT) || 5000;
const app = createApp();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[StoryWorld Server] Running on port ${PORT}`);
  console.log(`[StoryWorld Server] Health check: http://localhost:${PORT}/api/v1/health`);
});
