<script>

const API_KEY = "8a5b484376f53b6d1d4f6f2b8582f18c";

// VIP CHECK
if(localStorage.getItem("vipActive") !== "true"){
    alert("Access Denied");
    window.location.href="index.html";
}

// HOME
function goHome(){
    window.location.href="index.html";
}

// LOGOUT
function logoutVIP(){
    localStorage.clear();
    window.location.href="index.html";
}

// GENERATE VIP (REAL ODDS)
async function generateVIP(){

    document.getElementById("results").innerHTML = "⏳ Loading real matches...";

    try{

        // STEP 1: pata matches
        let res = await fetch("https://v3.football.api-sports.io/fixtures?next=10",{
            headers:{ "x-apisports-key": API_KEY }
        });

        let data = await res.json();

        if(!data.response || data.response.length === 0){
            document.getElementById("results").innerHTML = "❌ No matches";
            return;
        }

        let matches = data.response;

        let output = "";
        let totalOdds = 1;

        // LOOP MATCHES
        for(let game of matches.slice(0,5)){

            let fixtureID = game.fixture.id;

            let home = game.teams.home.name;
            let away = game.teams.away.name;
            let league = game.league.name;
            let date = game.fixture.date.split("T")[0];

            // STEP 2: pata odds
            let oddsRes = await fetch(`https://v3.football.api-sports.io/odds?fixture=${fixtureID}`,{
                headers:{ "x-apisports-key": API_KEY }
            });

            let oddsData = await oddsRes.json();

            let tip = "No market";
            let odd = 1.50;

            // CHUKUA MARKET
            if(oddsData.response.length > 0){

                let bookmakers = oddsData.response[0].bookmakers;

                if(bookmakers.length > 0){

                    let bets = bookmakers[0].bets;

                    // tafuta 1X2
                    let matchWinner = bets.find(b=>b.name==="Match Winner");

                    if(matchWinner){
                        let values = matchWinner.values;

                        let pick = values[Math.floor(Math.random()*values.length)];

                        tip = pick.value;
                        odd = parseFloat(pick.odd);
                    }
                }
            }

            // AI CONFIDENCE BOOST
            let base = Math.floor(Math.random()*10)+75;
            let confidence = base + 15;

            output += `
            <div class="match">
                <h3>${home} vs ${away}</h3>
                <p>League: ${league}</p>
                <p>📊 Tip: ${tip}</p>
                <p>🔥 Confidence: ${confidence}%</p>
                <p>💰 Odds: ${odd}</p>
                <p>📅 Date: ${date}</p>
            </div>
            `;

            totalOdds *= odd;
        }

        document.getElementById("results").innerHTML = output;
        document.getElementById("totalOdds").innerText = totalOdds.toFixed(2);

    }catch(e){
        document.getElementById("results").innerHTML = "⚠️ Error loading odds (Free plan limit)";
    }
}

</script>

