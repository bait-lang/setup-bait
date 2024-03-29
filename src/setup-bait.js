// SPDX-FileCopyrightText: 2023-present Lukas Neubert <lukas.neubert@proton.me>
// SPDX-License-Identifier: MPL-2.0

const core = require('@actions/core')
const exec = require('@actions/exec')

async function run() {
	try {
		await exec.exec('git', ['clone', 'https://github.com/bait-lang/bait.git', 'bait'])
		process.chdir('bait')

		if (process.platform === 'linux') {
			await exec.exec('./make.sh')
			await exec.exec('./bait', ['symlink'])
		} else if (process.platform === 'win32') {
			await exec.exec('./make.bat')
			await core.addPath('./bait')
		} else {
			core.setFailed('Unsupported platform: ' + process.platform)
		}

		let output = ''
		const options = {
			listeners: {
				stdout: (data) => {
					output += data.toString()
				}
			}
		}

		process.chdir('..')

		// Set version output
		await exec.exec('bait', ['version'], options)
		core.setOutput('version', output)
		output = ''
	} catch (error) {
		core.setFailed(error.message)
	}
}

run()
