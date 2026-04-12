// SPDX-FileCopyrightText: Lukas Neubert
// SPDX-License-Identifier: MIT

import process from 'node:process'
import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run(): Promise<void> {
	try {
		await exec.exec('git', ['clone', 'https://github.com/bait-lang/bait.git', 'bait'])
		process.chdir('bait')

		if (process.platform === 'linux') {
			await exec.exec('./make.sh')
			await exec.exec('./bait', ['symlink'])
		} else if (process.platform === 'win32') {
			await exec.exec('./make.bat')
			core.addPath('./bait')
		} else {
			core.setFailed(`Unsupported platform: ${process.platform}`)
			return
		}

		let output = ''
		const options: exec.ExecOptions = {
			listeners: {
				stdout: (data: Buffer) => {
					output += data.toString()
				},
			},
		}

		process.chdir('..')

		// Set version output.
		await exec.exec('bait', ['version'], options)
		core.setOutput('version', output)
	} catch (error: unknown) {
		if (error instanceof Error) {
			core.setFailed(error.message)
		} else {
			core.setFailed(String(error))
		}
	}
}

void run()
