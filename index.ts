import { exit } from "node:process"
import { simpleGit } from "simple-git"
import c from "picocolors"

const logger = {
  log: (message: string) => console.log(`ℹ️  ${message}`),
  success: (message: string) => console.log(`✅ ${message}`),
  error: (message: string) => console.error(`❌ ${message}`),
}

const git = simpleGit()

const status = await git.status()
if (!status.isClean()) {
  logger.error(
    "Current branch has uncommited changes. Please commit them before trying to create a new release."
  )
  exit(1)
}

const currentBranch = status.current
logger.log(`Detected local brach: ${c.blue(currentBranch)}`)

logger.log("Updating current branch...")
// TODO: error handling for conflict
const pullResult = await git.pull()
const changes = pullResult.summary.changes
const isBranchUpToDate = changes === 0
if (isBranchUpToDate) {
  logger.success("Branch is up to date")
} else {
  logger.success(`Pulled ${c.blue(changes)} changes from remote.`)
}
