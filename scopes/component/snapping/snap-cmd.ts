import chalk from 'chalk';
import { IssuesClasses } from '@teambit/component-issues';
import { Command, CommandOptions } from '@teambit/cli';
import { isFeatureEnabled, BUILD_ON_CI } from '@teambit/legacy/dist/api/consumer/lib/feature-toggle';
import { WILDCARD_HELP, NOTHING_TO_SNAP_MSG, AUTO_SNAPPED_MSG } from '@teambit/legacy/dist/constants';
import { BitError } from '@teambit/bit-error';
import { SnapResults } from '@teambit/legacy/dist/api/consumer/lib/snap';
import { SnappingMain } from './snapping.main.runtime';

export class SnapCmd implements Command {
  name = 'snap [id]';
  description: string;
  alias = '';
  options = [
    ['m', 'message <message>', 'log message describing the user changes'],
    ['', 'unmodified', 'include unmodified components (by default, only new and modified components are snapped)'],
    ['', 'build', 'Harmony only. run the pipeline build and complete the tag'],
    ['', 'skip-tests', 'skip running component tests during snap process'],
    ['', 'skip-auto-snap', 'skip auto snapping dependents'],
    ['', 'disable-snap-pipeline', 'skip the snap pipeline'],
    ['', 'force-deploy', 'Harmony only. run the deploy pipeline although the build failed'],
    [
      'i',
      'ignore-issues [issues]',
      `ignore component issues (shown in "bit status" as "issues found"), issues to ignore:
[${Object.keys(IssuesClasses).join(', ')}]
to ignore multiple issues, separate them by a comma and wrap with quotes. to ignore all issues, specify "*".`,
    ],
    ['a', 'all', 'DEPRECATED (not needed anymore, it is the default now). snap all new and modified components'],
    [
      'f',
      'force',
      'DEPRECATED (use "--skip-tests" or "--unmodified" instead). force-snap even if tests are failing and even when component has not changed',
    ],
  ] as CommandOptions;
  loader = true;
  private = true;
  migration = true;

  constructor(docsDomain: string, private snapping: SnappingMain) {
    this.description = `record component changes.
https://${docsDomain}/components/snaps
${WILDCARD_HELP('snap')}`;
  }

  async report(
    [id]: string[],
    {
      message = '',
      all = false,
      force = false,
      ignoreIssues,
      build,
      skipTests = false,
      skipAutoSnap = false,
      disableSnapPipeline = false,
      forceDeploy = false,
      unmodified = false,
    }: {
      message?: string;
      all?: boolean;
      force?: boolean;
      ignoreIssues?: string;
      build?: boolean;
      skipTests?: boolean;
      skipAutoSnap?: boolean;
      disableSnapPipeline?: boolean;
      forceDeploy?: boolean;
      unmodified?: boolean;
    }
  ) {
    build = isFeatureEnabled(BUILD_ON_CI) ? Boolean(build) : true;
    const disableTagAndSnapPipelines = disableSnapPipeline;
    if (disableTagAndSnapPipelines && forceDeploy) {
      throw new BitError('you can use either force-deploy or disable-snap-pipeline, but not both');
    }
    if (all) {
      // eslint-disable-next-line no-console
      console.warn(
        chalk.yellow(
          `--all is deprecated, please omit it. "bit snap" by default will snap all new and modified components`
        )
      );
    }
    if (force) {
      // eslint-disable-next-line no-console
      console.warn(
        chalk.yellow(`--force is deprecated, use either --skip-tests or --unmodified depending on the use case`)
      );
      if (id) unmodified = true;
    }

    const results = await this.snapping.snap({
      id,
      message,
      ignoreIssues,
      build,
      skipTests,
      skipAutoSnap,
      disableTagAndSnapPipelines,
      forceDeploy,
      unmodified,
    });

    if (!results) return chalk.yellow(NOTHING_TO_SNAP_MSG);
    const { snappedComponents, autoSnappedResults, warnings, newComponents, laneName }: SnapResults = results;
    const changedComponents = snappedComponents.filter(
      (component) => !newComponents.searchWithoutVersion(component.id)
    );
    const addedComponents = snappedComponents.filter((component) => newComponents.searchWithoutVersion(component.id));
    const autoTaggedCount = autoSnappedResults ? autoSnappedResults.length : 0;

    const warningsOutput = warnings && warnings.length ? `${chalk.yellow(warnings.join('\n'))}\n\n` : '';
    const tagExplanation = `\n(use "bit export" to push these components to a remote")
(use "bit untag" to unstage versions)\n`;

    const outputComponents = (comps) => {
      return comps
        .map((component) => {
          let componentOutput = `     > ${component.id.toString()}`;
          const autoTag = autoSnappedResults.filter((result) =>
            result.triggeredBy.searchWithoutScopeAndVersion(component.id)
          );
          if (autoTag.length) {
            const autoTagComp = autoTag.map((a) => a.component.id.toString());
            componentOutput += `\n       ${AUTO_SNAPPED_MSG}: ${autoTagComp.join(', ')}`;
          }
          return componentOutput;
        })
        .join('\n');
    };

    const outputIfExists = (label, explanation, components) => {
      if (!components.length) return '';
      return `\n${chalk.underline(label)}\n(${explanation})\n${outputComponents(components)}\n`;
    };
    const laneStr = laneName ? ` on "${laneName}" lane` : '';

    return (
      warningsOutput +
      chalk.green(`${snappedComponents.length + autoTaggedCount} component(s) snapped${laneStr}`) +
      tagExplanation +
      outputIfExists('new components', 'first version for components', addedComponents) +
      outputIfExists('changed components', 'components that got a version bump', changedComponents)
    );
  }
}
