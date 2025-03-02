import cliSpinners from 'cli-spinners';
import os from 'os';
import * as path from 'path';
import format from 'string-format';

import { PathOsBased } from './utils/path';

const userHome = require('user-home');
const packageFile = require('../package.json');

export const IS_WINDOWS = os.platform() === 'win32';

function getDirectory(): PathOsBased {
  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    return path.join(process.env.LOCALAPPDATA, 'Bit');
  }

  return path.join(userHome, '.bit');
}

export const CACHE_GLOBALS_ENV = 'BIT_GLOBALS_DIR';

function getCacheDirectory(): PathOsBased {
  const fromEnvVar = process.env[CACHE_GLOBALS_ENV];
  if (fromEnvVar && typeof fromEnvVar === 'string') {
    return fromEnvVar;
  }
  if (process.platform === 'darwin' || process.platform === 'linux') {
    return path.join(userHome, 'Library', 'Caches', 'Bit');
  }

  return getDirectory();
}

export const BIT_USAGE = '[--version] [--help] <command> [<args>]';

export const BITS_DIRNAME = 'components';

export const BIT_JSON = 'bit.json';

export const WORKSPACE_JSONC = 'workspace.jsonc';

export const GIT_IGNORE = '.gitignore';

export const BIT_MAP = '.bitmap';

export const OLD_BIT_MAP = '.bit.map.json';

// Hack to prevent reference from constants to component map
type origins = 'IMPORTED' | 'AUTHORED' | 'NESTED';

export const COMPONENT_ORIGINS = {
  IMPORTED: 'IMPORTED' as origins,
  AUTHORED: 'AUTHORED' as origins,
  NESTED: 'NESTED' as origins,
};

export const TESTS_FORK_LEVEL = {
  NONE: 'NONE',
  ONE: 'ONE',
  COMPONENT: 'COMPONENT',
};

export const REPO_NAME = 'teambit/bit';

export const DEFAULT_INDEX_NAME = 'index';

export const DEFAULT_INDEX_EXTS = ['js', 'ts', 'jsx', 'tsx', 'css', 'scss', 'less', 'sass'];

export const SUPPORTED_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.less', '.sass', '.vue', '.styl'];

export const NO_PLUGIN_TYPE = 'none';

export const DEFAULT_COMPILER_ID = NO_PLUGIN_TYPE;

export const DEFAULT_TESTER_ID = NO_PLUGIN_TYPE;

export const DEFAULT_PACKAGE_MANAGER = 'npm';

export const DEFAULT_HARMONY_PACKAGE_MANAGER = 'teambit.dependencies/pnpm';

export const DEFAULT_EXTENSIONS = {};

export const DEFAULT_DIST_DIRNAME = 'dist';

export const DEFAULT_BUNDLE_FILENAME = 'dist.js';

export const DEFAULT_BIT_VERSION = '0.0.1';

export const DEFAULT_BIT_RELEASE_TYPE = 'patch'; // release type of semver (patch, minor, major)

export const DEFAULT_LANGUAGE = 'javascript';

export const DEFAULT_BINDINGS_PREFIX = '@bit';

export const NODE_PATH_COMPONENT_SEPARATOR = '.';

export const DEFAULT_COMPONENTS_DIR_PATH = `${BITS_DIRNAME}/{name}`;

export const DEFAULT_DIR_DEPENDENCIES = '.dependencies';

export const DEFAULT_DEPENDENCIES_DIR_PATH = `${BITS_DIRNAME}/${DEFAULT_DIR_DEPENDENCIES}`;

export const COMPONENT_DIR = 'COMPONENT_DIR';

export const DEFAULT_SAVE_DEPENDENCIES_AS_COMPONENTS = false;

export const DEFAULT_SEPARATOR = '/';

export const LATEST_BIT_VERSION = 'latest';

export const OBJECTS_DIR = 'objects';

export const PENDING_OBJECTS_DIR = 'pending-objects';

export const REMOTE_REFS_DIR = path.join('refs', 'remotes');

export const WORKSPACE_LANES_DIR = path.join('workspace', 'lanes');

export const NULL_BYTE = '\u0000';

