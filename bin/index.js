#! /usr/bin/env node
const commander = require('commander');
const VERSION = require('../package.json').version;

commander
  .version(VERSION, '-v --version')
  .description('懒人工具集')
  .parse(process.argv);

require('../src/ls');
