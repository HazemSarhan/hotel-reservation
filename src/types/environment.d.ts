// src/types/environment.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    JWT_SECRET: string;
    DATABASE_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

declare namespace Express {
  interface Request {
    user?: {
      userId: string;
      name: string;
      role: string; // Or use `UserRole` if applicable
    };
  }
}

// Make this file a module
export {};
