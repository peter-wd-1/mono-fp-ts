import inquirer from 'inquirer'
import checkboxPlus from 'inquirer-checkbox-plus-prompt'

inquirer.registerPrompt('checkbox-plus', checkboxPlus)
export { inquirer }
