const { ESLint } = require("eslint");
const util = require('util');
const exec = util.promisify(require("child_process").exec);

(async function main() {
  // 1. Create an instance.
  const eslint = new ESLint();

  
  await exec('git stash -k');

  // 2. Lint files.
  const results = await eslint.lintFiles(["src/**/*.js"]);

  await exec('git stash pop');

  // 3. Format the results.
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  // 4. Output it.
  for (const r of results) {
      if (r.errorCount > 0) {
          process.exitCode = 1;
          console.log('Commit reject cause by eslint error');
          break;
      }
  }
  console.log(resultText);
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
