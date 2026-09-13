/* Tiny static server for reviewing the build locally: node _reference/build/serve.js */
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const TYPES={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.md':'text/plain'};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]);
  if(p==='/')p='/index.html';
  const f=path.join(ROOT,p);
  if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('not found');}
  res.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
}).listen(4321,()=>console.log('http://localhost:4321'));
