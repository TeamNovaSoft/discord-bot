require('dotenv').config();

/**
 * Converts a status key to its cron expression using the configurations from .env.
 * @param {string} statusKey - Status key (e.g., 'request-review', 'merged-in-staging').
 * @returns {string} - Corresponding cron expression.
 */
const convertMsToCron = (statusKey) => {
  const cronConfig = {
    'pr-request-review': process.env.REQUEST_REVIEW_CRON || '0 7 * * *',
    'pr-merged-on-staging': process.env.MERGED_IN_STAGING_CRON || '0 7 * * 1',
    'pr-request-changes': process.env.REQUEST_CHANGES_CRON || '0 */8 * * *',
  };

  return cronConfig[statusKey] || cronConfig['request-review'];
};

module.exports = { convertMsToCron };
