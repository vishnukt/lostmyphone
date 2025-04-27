const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Extract API URL from environment
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
  
  // Extract base URL
  const baseUrl = apiUrl.replace(/\/api\/?$/, '');
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: baseUrl,
      changeOrigin: true,
      secure: false,
      // Don't rewrite the path
      pathRewrite: { '^/api': '/api' },
    })
  );
}; 