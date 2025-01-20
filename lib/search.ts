
import { CommandPipeChain, execCommand, isAllType, isContentType, isMessageType } from './utils'
import { SearchType, PIPE_CONCURRENCY, HashType, isWindows } from './config';
import { argv } from './argv';

const GREP = isWindows ? 'findstr' : 'grep';

const { search, contentLength, searchType } = argv;


const isSearchMessage = isAllType(searchType) || isMessageType(searchType)
const isSearchContent = isAllType(searchType) || isContentType(searchType)

async function handleGrep() {
    console.time('exec')

    await Promise.all([
        grepLostFound(),
        isSearchMessage && grepMessage(),
        isSearchContent && grepContent()
    ])

    console.timeEnd('exec')
}

async function getLostFoundhashs() {
    const allHashs = (await execCommand(`git fsck --lost-found`)).trim().split('\n').map(line => line.split(/ +/g))
    const blobHashs: string[] = [];
    const commitHashs: string[] = [];
    allHashs.forEach(([_, hashType, hash]) => {
        (hashType === HashType.Blob) && (blobHashs.push(hash));
        (hashType === HashType.Commit) && (commitHashs.push(hash));
    })
    return {
        blobHashs,
        commitHashs,
    }
}

/** 查找lost-found-hash */
async function grepLostFound() {
    const { blobHashs, commitHashs } = await getLostFoundhashs();

    const [
        blobHashMap,
        commitHashMap,
    ] = await Promise.all([
        getHashMap(blobHashs, HashType.Blob),
        getHashMap(commitHashs, HashType.Commit),
    ])
    console.log(`\n--lost-found--`)
    if (blobHashMap) {
        console.log(`\nblob-hash:\n`);
        console.table(blobHashMap);
    }
    console.log(`\ncommit-hash:\n`);
    console.table(commitHashMap);
}

/** 查找匹配的哈希内容对象 */
async function getHashMap(hashs: string[], hashType: HashType) {
    const hashMap: Record<string, string> = {};

    if (isMessageType(searchType) && hashType === HashType.Blob) {
        return null;
    }

    const showParametersMap = {
        [SearchType.All]: [],
        [SearchType.Message]: ['-s', '--format=%s'],
        [SearchType.Content]: ['--format=""'],
    }

    for (let i = 0; i * PIPE_CONCURRENCY < hashs.length; i++) {
        const hashFragment = hashs.slice(PIPE_CONCURRENCY * i, PIPE_CONCURRENCY * (i + 1));
        await Promise.all(hashFragment.map(async hash => {
            const matchStr = await new CommandPipeChain()
                .add('git', ['show', hash, ...showParametersMap[searchType]])
                .add(GREP, [search])
                .get()
            if (matchStr) {
                hashMap[hash] = matchStr.slice(0, contentLength);
            }
        }))
    }

    return hashMap
}

/** 从文件内容查找 */
async function grepContent() {
    const res = (await execCommand(`git log --all --oneline -S ${JSON.stringify(search)}`)).trim();
    console.log(`\n--commit-content--\n`, res);
}

/** 从提交信息查找 */
async function grepMessage() {
    const res = (await execCommand(`git log --all --oneline --grep ${JSON.stringify(search)}`)).trim();
    console.log(`\n--commit-message--\n`, res);
}

if (search) {
    handleGrep();
} else {
    console.error('请输入: ggc -s <查找内容>')
}










