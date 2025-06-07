import { exit } from "node:process"
import { simpleGit } from "simple-git"

// dummy
// dummy

const git = simpleGit()

const status = await git.status()
if (!status.isClean()) {
  console.log(
    "Current branch has uncommited changes. Please commit them before trying to create a new release."
  )
  exit(1)
}

const currentBranch = status.current
console.log(`Detected local brach: ${currentBranch}`)

console.log("Updating current branch...")
// TODO: error handling for conflict
const pullResult = await git.pull()
const changes = pullResult.summary.changes
const isBranchUpToDate = changes === 0
if (isBranchUpToDate) {
  console.log("Branch is up to date")
} else {
  console.log(`Pulled ${changes} changes from remote.`)
}
