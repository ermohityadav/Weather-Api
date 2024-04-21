const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homeFile =  fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal,orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}",(orgVal.main.temp));
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name );
    temperature = temperature.replace("{%temStatus%}",orgVal.weather[0].main );
    
    //temperature = temperature.replace("{%country%} ",orgVal.sys.country);
    return temperature;
}

const server = http.createServer((req,res) => {
    if(req.url === "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=jhansi&appid=4067f64a6e031f55e1ef35809a4819bd")
.on('data',  (chunk) => { 
    const objData = JSON.parse(chunk);
    const arrData = [objData];
  //console.log(arrData[0].main.temp);
  const realTimeData = arrData.map((val) => replaceVal(homeFile,val)).join("");
   // console.log(val.main);
  res.write(realTimeData);
  // console.log(realTimeData);
  
})
.on('end',  (err) => {
  if (err) return console.log('connection closed due to errors', err);
    res.end(); 
});
    }
 
});

server.listen(8000,"127.0.0.1");
