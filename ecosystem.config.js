module.exports = {
  apps : [{
    name: `Blücher`,
    max_memory_restart: `4G`,
    script: 'index.js',
    cron_restart: "0 0 * * SUN"
  }]
};
