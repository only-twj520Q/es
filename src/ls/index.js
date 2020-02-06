const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const spawn = require('cross-spawn');

inquirer.registerPrompt('autocomplete', require('./inquirer-autocomplete-prompt'));

let packageObj;
let scriptObj;
let scriptList;

try {
  packageObj = fs.readJsonSync(path.resolve(process.cwd(), 'package.json'));
} catch(err) {
  // console.log(err)
  console.log(chalk.yellowBright.bold('package.json文件不存在或者文件存在问题，请确保当前目录为工程的根目录'));
  process.exit(1);
} 

try {
  scriptObj = packageObj.scripts;
  if (typeof scriptObj === 'object' && Object.keys(scriptObj).length > 0) {
    scriptList = Object.keys(scriptObj).map(scriptKey => ({
      name: scriptKey,
      value: scriptKey,
      display: scriptObj[scriptKey]
    }));
  } else {
    console.log(chalk.yellowBright.bold('package.json文件script字段缺失或者script的值为空'));
    process.exit(1);
  }
} catch(err) {
  process.exit(1);
} 

inquirer.prompt([{
  type: 'autocomplete',
  name: 'scirpt',
  message: '请输入想要执行的命令（空格space选择，回车enter执行）：',
  pageSize: 20,
  source: (answer, input = '') => new Promise(resolve => {
    const fuzzyResult = fuzzy.filter(input, scriptList, {
      extract: function(item) {
        return item['name'];
      }
    });
    const data = fuzzyResult.map(function(element) {
      return element.original;
    });
    resolve(data);
  })
}]).then(function({ scirpt }) {
  spawn.sync('npm', ['run', scirpt], { stdio: 'inherit' });
});