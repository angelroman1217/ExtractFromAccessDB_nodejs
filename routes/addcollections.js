var db = "datosTest2023"
const child_process = require('child_process');

var APIs = {
  addcollections: async (req, res) => {
    var collection1 = process.cwd()+'\\collections\\estados.bson\n'
    var collection2 = process.cwd()+'\\collections\\paletaskm.bson\n'
    var com1 = 'mongorestore -d '+ db +' -c estados ' + collection1;
    var com2 = 'mongorestore -d '+ db +' -c paletaskm ' + collection2;
    try {
      child_process.spawn('cmd', ['/c', com1]);
      child_process.spawn('cmd', ['/c', com2]);
      res.json({ "result": "success" })
      res.end();
    } catch (err) {
      res.send({ "result": "error" });
      res.end();
    }
  },
}
module.exports = APIs;