
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { SearchType } from './config';

export const argv = yargs(hideBin(process.argv))
    .option('s', {
        alias: 'search',
        demand: true,
        describe: '请输入你的查找内容',
        type: 'string',
    })
    .option('t', {
        choices: [SearchType.Content, SearchType.Message, SearchType.All],
        alias: 'type',
        default: SearchType.All,
        describe: '要匹配的查找类型，message匹配git的提交信息，content匹配文件的更改内容，all会同时查找两者',
        type: 'string',
    })
    .option('l', {
        alias: 'length',
        default: 80,
        describe: '返回匹配字符串的内容长度值',
        type: 'number',
        skipValidation: false
    })
    .usage('Usage: ggc -s <search-content> [-t <type>] [-l <length>]')
    .example('ggc -s "hello world"', '将查找所有内容更改或提交信息里包含‘hello world’的git-hash，每条对象最多返回80个字符长度的内容')
    .example('ggc -s "hello world" -t message', '将查找所有提交信息包含‘hello world’的git-hash，每条对象最多返回80个字符长度的内容')
    .example('ggc -s "hello world" -t content -l 50', '将查找所有内容更改包含‘hello world’的git-hash，每条对象最多返回50个字符长度的内容')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2024')
    .argv;














