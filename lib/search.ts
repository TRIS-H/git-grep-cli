
import { CommandPipeChain, execCommand, isAllType, isContentType, isMessageType } from './utils'
import { SearchType, PIPE_CONCURRENCY, HashType } from './config';
import { argv } from './argv';

const { search, length, type: searchType } = argv as any as {
    search: string;
    length: number;
    type: SearchType;
    [x: string]: any;
};

const contentLength = Number.isNaN(length) ? 80 : length;

const grepLostFoundType = `grep ${isMessageType(searchType) ? 'commit' : '-v tree'}`;

async function handleGrep() {
    console.time('run-exec')
    if (isAllType(searchType) || isMessageType(searchType)) {
        const messageMatch = (await grepMessage()).trim();
        console.log(`--commit-message--\n`, messageMatch);
    }
    if (isAllType(searchType) || isContentType(searchType)) {
        const contentMatch = (await grepContent()).trim();
        console.log(`\n--commit-content--\n`, contentMatch);
    }

    await grepLostFound();
    console.timeEnd('run-exec')
}

async function getLostFoundhashs() {
    const allHashs = (await execCommand(`git fsck --lost-found | ${grepLostFoundType} | awk '{i=NF-1; print $i "," $NF}'`)).trim().split('\n').map(line => line.split(','))
    const blobHashs: string[] = [];
    const commitHashs: string[] = [];
    allHashs.forEach(([hashType, hash]) => (hashType === HashType.Blob ? blobHashs : commitHashs).push(hash))
    return {
        blobHashs,
        commitHashs,
    }
}
/** 查找lost-found-hash */
async function grepLostFound() {
    const { blobHashs, commitHashs } = await getLostFoundhashs()

    const [
        blobHashMap,
        commitHashMap,
    ] = await Promise.all([
        getHashMap(blobHashs, HashType.Blob),
        getHashMap(commitHashs, HashType.Commit),
    ])
    console.log(`\n--lost-found--`)
    blobHashMap && console.log(`\nblob-hash:\n`, blobHashMap);
    console.log(`\ncommit-hash:\n`, commitHashMap);
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
        [SearchType.Content]: ['--pretty=format:""'],
    }

    for (let i = 0; i * PIPE_CONCURRENCY < hashs.length; i++) {
        const hashFragment = hashs.slice(PIPE_CONCURRENCY * i, PIPE_CONCURRENCY * (i + 1));
        await Promise.all(hashFragment.map(async hash => {
            const matchStr = await new CommandPipeChain()
                .add('git', ['show', hash, ...showParametersMap[searchType]])
                .add('grep', [search])
                .get()
            if (matchStr) {
                hashMap[hash] = matchStr.slice(0, contentLength);
            }
        }))
    }

    return hashMap
}

/** 从内容查找 */
function grepContent() {
    return execCommand(`git log --oneline -S ${search}`)
}

/** 从标题查找 */
function grepMessage() {
    return execCommand(`git log --oneline --grep ${search}`)
}

if (search) {
    handleGrep();
} else {
    console.log('请输入: gg -S <查找内容>')
}










