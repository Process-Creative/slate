import minimist from 'minimist';
import { create } from '../../env/tasks';

const argv = minimist(process.argv.slice(2));

create({ name: argv.env });
console.log('Generated your shiny new ENV file!');