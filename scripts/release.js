const semver = require('semver');
const execa = require('execa');
const chalk = require('chalk');

const fs = require('fs');
var argv = require('yargs/yargs')(process.argv.slice(2))
  .alias('h', 'help')
  .help('help')
  .usage('Usage: node ./scripts/release.js')

  .alias('r', 'release')
  .describe('r', 'Release type')
  .choices('r', ['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease'])

  .alias('m', 'message')
  .describe('m', 'git tag message')
  .string('m')

  .demandOption(['r', 'm'])
  .showHelpOnFail(false, 'Specify --help for available options').argv;

const release = argv.release;
const message = argv.message;

console.log('RELEASE_TYPE: ', release);

const PACKAGE_JSON = './package.json';
const MANIFEST_JSON = './src/manifest.json';

let rawPackage = fs.readFileSync(PACKAGE_JSON);
let packageJson = JSON.parse(rawPackage);
if (!packageJson.version) {
  throw new Error(`Invalid existing version in '${PACKAGE_JSON}'`);
}

const currentVersion = semver.valid(semver.clean(packageJson.version));
const nextVersion = semver.inc(currentVersion, release, release);
packageJson.version = nextVersion;
fs.writeFile(PACKAGE_JSON, JSON.stringify(packageJson, null, 2), function (err) {
  if (err) return console.log(err);
  console.log(`Done writing '${PACKAGE_JSON}'`);
});

const included_commit_files = [PACKAGE_JSON, MANIFEST_JSON, './extension.zip'].map((file) => `'${file}'`).join(' ');

(async () => {
  console.log(chalk.yellow('---------------Packing chrome extension to extension.zip --------------'));
  const { stdout } = await execa(
    `
    yarn build:zip;
    git add ${included_commit_files};
    git commit -m "v${nextVersion}: ${message}";
    git push origin master;
    git tag -a "v${nextVersion}" -m "${message}";
    git push --tags;
    git tag -n5;
  `,
    { shell: true },
  );
  console.log(stdout);
})();
