module.exports = {
  apps : [{
    name: `Bl�cher`,
    max_memory_restart: `4G`,
    script: 'index.js',
    cron_restart: "0 0 * * SUN"
  }]
};
