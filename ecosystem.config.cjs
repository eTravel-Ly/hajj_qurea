module.exports = {
    apps: [
        {
            name: 'hajj_qurea',
            script: './server_prod.js',
            env: {
                PORT: 3000,
                NODE_ENV: 'production'
            }
        }
    ]
}