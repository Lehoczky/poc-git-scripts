import { exit } from "node:process"
import { simpleGit } from "simple-git"
import c from "picocolors"

const MAIN_BRANCH_NAME = "master"
// const RELEASE_BRANCH_NAME = "release"

const logger = createLogger()
const git = simpleGit()

const startingBranchStatus = await git.status()
const hasUncommittedChanges = !startingBranchStatus.isClean()
if (hasUncommittedChanges) {
  logger.error(
    "Current branch has uncommitted changes. Please commit them before trying to create a new release."
  )
  exit(1)
}

const startingBranchName = startingBranchStatus.current
logger.log(`Detected local brach: ${c.blue(startingBranchName)}`)

const isStartingOnMainBranch = startingBranchName === MAIN_BRANCH_NAME
if (!isStartingOnMainBranch) {
  logger.log(`Checking out ${c.blue(MAIN_BRANCH_NAME)}`)
  await git.checkoutLocalBranch(MAIN_BRANCH_NAME)
}

const mainBrachStatus = isStartingOnMainBranch
  ? startingBranchStatus
  : await git.status()

if (mainBrachStatus.behind) {
  logger.log(
    `Main branch is ${mainBrachStatus.behind} commits behind origin, updating...`
  )
  // TODO: error handling for conflict
  const pullResult = await git.pull()
  const changes = pullResult.summary.changes
  logger.success(`Pulled ${c.blue(changes)} changes from remote.`)
} else {
  logger.success("Main branch is up to date")
}

function createLogger() {
  return {
    log: (message: string) => console.log(`ℹ️  ${message}`),
    success: (message: string) => console.log(`✅ ${message}`),
    error: (message: string) => console.error(`❌ ${message}`),
  }
}
