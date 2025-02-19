module.exports = {
  apps: [{
    name: 'feweb-fursanhris',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    env: {
      NODE_ENV: 'test',
      PORT: 3000
    }
  }]
}
