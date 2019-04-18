const db = require('./db');
const jsonServer=require('json-server')
const server=jsonServer.create()
const middlewares =jsonServer.defaults()
server.use(middlewares);
// server.use(router)
// server.use(jsonServer.rewriter({
//     '/APPQUERYMCHLIST': '/APPQUERYMCHLIST',
//   }))
// const router = jsonServer.router(db)
server.use(jsonServer.bodyParser);
// server.post('/metapi/rmi.do',(req,res)=>{
//    console.log(req)
//    res.send(require('./data/mercList.json'))
// })
server.post('/metapi/rmi.do',(req,res)=>{
  let {body:{PRCCOD}}=req
  switch(PRCCOD){
    case 'APPQUERYMCHLIST':
    res.send(require('./data/mercList.json'));
    break;
    case 'APPQUERYMCHINF':
    console.log('APPQUERYMCHINF')
    res.send(require('./data/itemInfo.json'))
    break;
    case 'APPQUERYBEFDTL':
    res.send(require('./data/detail.json'));
    break;
    default:res.send({"RTNCOD": "ERRMSG","ERRMSG": "未识别command"});
    break;
  }
  
})
server.listen(3000, () => {     
    console.log('JSON Server is running at 3000');
});