export const SPACE_DELIMITER = ' ';

export const VERSION_DELIMITER = '@';

export const DEPENDENCIES_DIR = 'dependencies';

export const DEFAULT_REMOTES = {};

export const DEFAULT_DEPENDENCIES = {};

export const SPINNER_TYPE = IS_WINDOWS ? cliSpinners.dots : cliSpinners.dots12;

/**
 * URLS
 */

/**
 * @deprecated use 'BASE_CLOUD_DOMAIN' or 'BASE_COMMUNITY_DOMAIN'
 */
export const BASE_WEB_DOMAIN = 'bit.dev';

export const BASE_CLOUD_DOMAIN = 'bit.cloud';

export const BASE_COMMUNITY_DOMAIN = 'bit.dev';

export const PREVIOUSLY_BASE_WEB_DOMAIN = 'bitsrc.io';

export const DEFAULT_HUB_DOMAIN = `hub.${BASE_CLOUD_DOMAIN}`;

export const SYMPHONY_URL = `symphony.${BASE_CLOUD_DOMAIN}`;

export const SYMPHONY_GRAPHQL = `http://${SYMPHONY_URL}/graphql`;

export const BASE_DOCS_DOMAIN = `${BASE_COMMUNITY_DOMAIN}/docs`;

export const BASE_LEGACY_DOCS_DOMAIN = `legacy-docs.${BASE_COMMUNITY_DOMAIN}/docs`;

export const DEFAULT_HUB_LOGIN = `https://${BASE_CLOUD_DOMAIN}/bit-login`;

export const DEFAULT_ANALYTICS_DOMAIN = `https://analytics.${BASE_CLOUD_DOMAIN}/`;

export const SEARCH_DOMAIN = `api.${BASE_CLOUD_DOMAIN}`;

export const RELEASE_SERVER = `https://api.${BASE_CLOUD_DOMAIN}/release`;

export const DEFAULT_REGISTRY_URL = `https://node.bit.cloud`;

export const PREVIOUSLY_DEFAULT_REGISTRY_URL = `https://node.${PREVIOUSLY_BASE_WEB_DOMAIN}`;

export const CENTRAL_BIT_HUB_URL = `https://${SYMPHONY_URL}/exporter`;

export const CENTRAL_BIT_HUB_NAME = 'bit.cloud';

// END URLS

export const DEFAULT_REGISTRY_DOMAIN_PREFIX = '@bit';

export const DEFAULT_SSH_KEY_FILE = `${userHome}/.ssh/id_rsa`;

export const DEFAULT_BIT_ENV = 'production';

// Setting this to 99999 to prevent this issue:
// https://github.com/mscdex/ssh2/issues/142
export const DEFAULT_SSH_READY_TIMEOUT = 99999;

export const IGNORE_LIST = [
  '**/.bit.map.json',
  '**/.bitmap',
  '**/.gitignore',
  '**/bit.json',
  '**/component.json',
  '**/bitBindings.js',
  '**/node_modules/**',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/LICENSE',
];

export const AUTO_GENERATED_STAMP = 'BIT-AUTO-GENERATED';
export const AUTO_GENERATED_MSG = `/* THIS IS A ${AUTO_GENERATED_STAMP} FILE. DO NOT EDIT THIS FILE DIRECTLY. */\n\n`;
export const BITMAP_PREFIX_MESSAGE = `/**
 * The Bitmap file is an auto generated file used by Bit to track all your Bit components. It maps the component to a folder in your file system.
 * This file should be committed to VCS(version control).
 * Components are listed using their component ID (https://${BASE_DOCS_DOMAIN}/components/component-id).
 * If you want to delete components you can use the "bit remove <component-id>" command.
 * See the docs (https://${BASE_DOCS_DOMAIN}/components/removing-components) for more information, or use "bit remove --help".
 */\n\n`;

export const BIT_DESCRIPTION =
  'bit is a free and open source tool designed for easy use, maintenance and discovery of code components.';

/**
 * bit commands
 */
export const INIT_COMMAND = 'init';

