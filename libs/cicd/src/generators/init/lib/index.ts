import {
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit'
import { TSGeneratorOptions } from '../types'
import { tryCatch } from '@rfiready/utils'

export const generateFilesFP = (tree: Tree, schema: TSGeneratorOptions) =>
  tryCatch(() =>
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/'),
      readProjectConfiguration(tree, names(schema.name).fileName).root,
      // this obj is for switch placeholder in the files to the actual values.
      {},
    ),
  )

export {
  execute,
  merge,
  tryCatch,
  matchElem,
  readJsonFileFP,
  writeJsonFileFP,
} from '@rfiready/utils'
