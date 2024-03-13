module.exports = {
  apps : [{
    name   : "back",
    script : "./dist/src/server.js",
    env_production: {
        NODE_ENV: "production"
    }
  }]
}
