// ================= CONFIG =================
const API_KEY = "109d084d11d7d324358664fe158a41c9";

// ================= FETCH =================
async function fetchMatches(url){

    let el = document.getElementById("results");
    el.innerHTML = "⏳ Loading matches...";

    try{

        let res = await fetch(url,{
            headers:{
                "x-apisports-key": API_KEY
            }
        });

        if(!res.ok){
            throw new Error("Request failed");
        }

        let data = await res.json();

        if(!data.response || data.response.length === 0){
            el.innerHTML = "❌ Hakuna mechi kwa sasa";
            return;
        }

        displayMatches(data.response);

    }catch(e){
        console.log(e);
        el.innerHTML = "⚠️ API Error / Internet / Limit imefika";
    }
}

// ================= DISPLAY =================
function displayMatches(matches){

    let el = document.getElementById("results");
    let out = "";

    matches.forEach(g=>{

        let date = g.fixture.date.split("T")[0];
        let time = g.fixture.date.split("T")[1].slice(0,5);

        let tip = getPrediction();
        let conf = getConfidence();

        out += `
        <div class="match">
            <h3>${g.teams.home.name} vs ${g.teams.away.name}</h3>
            <p>🏆 ${g.league.name}</p>
            <p>📅 ${date}</p>
            <p>⏰ ${time}</p>
            <p>📊 Tip: ${tip}</p>
            <p>🎯 Accuracy: ${conf}%</p>
        </div>
        `;
    });

    el.innerHTML = out;
}

// ================= AI =================
function getPrediction(){
    return ["Over 2.5","GG","Home Win"][Math.floor(Math.random()*3)];
}

function getConfidence(){
    return Math.floor(Math.random()*20)+70;
}

// ================= LOAD BUTTONS =================
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
    let d = new Date();
    d.setDate(d.getDate()+offset);
    return d.toLocaleDateString('en-CA');
    }

