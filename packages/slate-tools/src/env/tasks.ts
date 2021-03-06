import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { getFileName, getFileContents, getFilePath } from './file';
import { setEnvName, SLATE_ENV_VARS } from './env';
import { validateStore, validatePassword, validateThemeId } from './validate';
import { slateToolsConfig } from '../schema';

interface ICreateParams {
  values?:string[];
  name?:string;
  root?:string;
}

export const create = ({ values, name, root }:ICreateParams) => {
  const envName = getFileName(name);
  const envPath = path.resolve(
    root || slateToolsConfig.get('env.rootDirectory'),
    envName,
  );
  const envContents = getFileContents(values);
  fs.writeFileSync(envPath, envContents);
}

export const assign = (name:string) => {
  const envPath = getFilePath(name);
  const result = dotenv.config({path: envPath});

  if (typeof name !== 'undefined' && result.error) {
    throw result.error;
  }

  setEnvName(name);
}

export const validate = () => {
  const errors = [].concat(
    validateStore(),
    validatePassword(),
    validateThemeId(),
  );

  return {
    errors,
    isValid: errors.length === 0,
  };
}

export const clear = () => {
  SLATE_ENV_VARS.forEach((key) => (process.env[key] = ''));
}