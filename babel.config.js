module.exports = {
    presets: [
        ['next/babel', {
            'preset-env': { targets: { node: 'current' } },
            'transform-runtime': {},
        }],
        '@babel/preset-typescript'
    ],
    plugins: []
}
