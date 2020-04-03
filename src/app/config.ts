import dotenv from 'dotenv'

const result = dotenv.config();
if (result.error) {
//   throw result.error;
  console.log('FATAL ERROR: COULD NOT LOAD ENVIRONMENT VARIABLES')
  process.exit(1)
}
const { parsed: envs } = result;


module.exports = envs;