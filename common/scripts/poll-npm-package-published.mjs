import { get } from "https";
import process from "process";

/**
 * Script that polls the npm registry to see if a @azure/communication-react package version published.
 * By default, it polls on short intervals (5 seconds) and times out after a longer interval (15 minutes).
 *
 * @params {string} version - the version to check for
 *
 * @example node ./poll-npm-package-published.js 1.3.0
 */

const POLL_INTERVAL_MS = 30000; // 30 seconds in milliseconds
const TIMEOUT_TIME_MS = 60 * 60 * 1000; // 60 minutes in milliseconds
const GET_REQUEST_TIMEOUT_MS = 5000;

const GET_REQUEST_OPTIONS = {
  hostname: 'registry.npmjs.org',
  timeout: GET_REQUEST_TIMEOUT_MS
}

const checkNpm = (packageName, packageVersion) => {
  return new Promise((resolve, reject) => {
    const request = get({...GET_REQUEST_OPTIONS, path: `/${packageName}/${packageVersion}`}, (response) => {
      resolve(response);
    });
    console.log(`Pinging: https://${GET_REQUEST_OPTIONS.hostname}/${packageName}/${packageVersion}`);
    request.end();
  });
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const main = async () => {
  const packageVersion = process.argv[2];
  const packageName = `@azure/communication-react`
  const startTime = new Date();
  while((new Date() - startTime) > TIMEOUT_TIME_MS) {
    try {
      const response = await checkNpm(packageName, packageVersion);
      console.log('responseCode: ', response.statusCode);

      if (response.statusCode === 200) {
        console.log("Successfully found npm package")
        process.exit(0);
      }
    } catch (error) {
      console.error('Error: ', error);
    }

    console.log('Sleeping for a bit...');
    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error('Failed to find package on the npm registry');
};

await main();
