import { exit } from "node:process"
import { simpleGit } from "simple-git"

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
const a = await git.pull()
console.log(a)
