import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import corsMiddleware from 'cors';
import express, { Express } from 'express';
import { Compiler } from 'webpack';
import { isHotUpdateFile } from '../utilities/hot';

export class MiddlewareServer {
  public app:Express;
  public webpackDevMiddleware:ReturnType<typeof webpackDevMiddleware>;
  public webpackHotMiddleware:ReturnType<typeof webpackHotMiddleware>; 

  constructor(compiler:Compiler) {
    this.app = express();
    this.webpackDevMiddleware = webpackDevMiddleware(compiler, {
      logLevel: 'silent',
      writeToDisk: filePath => !isHotUpdateFile(filePath)
    });

    this.webpackHotMiddleware = webpackHotMiddleware(compiler, {
      log: false,
    });

    this.app.use(corsMiddleware());
    this.app.use(this.webpackDevMiddleware);
    this.app.use(this.webpackHotMiddleware);
  }
};