import { execSync, exec, spawn } from 'child_process';

function awaitTime(time = 500) {
    return new Promise(r => setTimeout(() => {
        r(1)
    }, time))
}

function linkGlobal() {
    return {
        name: 'linkGlobal',
        buildEnd: async () => {
            console.log(`build end`);
            setTimeout(async () => {
                execSync('npm unlink -g && echo unlink', { stdio: 'inherit' });
                await awaitTime(800)
                execSync('npm link && echo link', { stdio: 'inherit' });
            }, 400);
        }
    }
}

export default linkGlobal;
