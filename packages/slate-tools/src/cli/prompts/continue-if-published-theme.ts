import chalk from 'chalk';
import inquirer from 'inquirer';
import figures from 'figures';
import { argv } from 'yargs';
import { fetchMainThemeId } from '../../shopify/sync';
import { getThemeIdValue } from '../../env/value';

const question = {
  type: 'confirm',
  name: 'continueWithDeploy',
  message: 'You are about to deploy to the published theme. Continue?',
  default: true,
  prefix: chalk.yellow(`${figures.warning} `),
};

export const continueIfPulishedTheme = async () => {
  if (argv.skipPrompts as boolean) {
    return question.default;
  }

  const publishedThemeId = await fetchMainThemeId() as string;
  const currentThemeId = getThemeIdValue();

  if(
    currentThemeId !== 'live' &&
    currentThemeId !== publishedThemeId.toString()
  ) {
    return question.default;
  }

  console.log();
  const answer:{continueWithDeploy:boolean} = await inquirer.prompt([question]);

  return answer.continueWithDeploy;
};
