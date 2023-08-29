const express = require("express");
const http = require("http");
const https = require("https");
const cookieParser = require("cookie-parser");

import dataSource from "./config/dataSource";
import router from "./router/index";
import errorHandler from "./middlewares/errorHandler";
import { Request, Response, NextFunction } from "express";

const app = express();

const connectDB = async () => {
  try {
    await dataSource.initialize();
    console.log("DB connected!");
  } catch (err) {
    console.error(err);
  }
};

const loadExpressApp = async () => {
  await connectDB();

  const app: any = express();
  app.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  router.use(cookieParser());

  app.use(router);
  app.use(errorHandler);
  app.all("*", (_: any, res: any) => {
    res.status(404).json({
      data: null,
      error: {
        message: "URL Not Found",
      },
    });
  });

  return app;
};

const startServer = async () => {
  const app = await loadExpressApp();

  const server = http.createServer(app);

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};

startServer()
  .then(() => {
    console.log("Server started!");
  })
  .catch((err: any) => {
    console.error(err);
  });
