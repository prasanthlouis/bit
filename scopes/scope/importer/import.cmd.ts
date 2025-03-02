import { Command, CommandOptions } from '@teambit/cli';
import chalk from 'chalk';
import { compact } from 'lodash';
import R from 'ramda';
import { WILDCARD_HELP } from '@teambit/legacy/dist/constants';
import {
  ImportOptions,
  ImportDetails,
  ImportStatus,
} from '@teambit/legacy/dist/consumer/component-ops/import-components';
import { MergeOptions, MergeStrategy } from '@teambit/legacy/dist/consumer/versions-ops/merge-version/merge-version';
import ConsumerComponent from '@teambit/legacy/dist/consumer/component/consumer-component';
import GeneralError from '@teambit/legacy/dist/error/general-error';
import { immutableUnshift } from '@teambit/legacy/dist/utils';
import { formatPlainComponentItem } from '@teambit/legacy/dist/cli/chalk-box';
import { Importer } from './importer';

export default class ImportCmd implements Command {
  name = 'import [ids...]';
  shortDescription = 'import components into your current working area';
  group = 'collaborate';
  description: string;
  alias = '';
  options = [
    ['p', 'path <path>', 'import components into a specific directory'],
    [
      'o',
      'objects',
      "import components objects only, don't write the components to the file system. This is a default behavior for import with no id",
    ],
    ['d', 'display-dependencies', 'display the imported dependencies'],
    ['O', 'override', 'override local changes'],
    ['v', 'verbose', 'showing verbose output for inspection'],
    ['j', 'json', 'return the output as JSON'],
    ['', 'conf', 'write the configuration file (component.json) of the component (harmony components only)'],
    ['', 'skip-npm-install', 'DEPRECATED. use "--skip-dependency-installation" instead'],
    ['', 'skip-dependency-installation', 'do not install packages of the imported components'],
    [
      'm',
      'merge [strategy]',
      'merge local changes with the imported version. strategy should be "theirs", "ours" or "manual"',
    ],
    ['', 'dependencies', 'EXPERIMENTAL. import all dependencies and write them to the workspace'],
    ['', 'dependents', 'EXPERIMENTAL. import component dependents to allow auto-tag updating them upon tag'],
    [
      '',
      'skip-lane',
      'EXPERIMENTAL. when checked out to a lane, do not import the component into the lane, save it on main',
    ],
    [
      '',
      'all-history',
      'relevant for fetching all components objects. avoid optimizations, fetch all history versions, always',
    ],
  ] as CommandOptions;
  loader = true;
  migration = true;
  remoteOp = true;
  _packageManagerArgs: string[]; // gets populated by yargs-adapter.handler().

  constructor(private importer: Importer, private docsDomain: string) {
    this.description = `import components into your current workspace.
https://${docsDomain}/components/importing-components
${WILDCARD_HELP('import')}`;
  }

