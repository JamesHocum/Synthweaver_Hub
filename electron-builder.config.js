/**
 * Electron Builder Configuration
 * Builds desktop installers for Windows, macOS, and Linux
 */
module.exports = {
  appId: 'com.spellweaverstudio.synthweaver-hub',
  productName: 'Synthweaver Hub',
  copyright: 'Copyright © 2025-2026 Spell Weaver Studios',
  
  directories: {
    output: 'dist_electron',
    buildResources: 'electron/resources',
  },
  
  files: [
    'out/**/*',
    'electron/**/*',
    'public/icons/**/*',
    'public/images/**/*',
  ],
  
  extraMetadata: {
    main: 'electron/main.js',
  },
  
  // Windows configuration
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64', 'ia32'],
      },
      {
        target: 'portable',
        arch: ['x64'],
      },
    ],
    icon: 'public/icons/icon-512x512.png',
    publisherName: 'Spell Weaver Studios',
  },
  
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    installerIcon: 'public/icons/icon-512x512.png',
    uninstallerIcon: 'public/icons/icon-512x512.png',
    installerHeaderIcon: 'public/icons/icon-512x512.png',
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'Synthweaver Hub',
    license: 'LICENSE.md',
  },
  
  // macOS configuration
  mac: {
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64'],
      },
      {
        target: 'zip',
        arch: ['x64', 'arm64'],
      },
    ],
    icon: 'public/icons/icon-512x512.png',
    category: 'public.app-category.developer-tools',
    darkModeSupport: true,
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'electron/entitlements.mac.plist',
    entitlementsInherit: 'electron/entitlements.mac.plist',
  },
  
  dmg: {
    contents: [
      {
        x: 130,
        y: 220,
      },
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications',
      },
    ],
    window: {
      width: 540,
      height: 380,
    },
  },
  
  // Linux configuration
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64'],
      },
      {
        target: 'deb',
        arch: ['x64'],
      },
      {
        target: 'rpm',
        arch: ['x64'],
      },
      {
        target: 'snap',
        arch: ['x64'],
      },
    ],
    icon: 'public/icons',
    category: 'Development',
    maintainer: 'Spell Weaver Studios <contact@spell-weaver-studio.com>',
    vendor: 'Spell Weaver Studios',
    synopsis: 'Repository Management Reimagined',
    description: 'A next-generation repository platform combining GitHub, Hugging Face, and AI-powered development tools.',
  },
  
  snap: {
    grade: 'stable',
    confinement: 'strict',
  },
  
  // Auto-update configuration (optional)
  publish: {
    provider: 'github',
    owner: 'spell-weaver-studios',
    repo: 'synthweaver-hub',
    releaseType: 'release',
  },
};
