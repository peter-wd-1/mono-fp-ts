import {
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit'
import { TSGeneratorOptions } from '../types'
import { tryCatch } from '@rfiready/utils'

export const generateFilesFP = (
  tree: Tree,
  schema: TSGeneratorOptions,
  fromPath: string,
  replace: any,
) =>
  tryCatch(() =>
    generateFiles(
      tree,
      fromPath, // joinPathFragments(__dirname, '../files/'),
      readProjectConfiguration(tree, names(schema.name).fileName).root,
      replace,
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