export const ENV_VARIABLE_CONFIG_PREFIX = 'BIT_CONFIG_';
/**
 * bit global config keys
 */
export const CFG_USER_EMAIL_KEY = 'user.email';

export const CFG_USER_TOKEN_KEY = 'user.token';

export const CFG_USER_NAME_KEY = 'user.name';

export const CFG_REGISTRY_URL_KEY = 'registry';

export const CFG_SSH_KEY_FILE_KEY = 'ssh_key_file';

export const CFG_HUB_DOMAIN_KEY = 'hub_domain';

export const CFG_SYMPHONY_URL_KEY = 'symphony_url';

export const CFG_HUB_LOGIN_KEY = 'hub_domain_login';

export const CFG_ANALYTICS_DOMAIN_KEY = 'analytics_domain';

export const CFG_ANALYTICS_ANONYMOUS_KEY = 'anonymous_reporting';

export const CFG_REPOSITORY_REPORTING_KEY = 'repository_reporting';

export const CFG_ANALYTICS_REPORTING_KEY = 'analytics_reporting';

export const CFG_ANALYTICS_ERROR_REPORTS_KEY = 'error_reporting';

export const CFG_ANALYTICS_ENVIRONMENT_KEY = 'bit_environment';

export const CFG_ANALYTICS_USERID_KEY = 'analytics_id';

export const CFG_REGISTRY_DOMAIN_PREFIX = 'registry_domain_prefix';

export const CFG_POST_EXPORT_HOOK_KEY = 'post_export_hook';

export const CFG_POST_IMPORT_HOOK_KEY = 'post_import_hook';

export const CFG_CI_FUNCTION_PATH_KEY = 'ci_function_path';

export const CFG_CI_ENABLE_KEY = 'ci_enable';

export const CFG_GIT_EXECUTABLE_PATH = 'git_path';

export const CFG_LOG_JSON_FORMAT = 'log_json_format';

export const CFG_LOG_LEVEL = 'log_level';

export const CFG_NO_WARNINGS = 'no_warnings';

export const CFG_INTERACTIVE = 'interactive';

// Template for interactive config for specific command like interactive.init
export const CFG_COMMAND_INTERACTIVE_TEMPLATE = 'interactive.{commandName}';

export const CFG_INIT_INTERACTIVE = format(CFG_COMMAND_INTERACTIVE_TEMPLATE, { commandName: INIT_COMMAND });

export const CFG_SSH_NO_COMPRESS = 'ssh_no_compress';

export const CFG_FEATURE_TOGGLE = 'features';

export const CFG_PACKAGE_MANAGER_CACHE = 'package-manager.cache';

export const CFG_CAPSULES_ROOT_BASE_DIR = 'capsules_root_base_dir';

export const CFG_PROXY = 'proxy';
export const CFG_HTTPS_PROXY = 'https_proxy';
export const CFG_PROXY_CA = 'proxy.ca';
export const CFG_PROXY_STRICT_SSL = 'proxy.strict_ssl';
export const CFG_PROXY_CERT = 'proxy.cert';
export const CFG_PROXY_KEY = 'proxy.key';
export const CFG_PROXY_NO_PROXY = 'proxy.no_proxy';

export const CFG_FETCH_RETRIES = 'network.fetch_retries';
export const CFG_FETCH_RETRY_FACTOR = 'network.fetch_retry_factor';
export const CFG_FETCH_RETRY_MINTIMEOUT = 'network.fetch_retry_mintimeout';
export const CFG_FETCH_RETRY_MAXTIMEOUT = 'network.fetch_retry_maxtimeout';
export const CFG_FETCH_TIMEOUT = 'network.fetch_timeout';
export const CFG_LOCAL_ADDRESS = 'network.local_address';
export const CFG_MAX_SOCKETS = 'network.max_sockets';
export const CFG_NETWORK_CONCURRENCY = 'network.concurrency';

export const CFG_CONCURRENCY_IO = 'concurrency.io';
export const CFG_CONCURRENCY_COMPONENTS = 'concurrency.components';
export const CFG_CONCURRENCY_FETCH = 'concurrency.fetch';

