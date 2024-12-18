import { exec, spawn, ChildProcessWithoutNullStreams } from 'child_process';

export async function execCommand(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`exec stderr: ${stderr}`);
                return reject(stderr);
            }
            resolve(stdout.toString());
        })
    });
}

export async function spawnCommand(cmd: string, args: string[] = []): Promise<string> {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args);
        let result: string = '';
        child.stdout.on('data', (data) => {
            result += data.toString();
        });
        child.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
            reject(data);
        })
        child.on('close', (code) => {
            resolve(result);
        })
    });
}

export class CommandPipeChain {
    public commands: ChildProcessWithoutNullStreams[] = []
    getLastSpawnProcess() {
        return this.commands[this.commands.length - 1];
    }
    add(cmd: string, args: string[]) {
        const lastSpawnProcess = this.getLastSpawnProcess();
        const spawnProcess = spawn(cmd, args);
        if (lastSpawnProcess) {
            lastSpawnProcess.stdout.pipe(spawnProcess.stdin);
        }
        this.commands.push(spawnProcess);
        return this;
    }
    log() {
        this.commands.forEach((process) => {
            process.stdout.on(`data`, (data) => console.log(data.toString()))
        })
        return this;
    }
    get(): Promise<string> {
        const lastSpawnProcess = this.getLastSpawnProcess();
        return new Promise((resolve, reject) => {
            let result = '';
            lastSpawnProcess.stdout.on('data', (data) => {
                result += data.toString();
            });
            //监听错误
            lastSpawnProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
                reject(data)
            })
            lastSpawnProcess.on('close', () => resolve(result));
        });
    }
}

