// Minimal dummy JS
(function () {
 
  // TODO (some items addressed)
  /*
    
    - optimize everything
    - look for and fix bugs
    - add generaly more content
    - if stock reaches a price of 5 have a 1/2 chance to make the stock suspended permanently and display "KONKURS I STRYN" make it disfunctional after (you lose all stock)
    - add audio to sale or purchase of stock
    - align things (stock list = center) etc etc  [DONE via CSS]
    - better price alterations 
    - make a better news section that can make a category of stock skyrocket or plumet (add more categories and stocks every refresh set random stocks to the stocklist max 20 per game 50 stocks total)
)
  
  */

  // Opprettelse av spillvariabler.
  var player = {
    navn : "ole",
    saldo : 30000
  };

  // spilltid
  var game = {
    dag:1,
    month:1,
    year:2026,
  };

  // Kategori (id brukes bare for eventlogikk)
  var category = [
    {navn :"Transport",   id: 1},
    {navn :"Olje",        id: 2},
    {navn :"Tech",        id:3},
    {navn :"Diverse",     id:0}
  ];

  // Aksjer
  var stock = [
    {navn: "Statoil",   price : 1000, prevPrice:1000, available: 500,   owned: 0 ,  category:2},
    {navn: "Telenor",   price: 100, prevPrice:100,   available: 400,   owned: 0,   category: 3},
    {navn: "Tine"   ,   price: 45.5, prevPrice:45.5, available:250,    owned : 0,  category:0},
    {navn: "PingPanic", price: 0.4, prevPrice:0.4,   available:100000, owned: 0,   category:3},
    {navn: "Apple",     price: 3299, prevPrice:3299, available: 2300,  owned:0,    category: 3}
  ];

  // ekstra potensielle aksjer som kan dukke opp over tid
  var potentialStocks = [
    {navn: "VidereTransport", price: 150, category:1},
    {navn: "Hydro", price: 200, category:2},
    {navn: "Novo", price: 550, category:3},
    {navn: "COOP", price: 25, category:0},
    {navn: "Globus", price: 75, category:0},
    {navn: "SolarX", price: 1250, category:3},
    {navn: "MegaOil", price: 800, category:2},
    {navn: "QuickRide", price: 60, category:1}
  ];

  function maybeAddNewStock() {
    if(stock.length >= 20 || potentialStocks.length === 0) return;
    if(Math.random() < 0.6) { // 60% chance per dag
      var idx = Math.floor(Math.random() * potentialStocks.length);
      var s = potentialStocks.splice(idx,1)[0];
      s.price = s.price;
      s.prevPrice = s.price;
      s.available = 1000;
      s.owned = 0;
      s.suspended = false;
      stock.push(s);
      newsMessages.push("Nytt selskap notert: " + s.navn);
    }
  }

  // nyheter / hendelser
  var newsMessages = [];

  function generateNews() {
    // 25% sjanse for en relevant nyhet
    if (Math.random() < 0.25) {
      // 50/50: enkeltaksje eller hel kategori
      if (Math.random() < 0.5 && stock.length > 0) {
        var idx = Math.floor(Math.random() * stock.length);
        var s = stock[idx];
        if (!s.suspended) {
          var direction = Math.random() < 0.5 ? "skyrocket" : "plummet";
          if (direction === "skyrocket") {
            s.price = Math.round(s.price * (1 + 0.5 * Math.random()) * 100) / 100;
            newsMessages.push(s.navn + " skyrocket på grunn av nyhet!");
          } else {
            s.price = Math.round(s.price * (1 - 0.5 * Math.random()) * 100) / 100;
            newsMessages.push(s.navn + " faller kraftig pga dårlig nyhet");
          }
        }
      } else {
        // påvirk hele kategori
        var catIdx = Math.floor(Math.random() * category.length);
        var cat = category[catIdx];
        var direction = Math.random() < 0.5 ? "opp" : "ned";
        stock.forEach(s => {
          if (s.category === cat.id && !s.suspended) {
            if (direction === "opp") {
              s.price = Math.round(s.price * (1 + 0.2 * Math.random()) * 100) / 100;
            } else {
              s.price = Math.round(s.price * (1 - 0.2 * Math.random()) * 100) / 100;
            }
          }
        });
        newsMessages.push("Nyheter påvirker kategorien " + cat.navn + " - alle aksjer går " + (direction === "opp" ? "opp" : "ned") + "!");
      }
    }
  }

  function renderNews() {
    var div = document.getElementById("news");
    if(!div) return;
    if(newsMessages.length === 0) {
      div.textContent = "";
    } else {
      div.innerHTML = newsMessages.map(m=>"&bull; "+m).join("<br>");
    }
  }

  function resetGame() {
    // reload siden for enkel reset
    location.reload();
  }


  // Her er trykk på ny dag knappen
  document.getElementById("newDay").addEventListener("click", () =>
  { 
    runNewDay();
  });

  // her er knappane fra aksjelista
  document.addEventListener("click", function(event){
    // Kjøp og selg-knapper identifiseres via klasse, ikke id
    if(event.target && event.target.tagName === "BUTTON")
    {
      if(event.target.classList.contains("kjop"))
      {
        var stockID = event.target.dataset.stock;
        buyStock(stockID);
      }
      else if(event.target.classList.contains("selg"))
      {
        var stockID = event.target.dataset.stock;
        sellStock(stockID);
      }
    }
  });
  
  function sellStock(stockID)
  {
      var currentStock = stock[stockID];
      if (currentStock.suspended) {
        alert("Dette selskapet er konkurs og kan ikke handles.");
        return;
      }

      var antall = parseInt(prompt("How many stocks do you sell?"));

      // validate input - ignore cancel or invalid values
      if (isNaN(antall) || antall <= 0) {
        // nothing to sell or user pressed cancel
        return;
      }

      if(antall > currentStock.owned)
      {
        if(currentStock.owned == 0)
        {
          alert("du eiger ingen");
          return; // Return = Quit the function/code
        }

        alert("To many, adjusted it to :" + currentStock.owned);
        antall = currentStock.owned;
      }

      var totalPris = currentStock.price * antall;

      // salg er godkjent
      player.saldo = player.saldo + totalPris;
      stock[stockID].owned -= antall;
      stock[stockID].available += antall;
      playBeep(220,0.1);
      updateGUI();
  }

  function buyStock(stockID)
  {
    var currentStock = stock[stockID];
    if (currentStock.suspended) {
      alert("Dette selskapet er konkurs og kan ikke handles.");
      return;
    }

    var antall = parseInt(prompt("How many stocks do you want?"));

    // validate input - ignore cancel or invalid values
    if (isNaN(antall) || antall <= 0) {
      return; // user cancelled or entered invalid number
    }

    // Sjekk kor mange akjser er det mulig å kjøpe

    var totalMaximum = Math.floor(player.saldo / currentStock.price);
    if(totalMaximum > currentStock.available)
    {
      totalMaximum = currentStock.available;
    }
    if(antall > totalMaximum)
    {
      antall = totalMaximum;
    }
    // Antall = det antallet aksjer me kan kjøpa.
    var totalPris = currentStock.price * antall;

    // Kjøp er godkjent
    player.saldo -= totalPris;
    stock[stockID].owned += antall;
    stock[stockID].available -= antall;
    playBeep(440,0.1);
    updateGUI();

    if(player.saldo < 0) {
      alert("Du gikk konkurs! Spillet starter på nytt.");
      resetGame();
    }
  }

  // Kode som blir kjørt ved ny dag
  function runNewDay()
  {
    // nullstill nyhetsfeed for dagens hendelser
    newsMessages = [];
    // eventuelt nye selskaper
    maybeAddNewStock();
    // Kalkuler nye priser på aksjer
    calculateNewPrices();
    generateNews();

    // update days months year (simplified calendar)
    game.dag++;
    if (game.dag > 30) {
      game.dag = 1;
      game.month++;
      if (game.month > 12) {
        game.month = 1;
        game.year++;
      }
    }

    // check for bankruptcy after price changes (if events created negative balance)
    if(player.saldo < 0) {
      alert("Saldo negativ – du er konkurs!");
      resetGame();
      return;
    }

    updateGUI();
  }

  // kalkuler nye priser kvar gang denne blir kjørt.
  function calculateNewPrices()
  {
     for(let i = 0; i < stock.length; i++ )
      {
        if (stock[i].suspended) {
          continue; // prisen låst
        }

        // husk gammel pris for visning og beregning
        stock[i].prevPrice = stock[i].price;

        // basisendring +/-10 + ekstra tilfeldighet
        var change = Math.random() * 20 - 10; // mellom -10 og 10

        // ekstra volatilt basert på kategori
        switch(stock[i].category) {
          case 2: // olje
            change *= 1.5;
            break;
          case 3: // tech
            change *= 2;
            break;
          default:
            break;
        }

        var tempStockPrice = Math.round((stock[i].price + change) * 100) / 100;

        // sjekk konkursrisiko ved lav pris
        if(tempStockPrice <= 5 && Math.random() < 0.5) {
          // selskapet går konkurs
          stock[i].suspended = true;
          stock[i].price = 0;
          stock[i].available = 0;
          // spilleren mister sine aksjer
          stock[i].owned = 0;
          newsMessages.push(stock[i].navn + " har gått konkurs! KONKURS I STRYN");
          continue;
        }

        if(tempStockPrice < 0) {
          tempStockPrice = 0;
        }

        stock[i].price = tempStockPrice;
      }
  }

  function updateGUI()
  {
    document.getElementById("dag").innerHTML = "DAY: " + game.dag;
    document.getElementById("month").innerHTML = "MONTH: " + game.month;
    document.getElementById("year").innerHTML = "YEAR: " + game.year;
    document.getElementById("balance").innerHTML = "BALANCE: " + player.saldo.toFixed(2) + " kr";
    redrawStockList();
    renderNews();
  }

  function redrawStockList() {
    var divList = document.getElementById("stocklist");

    var html = "<table>";
    html += "<tr>";
    html += "<th>Navn</th>";
    html += "<th>Pris</th>";
    html += "<th>Endring</th>";
    html += "<th>Dine aksjer</th>";
    html += "<th>Dine verdier</th>";
    html += "<th>Handling</th>";
    html += "</tr>";

    for (let i = 0; i < stock.length; i++) {
        var s = stock[i];
        var priceString = s.suspended ? "-" : "kr " + Number(s.price).toFixed(2);
        var changeString = "";
        if (!s.suspended && typeof s.prevPrice === 'number') {
            var diff = s.price - s.prevPrice;
            changeString = (diff >= 0 ? "+" : "") + diff.toFixed(2);
        }

        html += "<tr>";
        html += "<td>" + s.navn + (s.suspended ? " (KONKURS)" : "") + "</td>";
        html += "<td>" + priceString + "</td>";
        html += "<td>" + changeString + "</td>";
        html += "<td>" + s.owned + "</td>";
        html += "<td>kr " + (s.owned * s.price).toFixed(2) + "</td>";
        html += "<td>";
        if (!s.suspended) {
            html += "<button class='kjop' data-stock='" + i + "'>Kjøp</button> ";
            html += "<button class='selg' data-stock='" + i + "'>Selg</button>";
        } else {
            html += "-";
        }
        html += "</td>";
        html += "</tr>";
    }

    html += "</table>";

    divList.innerHTML = html;

  
    }


   
   updateGUI();

})();
