// NOTE: These can be easily generated with https://crontabkit.com/crontab-expression-generator

const EVERY_SECOND = '* * * * * *';

const EVERY_30_SECONDS = '*/30 * * * * *';

const EVERY_MINUTE = '* * * * * ';

const EVERY_30_MINUTES = '*/30 * * * *';

const EVERY_HOUR = '0 0 * * * *';

const schedule = {
	EVERY_SECOND,
	EVERY_30_SECONDS,
	EVERY_MINUTE,
	EVERY_30_MINUTES,
	EVERY_HOUR,
}

module.exports = schedule