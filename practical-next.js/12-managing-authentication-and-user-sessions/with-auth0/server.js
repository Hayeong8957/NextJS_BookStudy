const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const hostname = '10.170.170.34';
const port = 3001;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// "C:\Users\judyh\Downloads\localhost-key.pem"
const httpsOptions = {
  key: fs.readFileSync('C:/Users/judyh/Downloads/localhost-key.pem'),
  cert: fs.readFileSync('C:/Users/judyh/Downloads/localhost.pem'),
};

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://${hostname}:${port}`);
  });
});
