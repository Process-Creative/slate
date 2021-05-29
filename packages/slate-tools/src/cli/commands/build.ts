// Set NODE_ENV so slate.config.js can return different values for
// production vs development builds
process.env.NODE_ENV = 'production';


/*
* Run Webpack with the webpack.prod.conf.js configuration file. Write files to disk.
*
* If the `deploy` argument has been passed, deploy to Shopify when the compilation is done.
*/
import webpack from 'webpack';
import webpackConfig from './../../webpack/config/prod';
import minimist from 'minimist';
import chalk from 'chalk';
import { validate } from '../../env/tasks';
import { getEnvNameValue } from '../../env/value';
import { webpackBuild } from '../../webpack/build';

const argv = minimist(process.argv.slice(2));

const result = validate();
if(!result.isValid) {
  console.log(chalk.red(
    `Some values in environment '${getEnvNameValue()}' are invalid:`,
  ));
  result.errors.forEach((error) => {
    console.log(chalk.red(`- ${error}`));
  });
}

webpackBuild();