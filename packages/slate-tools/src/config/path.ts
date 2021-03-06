import * as path from 'path';
import { slateSchemaCreate } from './schema';

export type SchemaPaths = {
  /** Returns the root directory of the theme */
  'paths.theme':string;

  /** Theme node_modules directory */
  'paths.theme.nodeModules':string;

  /** Theme package.json file */
  'paths.theme.packageJson':string;

  /** Source directory of theme */
  'paths.theme.src':string;

  /** Source directory of assets folder */
  'paths.theme.src.assets':string;

  /** Source of theme configuration files */
  'paths.theme.src.config':string;

  /** Source of theme liquid layout files */
  'paths.theme.src.layout':string;

  /** Source of translation locales */
  'paths.theme.src.locales':string;

  /** Source scripts directory for theme */
  'paths.theme.src.scripts':string;

  /** Source snippets directory */
  'paths.theme.src.snippets':string;

  /**
   * Static asset directory for files that statically copied to
   * paths.theme.dist.assets
   */
  'paths.theme.src.sections':string;

  /** Source liquid template directory */
  'paths.theme.src.templates':string;

  /** Source liquid template directory for customers */
  'paths.theme.src.templates.customers':string;

  /** Directory for storing all temporary and/or cache files */
  'paths.theme.cache':string;
}

export const SCHEMA_PATHS = slateSchemaCreate<SchemaPaths>(config => ({
  'paths.theme': process.cwd(),

  'paths.theme.nodeModules': () => 
    path.join(config.get('paths.theme'), 'node_modules'),

  'paths.theme.packageJson': () =>
    path.join(config.get('paths.theme'), 'package.json'),

  'paths.theme.src': () => 
    path.join(config.get('paths.theme'), 'src'),

  'paths.theme.src.assets': () =>
    path.join(config.get('paths.theme.src'), 'assets'),

  'paths.theme.src.config': () =>
    path.join(config.get('paths.theme.src'), 'config'),

  'paths.theme.src.layout': () =>
    path.join(config.get('paths.theme.src'), 'layout'),

  'paths.theme.src.locales': () =>
    path.join(config.get('paths.theme.src'), 'locales'),

  'paths.theme.src.scripts': () =>
    path.join(config.get('paths.theme.src'), 'scripts'),

  'paths.theme.src.snippets': () =>
    path.join(config.get('paths.theme.src'), 'snippets'),

  'paths.theme.src.sections': () =>
    path.join(config.get('paths.theme.src'), 'sections'),

  'paths.theme.src.templates': () =>
    path.join(config.get('paths.theme.src'), 'templates'),

  'paths.theme.src.templates.customers': () =>
    path.join(config.get('paths.theme.src.templates'), 'customers'),

  'paths.theme.cache': () =>
    path.join(config.get('paths.theme'), '.cache'),
}));