import webpack, { Compiler } from 'webpack';
import { createServer } from 'https';
import { createHash } from 'crypto';
import SlateConfig from '@process-creative/slate-config';
import Client from './client';
import slateToolsSchema from './../slate-tools.schema';
import { isHotUpdateFile } from '../tools/hot';
import { sslKeyCert } from '../tools/ssl';
import { Server } from 'http';
import App from './app';

const config = new SlateConfig(slateToolsSchema);

type DevServerOptions = {
  address:string;
  port:number;
} & any;

class DevServer {
  public assetHashes:{[key:string]:any};
  public address:string;
  public port:number;
  public options:DevServerOptions;
  public compiler:Compiler;
  public app:App;
  public client:Client;

  public ssl:ReturnType<typeof sslKeyCert> | undefined;
  public server:Server;

  constructor(options:DevServerOptions) {
    options.webpackConfig.output.publicPath = `https://${options.address}:${
      options.port
    }/`;

    this.assetHashes = {};
    this.address = options.address;
    this.options = options;
    this.port = options.port;
    this.compiler = webpack(options.webpackConfig);
    this.app = new App(this.compiler);
    this.client = new Client();
    this.client.hooks.afterSync.tap(
      'HotMiddleWare',
      this._onAfterSync.bind(this),
    );
  }

  start() {
    this.compiler.hooks.done.tapPromise(
      'DevServer',
      this._onCompileDone.bind(this),
    );
    this.ssl = sslKeyCert();
    this.server = createServer(this.ssl, this.app.app);
    this.server.listen(this.port);
  }

  set files(files:any) {
    this.client.files = files;
  }

  set skipDeploy(value:any) {
    this.client.skipNextSync = value;
  }

  _onCompileDone(stats) {
    const files = this._getAssetsToUpload(stats);

    return this.client.sync(files, stats);
  }

  _onAfterSync(files) {
    this.app.webpackHotMiddleware.publish({
      action: 'shopify_upload_finished',
      force: files.length > 0,
    });
  }

  _isChunk(key, chunks) {
    return (
      chunks.filter((chunk) => {
        return key.indexOf(chunk.id) > -1 && !this._isLiquidStyle(key);
      }).length > 0
    );
  }

  _isLiquidStyle(key) {
    return key.indexOf('styleLiquid.scss.liquid') > -1;
  }

  _hasAssetChanged(key, asset) {
    const oldHash = this.assetHashes[key];
    const newHash = this._updateAssetHash(key, asset);

    return oldHash !== newHash;
  }

  _getAssetsToUpload(stats:any) {
    const assets = Object.entries(stats.compilation.assets) as any;
    const chunks = stats.compilation.chunks;

    return (
      assets.filter(([key, asset]) => (
        asset.emitted &&
        !this._isChunk(key, chunks) &&
        !isHotUpdateFile(key) &&
        this._hasAssetChanged(key, asset)
      )).map(([key, asset]) => {
        return asset.existsAt.replace(config.get('paths.theme.dist'), '');
      })
    );
  }

  _updateAssetHash(key:string, asset:any) {
    const rawSource = asset.source();
    const source = Array.isArray(rawSource) ? rawSource.join('\n') : rawSource;
    const hash = createHash('sha256')
      .update(source)
      .digest('hex');

    return (this.assetHashes[key] = hash);
  }
};

export = DevServer;