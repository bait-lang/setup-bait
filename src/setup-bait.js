const core = require('@actions/core')
const exec = require('@actions/exec')

async function run() {
	try {
		await exec.exec('git', ['clone', 'https://github.com/tiabeast/bait.git', './bait'])

		process.chdir('./bait')
		if (process.platform === 'linux') {
			await exec.exec('./make.sh')
			await exec.exec('./bait', ['symlink'])
		} else if (process.platform === 'win32') {
			await exec.exec('make.bat')
			await exec.exec('./bait.exe', ['symlink'])
		} else {
			core.setFailed('Unsupported platform: ' + process.platform)
		}

		core.setOutput('bait-path', './bait')
		core.setOutput('version', 'x.x.x') // TODO get dynamically
	} catch (error) {
		core.setFailed(error.message)
	}
}

run()
