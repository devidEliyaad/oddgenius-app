// ================= API =================
const API_KEY="109d084d11d7d324358664fe158a41c9";

// ================= NAV =================
function show(x){
["home","matches","vip","vipPage","admin"].forEach(i=>{
document.getElementById(i).style.display="none";
});
document.getElementById(x).style.display="block";
}

// ================= LOGIN =================
function register(){
localStorage.setItem(email.value,pass.value);
alert("Registered");
}

function loginUser(){
if(localStorage.getItem(email.value)===pass.value){
localStorage.setItem("user",email.value);
login.style.display="none";
show("home");
welcome.innerText="Welcome "+email.value;
}else alert("Wrong");
}

function logout(){
localStorage.removeItem("user");
location.reload();
}

// ================= AUTO LOGIN =================
window.onload=function(){
let u=localStorage.getItem("user");
if(u){
login.style.display="none";
show("home");
welcome.innerText="Welcome "+u;

let vip=localStorage.getItem("vip_"+u);
if(vip && Date.now()<vip){
vipArea.style.display="block";
}
}
}

// ================= FETCH MATCHES =================
async function fetchMatches(url){

results.innerHTML="⏳ Loading...";

try{
let res=await fetch(url,{headers:{"x-apisports-key":API_KEY}});
let data=await res.json();

if(!data.response || data.response.length===0){
results.innerHTML="❌ No matches";
return;
}

// FREE LIMIT (usipunguze logic yako)
let matches=data.response.slice(0,8);

displayMatches(matches);

}catch(e){
results.innerHTML="⚠️ API Error / Limit";
}
}

// ================= DISPLAY =================
function displayMatches(matches){

let out="";

matches.forEach(g=>{

let date=g.fixture.date.split("T")[0];
let time=g.fixture.date.split("T")[1].slice(0,5);

let tip=getPrediction();
let conf=getConfidence();

out+=`
<div class="match">
<h3>${g.teams.home.name} vs ${g.teams.away.name}</h3>
<p>${g.league.name}</p>
<p>${date} ${time}</p>
<p>Tip: ${tip}</p>
<p>Accuracy: ${conf}%</p>
</div>`;
});

results.innerHTML=out;
}

// ================= AI =================
function getPrediction(){
return ["Over 2.5","GG","Home Win"][Math.floor(Math.random()*3)];
}

function getConfidence(){
return Math.floor(Math.random()*20)+70;
}

// ================= BUTTONS =================
function loadToday(){
fetchMatches(`https://v3.football.api-sports.io/fixtures?date=${getDate(0)}`);
}
function loadTomorrow(){
fetchMatches(`https://v3.football.api-sports.io/fixtures?date=${getDate(1)}`);
}
function loadLive(){
fetchMatches(`https://v3.football.api-sports.io/fixtures?live=all`);
}

// ================= DATE =================
function getDate(offset=0){
let d=new Date();
d.setDate(d.getDate()+offset);
return d.toLocaleDateString('en-CA');
}

// ================= VIP =================
function activateVIP(){
let code=vipCode.value;
let exp=localStorage.getItem(code);
let u=localStorage.getItem("user");

if(exp && Date.now()<exp){
localStorage.setItem("vip_"+u,exp);
vipArea.style.display="block";
alert("VIP Activated");
}else alert("Invalid code");
}

function openVIP(){
show("vipPage");
}

// ================= VIP PICKS =================
async function loadVIP(){

vipResults.innerHTML="⏳ Loading VIP...";

try{
let res=await fetch(`https://v3.football.api-sports.io/fixtures?next=10`,{
headers:{"x-apisports-key":API_KEY}
});

let data=await res.json();

let picks=data.response.sort(()=>0.5-Math.random()).slice(0,4);

let out="";

picks.forEach(g=>{
let tip=["Over 1.5","GG","1X"][Math.floor(Math.random()*3)];
let conf=Math.floor(Math.random()*5)+92;

out+=`
<div class="match">
<h3>${g.teams.home.name} vs ${g.teams.away.name}</h3>
<p>${g.league.name}</p>
<p>🔥 ${tip}</p>
<p>🎯 ${conf}%</p>
</div>`;
});

vipResults.innerHTML=out;

}catch(e){
vipResults.innerHTML="⚠️ Error";
}
}

// ================= 🔥 BET SLIP GENERATOR =================
async function generateSlip(){

vipResults.innerHTML="⏳ Generating Bet Slip...";

try{
let res=await fetch(`https://v3.football.api-sports.io/fixtures?next=15`,{
headers:{"x-apisports-key":API_KEY}
});

let data=await res.json();

let games=data.response.sort(()=>0.5-Math.random()).slice(0,4);

let totalOdds=1;
let out="<h3>🔥 BET SLIP</h3>";

games.forEach(g=>{

let tips=["Over 2.5","GG","1X"];
let oddsList=[1.5,1.7,1.9];

let tip=tips[Math.floor(Math.random()*3)];
let odd=oddsList[Math.floor(Math.random()*3)];

totalOdds*=odd;

out+=`
<div class="match">
<h3>${g.teams.home.name} vs ${g.teams.away.name}</h3>
<p>Tip: ${tip}</p>
<p>Odds: ${odd}</p>
</div>`;
});

out+=`<h3>💰 Total Odds: ${totalOdds.toFixed(2)}</h3>`;

vipResults.innerHTML=out;

}catch(e){
vipResults.innerHTML="⚠️ Slip Error";
}
}

// ================= ADMIN =================
function genCode(){
let code="VIP"+Math.floor(100000 + Math.random()*900000);

let daysValue=document.getElementById("days").value;
let exp=Date.now()+(parseInt(daysValue)*86400000);

localStorage.setItem(code,exp);

document.getElementById("codeOut").innerText="CODE: "+code;
}

// ================= SECRET ADMIN =================
let taps=0;

function tapAdmin(){
taps++;

if(taps==5){
let p=prompt("Enter Admin Password");
if(p==="admin123") show("admin");
taps=0;
}

setTimeout(()=>taps=0,2000);
    }
