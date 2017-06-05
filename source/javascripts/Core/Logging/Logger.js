/* eslint-disable no-console */
const prod = process.env.NODE_ENV === 'production';

if (prod) {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}

const logger = {};
logger.log = console.log.bind(window.console);
logger.warning = console.warn.bind(window.console);
logger.error = console.error.bind(window.console);

export default logger;