export const CFG_CACHE_MAX_ITEMS_COMPONENTS = 'cache.max.components';
export const CFG_CACHE_MAX_ITEMS_OBJECTS = 'cache.max.objects';

/**
 * git hooks
 */
export const POST_CHECKOUT = 'post-checkout';

export const POST_MERGE = 'post-merge';

export const GIT_HOOKS_NAMES = [POST_CHECKOUT, POST_MERGE];

/**
 * bit hooks
 */
export const PRE_TAG_HOOK = 'pre-tag';

export const POST_TAG_HOOK = 'post-tag';

export const POST_ADD_HOOK = 'post-add';

export const PRE_TAG_ALL_HOOK = 'pre-tag-all';

export const POST_TAG_ALL_HOOK = 'post-tag-all';

export const PRE_IMPORT_HOOK = 'pre-import';

export const POST_IMPORT_HOOK = 'post-import';

export const PRE_EXPORT_HOOK = 'pre-export';

export const POST_EXPORT_HOOK = 'post-export';

export const PRE_SEND_OBJECTS = 'pre-send-objects'; // pre-fetch

export const POST_SEND_OBJECTS = 'post-send-objects'; // post-fetch

export const PRE_RECEIVE_OBJECTS = 'pre-receive-objects'; // pre-put

export const POST_RECEIVE_OBJECTS = 'post-receive-objects'; // post-put

export const PRE_DEPRECATE_REMOTE = 'pre-deprecate-remote';

export const PRE_UNDEPRECATE_REMOTE = 'pre-undeprecate-remote';

export const POST_DEPRECATE_REMOTE = 'post-deprecate-remote';

export const POST_UNDEPRECATE_REMOTE = 'post-undeprecate-remote';

export const PRE_REMOVE_REMOTE = 'pre-remove-remote';

export const POST_REMOVE_REMOTE = 'post-remove-remote';

export const HOOKS_NAMES = [
  PRE_TAG_HOOK,
  POST_TAG_HOOK,
  POST_ADD_HOOK,
  PRE_TAG_ALL_HOOK,
  POST_TAG_ALL_HOOK,
  PRE_IMPORT_HOOK,
  POST_IMPORT_HOOK,
  PRE_EXPORT_HOOK,
  POST_EXPORT_HOOK,
  PRE_SEND_OBJECTS,
  POST_SEND_OBJECTS,
  PRE_RECEIVE_OBJECTS,
  POST_RECEIVE_OBJECTS,
  PRE_DEPRECATE_REMOTE,
  PRE_UNDEPRECATE_REMOTE,
  POST_DEPRECATE_REMOTE,
  POST_UNDEPRECATE_REMOTE,
  PRE_REMOVE_REMOTE,
  POST_REMOVE_REMOTE,
];

/**
 * cache root directory
 */
export const CACHE_ROOT = getCacheDirectory();

/**
 * global config directories
 */
export const GLOBAL_CONFIG: PathOsBased = path.join(CACHE_ROOT, 'config');

export const GLOBAL_LOGS: PathOsBased = path.join(CACHE_ROOT, 'logs');

export const GLOBAL_SCOPE: PathOsBased = path.join(CACHE_ROOT, 'scope');

export const GLOBAL_CONFIG_FILE = 'config.json';

export const GLOBAL_REMOTES = 'global-remotes.json';

export const BIT_HIDDEN_DIR = '.bit';

export const BIT_GIT_DIR = 'bit';

export const DOT_GIT_DIR = '.git';

/**
 * bit registry default URL.
 */
export const BIT_REGISTRY = '';

export const LATEST = 'latest';

export const DEPENDENCY_DELIMITER = '/';

export const BIT_SOURCES_DIRNAME = 'source';

export const BIT_TMP_DIRNAME = 'tmp';

export const BIT_WORKSPACE_TMP_DIRNAME = '.bitTmp';

export const BIT_CACHE_DIRNAME = 'cache';

export const SUB_DIRECTORIES_GLOB_PATTERN = '/**/*';

export const SCOPE_JSON = 'scope.json';
export const SCOPE_JSONC = 'scope.jsonc';

export const DEFAULT_RESOLVER = () => '';