  async report(
    [ids = []]: [string[]],
    {
      path,
      objects = false,
      displayDependencies = false,
      override = false,
      verbose = false,
      json = false,
      conf,
      skipNpmInstall = false,
      skipDependencyInstallation = false,
      merge,
      skipLane = false,
      dependencies = false,
      dependents = false,
      allHistory = false,
    }: {
      path?: string;
      objects?: boolean;
      displayDependencies?: boolean;
      override?: boolean;
      verbose?: boolean;
      json?: boolean;
      conf?: string;
      skipNpmInstall?: boolean;
      skipDependencyInstallation?: boolean;
      merge?: MergeStrategy;
      skipLane?: boolean;
      dependencies?: boolean;
      dependents?: boolean;
      allHistory?: boolean;
    }
  ): Promise<any> {
    if (objects && merge) {
      throw new GeneralError('you cant use --objects and --merge flags combined');
    }
    if (override && merge) {
      throw new GeneralError('you cant use --override and --merge flags combined');
    }
    if (!ids.length && dependencies) {
      throw new GeneralError('you have to specify ids to use "--dependencies" flag');
    }
    if (!ids.length && dependents) {
      throw new GeneralError('you have to specify ids to use "--dependents" flag');
    }
    if (skipNpmInstall) {
      // eslint-disable-next-line no-console
      console.log(
        chalk.yellow(`"--skip-npm-install" has been deprecated, please use "--skip-dependency-installation" instead`)
      );
      skipDependencyInstallation = true;
    }
    let mergeStrategy;
    if (merge && R.is(String, merge)) {
      const options = Object.keys(MergeOptions);
      if (!options.includes(merge)) {
        throw new GeneralError(`merge must be one of the following: ${options.join(', ')}`);
      }
      mergeStrategy = merge;
    }

    const importOptions: ImportOptions = {
      ids,
      verbose,
      merge: Boolean(merge),
      mergeStrategy,
      writeToPath: path,
      objectsOnly: objects,
      override,
      writeConfig: Boolean(conf),
      installNpmPackages: !skipDependencyInstallation,
      skipLane,
      importDependenciesDirectly: dependencies,
      importDependents: dependents,
      allHistory,
    };
    const importResults = await this.importer.import(importOptions, this._packageManagerArgs);
    const { importDetails } = importResults;

    if (json) {
      return JSON.stringify({ importDetails }, null, 4);
    }
    let dependenciesOutput;

    if (importResults.dependencies && !R.isEmpty(importResults.dependencies)) {
      const components = importResults.dependencies.map((d) => d.component);
      const peerDependencies = R.flatten(
        importResults.dependencies.map(R.prop('dependencies')),
        importResults.dependencies.map(R.prop('devDependencies'))
      );

      const titlePrefix =
        components.length === 1
          ? 'successfully imported one component'
          : `successfully imported ${components.length} components`;

      let upToDateCount = 0;
      const componentDependencies = components.map((component) => {
        const details = importDetails.find((c) => c.id === component.id.toStringWithoutVersion());
        if (!details) throw new Error(`missing details of component ${component.id.toString()}`);
        if (details.status === 'up to date') {
          upToDateCount += 1;
        }
        return formatPlainComponentItemWithVersions(component, details);
      });
      const upToDateStr = upToDateCount === 0 ? '' : `, ${upToDateCount} components are up to date`;
      const title = `${titlePrefix}${upToDateStr}`;
      const componentDependenciesOutput = [chalk.green(title), ...compact(componentDependencies)].join('\n');
      const peerDependenciesOutput =
        peerDependencies && !R.isEmpty(peerDependencies) && displayDependencies
          ? immutableUnshift(
              R.uniq(peerDependencies.map(formatPlainComponentItem)),
              chalk.green(`\n\nsuccessfully imported ${components.length} component dependencies`)
            ).join('\n')
          : '';

      dependenciesOutput = componentDependenciesOutput + peerDependenciesOutput;
    }

    const getImportOutput = () => {
      if (dependenciesOutput) return dependenciesOutput;
      return chalk.yellow('nothing to import');
    };

    return getImportOutput();
  }
}

function formatPlainComponentItemWithVersions(component: ConsumerComponent, importDetails: ImportDetails) {
  const status: ImportStatus = importDetails.status;
  const id = component.id.toStringWithoutVersion();
  const getVersionsOutput = () => {
    if (!importDetails.versions.length) return '';
    if (importDetails.latestVersion) {
      return `${importDetails.versions.length} new version(s) available, latest ${importDetails.latestVersion}`;
    }
    return `new versions: ${importDetails.versions.join(', ')}`;
  };
  const versions = getVersionsOutput();
  const usedVersion = status === 'added' ? `, currently used version ${component.version}` : '';
  const getConflictMessage = () => {
    if (!importDetails.filesStatus) return '';
    const conflictedFiles = Object.keys(importDetails.filesStatus) // $FlowFixMe file is set
      // @ts-ignore AUTO-ADDED-AFTER-MIGRATION-PLEASE-FIX!
      .filter((file) => importDetails.filesStatus[file] === FileStatus.manual);
    if (!conflictedFiles.length) return '';
    return `(the following files were saved with conflicts ${conflictedFiles
      .map((file) => chalk.bold(file))
      .join(', ')}) `;
  };
  const conflictMessage = getConflictMessage();
  const deprecated = importDetails.deprecated ? chalk.yellow('deprecated') : '';
  const missingDeps = importDetails.missingDeps.length
    ? chalk.red(`missing dependencies: ${importDetails.missingDeps.map((d) => d.toString()).join(', ')}`)
    : '';
  if (status === 'up to date' && !missingDeps && !deprecated && !conflictMessage) {
    return undefined;
  }
  return `- ${chalk.green(status)} ${chalk.cyan(
    id
  )} ${versions}${usedVersion} ${conflictMessage}${deprecated} ${missingDeps}`;
}
