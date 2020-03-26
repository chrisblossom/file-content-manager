'use strict';

module.exports = {
	presets: [['@backtrack/node', { mode: 'module', syntax: 'typescript' }]],

	config: {
		eslint: {
			rules: {
				'import/no-cycle': 'off',
			},
		},
	},
};
