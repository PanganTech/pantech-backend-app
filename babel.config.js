module.exports = {
	plugins: [
		[
			'module-resolver',
			{
				alias: {
					'#root': './src',
					'#utils': './src/utils'
				}
			}
		], [
			'@babel/plugin-proposal-class-properties'
		]
	],
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 'current'
				}
			}
		]
	]
}
