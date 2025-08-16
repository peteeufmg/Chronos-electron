const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
    packagerConfig: {
        asar: true,
        icon: './assets/icon', // Caminho para os ícones (.ico e .icns)
        arch: 'x64' 
    },
    rebuildConfig: {},
    makers: [
        // Maker para Windows (.exe)
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'Chronos', 
                authors: 'Julio Teodoro', 
                description: 'Sistema de sensoriamento para a CoRA', 
                setupIcon: './assets/icon.ico' 
            }
        },
        // Maker para macOS (.dmg)
        {
            name: '@electron-forge/maker-dmg',
            config: {
                icon: './assets/icon.icns',
                name: 'Chronos Installer'
            }
        },
        // Maker para .zip (opcional, para versões portáteis)
        {
            name: '@electron-forge/maker-zip',
            platforms: ['win32', 'darwin'],
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