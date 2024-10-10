import * as fs from "fs"
import * as path from "path"

// Start from the "app" folder in the current working directory
const appDirectory = path.join(process.cwd(), "app")
// Generate the output path inside the "app" folder
const outputFilePath = path.join(appDirectory, "structure.txt")

console.log(`Current directory: ${process.cwd()}`)
console.log(`App directory: ${appDirectory}`)
console.log(`Output file will be generated at: ${outputFilePath}`)

// Folders to exclude
const excludeFolders = ["amplify", "node_modules", "android", "ios", "dist", "plugins", "test"]

/**
 * Generates the directory structure recursively.
 *
 * @param {string} dir - The directory to start generating structure from.
 * @param {number} depth - The current depth of recursion.
 * @param {number} maxDepth - The maximum depth to recurse into.
 * @returns {string[]} The formatted structure with indentation.
 */
function generateDirectoryStructure(
  dir: string,
  depth: number = 0,
  maxDepth: number = 10, // Fixed depth limit of 10
): string[] {
  const result: string[] = []

  // If depth exceeds max depth, stop
  if (depth > maxDepth) return result

  const items = fs.readdirSync(dir)

  items.forEach((item) => {
    const fullPath = path.join(dir, item)
    const isDirectory = fs.lstatSync(fullPath).isDirectory()

    // Exclude specific folders
    if (excludeFolders.some((folder) => fullPath.includes(folder))) {
      return // Skip excluded folders
    }

    // Add the current item to the result
    result.push(`${" ".repeat(depth * 2)}├── ${item}`)

    if (isDirectory) {
      // Recursively add nested directories if it's a folder
      const nestedFiles = generateDirectoryStructure(fullPath, depth + 1, maxDepth)
      result.push(...nestedFiles)
    }
  })

  return result
}

// Check if the app directory exists before generating the structure
if (fs.existsSync(appDirectory)) {
  let structure: string[] = []

  // Add header comment for the app directory
  structure.push(
    `/*\n * Directory: app\n * This directory contains the files and subdirectories for the app folder.\n */`,
  )
  structure.push("app")

  // Generate the directory structure recursively starting from the app folder
  structure.push(...generateDirectoryStructure(appDirectory))

  // Write the structure to the output file in the "app" directory
  try {
    fs.writeFileSync(outputFilePath, structure.join("\n"))
    console.log(`Folder structure saved to ${outputFilePath}`)
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error writing the file: ${err.message}`)
    } else {
      console.error(`Error writing the file: ${err}`)
    }
  }
} else {
  console.error(`The directory "app" does not exist.`)
}
