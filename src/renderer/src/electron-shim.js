/**
 * This file mocks Electron and Node.js APIs for the renderer when running in a normal browser.
 * It allows the app to be inspected and tested without running the full Electron process.
 */

if (typeof window.process === 'undefined' || !window.process.versions) {
    window.process = {
        ...(window.process || {}),
        versions: {
            chrome: '120.0.0.0',
            electron: '28.2.1',
            node: '18.17.1'
        },
        platform: 'browser',
        env: {}
    };
}

if (typeof window.require === 'undefined') {
    console.info('[Shim] Initializing Electron/Node mocks for browser environment.');

    window.require = (moduleName) => {
        switch (moduleName) {
            case 'electron':
                return {
                    ipcRenderer: {
                        on: (channel, listener) => {
                            console.log(`[IPC] Mock ipcRenderer.on: ${channel}`);
                        },
                        once: (channel, listener) => {
                            console.log(`[IPC] Mock ipcRenderer.once: ${channel}`);
                        },
                        send: (channel, ...args) => {
                            console.log(`[IPC] Mock ipcRenderer.send: ${channel}`, ...args);
                        },
                        removeListener: (channel, listener) => {
                            console.log(`[IPC] Mock ipcRenderer.removeListener: ${channel}`);
                        },
                        removeAllListeners: (channel) => {
                            console.log(`[IPC] Mock ipcRenderer.removeAllListeners: ${channel}`);
                        }
                    },
                    shell: {
                        openExternal: (url) => {
                            console.log(`[Shell] Mock openExternal: ${url}`);
                            window.open(url, '_blank');
                        }
                    }
                };

            case 'child_process':
                return {
                    exec: (command, callback) => {
                        console.log(`[ChildProcess] Mock exec: ${command}`);
                        if (callback) callback(null, 'Mock output', '');
                    },
                    execSync: (command) => {
                        console.log(`[ChildProcess] Mock execSync: ${command}`);
                        return 'Mock output';
                    }
                };

            case 'fs':
                return {
                    existsSync: (path) => {
                        console.log(`[FS] Mock existsSync: ${path}`);
                        return false;
                    },
                    mkdirSync: (path) => {
                        console.log(`[FS] Mock mkdirSync: ${path}`);
                    },
                    readFileSync: (path) => {
                        console.log(`[FS] Mock readFileSync: ${path}`);
                        return '';
                    },
                    readdirSync: (path) => {
                        console.log(`[FS] Mock readdirSync: ${path}`);
                        return [];
                    },
                    writeFileSync: (path, data) => {
                        console.log(`[FS] Mock writeFileSync: ${path}`);
                    },
                    unlinkSync: (path) => {
                        console.log(`[FS] Mock unlinkSync: ${path}`);
                    }
                };

            case 'path':
                return {
                    join: (...args) => args.join('/').replace(/\/+/g, '/'),
                    dirname: (p) => p.split('/').slice(0, -1).join('/') || '.',
                    basename: (p) => p.split('/').pop() || '',
                    sep: '/'
                };

            case 'os':
                return {
                    platform: () => 'browser',
                    homedir: () => '/home/browser',
                    tmpdir: () => '/tmp'
                };

            case 'react/package.json':
                return {
                    version: '18.2.0'
                };

            default:
                console.warn(`[Shim] Requested unknown module: ${moduleName}`);
                return {};
        }
    };
}
