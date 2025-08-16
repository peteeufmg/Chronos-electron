const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
    packagerConfig: {
        asar: true,
        // Este caminho já está correto. Ele pegará o .ico para Windows e o .icns para macOS.
        icon: './assets/icon',
        arch: 'x64' 
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'Chronos', 
                authors: 'Julio Teodoro', 
                description: 'Sistema de sensoriamento para a CoRA', 
                setupIcon: './assets/icon.ico' 
            }
        },
        {
            name: '@electron-forge/maker-dmg',
            config: {
                icon: './assets/icon.icns',
                name: 'Chronos Installer'
            }
        },
        // ATUALIZADO: O maker-zip agora constrói para Windows e macOS
        {
            name: '@electron-forge/maker-zip',
            platforms: ['win32', 'darwin'],
        },
        // Makers para Linux (mantidos)
        {
            name: '@electron-forge/maker-deb',
            config: {},
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {},
        },
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};