/**
 * current bit application version
 */
export const BIT_VERSION = packageFile.version;

export const BIT_INSTALL_METHOD = packageFile.installationMethod;

export const TOKEN_FLAG_NAME = 'token';

export const TOKEN_FLAG = `${TOKEN_FLAG_NAME} <${TOKEN_FLAG_NAME}>`;

export const LICENSE_FILENAME = 'LICENSE';

export const ISOLATED_ENV_ROOT = 'environment';

export const NODE_PATH_SEPARATOR = process.platform === 'win32' ? ';' : ':'; // see here https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders

export const WRAPPER_DIR = 'bit_wrapper_dir';

export const PACKAGE_JSON = 'package.json';

export const COMPONENT_CONFIG_FILE_NAME = 'component.json';

export const COMPILER_ENV_TYPE = 'compiler';

export const TESTER_ENV_TYPE = 'tester';

export const DEBUG_LOG: PathOsBased = path.join(GLOBAL_LOGS, 'debug.log');

export const MANUALLY_REMOVE_DEPENDENCY = '-';

export const MANUALLY_REMOVE_ENVIRONMENT = '-';

export const MANUALLY_ADD_DEPENDENCY = '+';

export const OVERRIDE_FILE_PREFIX = 'file://';

export const OVERRIDE_COMPONENT_PREFIX = '@bit/';

export const ACCEPTABLE_NPM_VERSIONS = '>=5.0.0';

export const ANGULAR_PACKAGE_IDENTIFIER = '@angular/core';

export const ANGULAR_BIT_ENTRY_POINT_FILE = ['public-api.ts', 'public_api.ts'];

export const COMPONENT_DIST_PATH_TEMPLATE = '{COMPONENT_DIST_PATH}';

export const WILDCARD_HELP = (command: string) =>
  `you can use a pattern for multiple ids, such as bit ${command} "utils/*". (wrap the pattern with quotes to avoid collision with shell commands)`;

export const PATTERN_HELP = (command: string) =>
  `you can use a \`<pattern>\` for multiple component ids, such as \`bit ${command} "org.scope/utils/**"\`. use comma to separate patterns and "!" to exclude. e.g. "ui/**, !ui/button"
always wrap the pattern with quotes to avoid collision with shell commands.
to validate the pattern before running this command, run \`bit pattern <pattern>\`.
`;

export const CURRENT_UPSTREAM = 'current';

export const DEPENDENCIES_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies'];

export const HASH_SIZE = 40;

// @todo: decide how the delimiter should look like
export const LANE_REMOTE_DELIMITER = '/';

export const DEFAULT_LANE = 'main';

export const PREVIOUS_DEFAULT_LANE = 'master';

export const statusInvalidComponentsMsg = 'invalid components';
export const statusFailureMsg = 'issues found';
export const statusWorkspaceIsCleanMsg =
  'nothing to tag or export (use "bit add <file...>" to track files or directories as components)';

// todo: move the following two lines to the watch extension once its e2e moved to the extension dir
export const STARTED_WATCHING_MSG = 'started watching for component changes to rebuild';
export const WATCHER_COMPLETED_MSG = 'watching for changes';

export const NOTHING_TO_SNAP_MSG = 'nothing to snap';
export const AUTO_SNAPPED_MSG = 'auto-snapped dependents';

export const IMPORT_PENDING_MSG =
  'your workspace has outdated objects. please use "bit import" to pull the latest objects from the remote scope';

export enum Extensions {
  dependencyResolver = 'teambit.dependencies/dependency-resolver',
  pkg = 'teambit.pkg/pkg',
  compiler = 'teambit.compilation/compiler',
  envs = 'teambit.envs/envs',
  builder = 'teambit.pipelines/builder',
  deprecation = 'teambit.component/deprecation',
  forking = 'teambit.component/forking',
  renaming = 'teambit.component/renaming',
}

export enum BuildStatus {
  Pending = 'pending',
  Failed = 'failed',
  Succeed = 'succeed',
}

export const SOURCE_DIR_SYMLINK_TO_NM = '_src'; // symlink from node_modules to the workspace sources files
