$(document).ready(function(){
    $(".playingField").hide();
    $("#result").hide();
    $("#goAgain").hide();
    $("#goAgain").click(function() {
        $("#player").find("button").show();
        $("#result").hide();
        newGame();
    });
    $("#go").click(function() {
        $("#welcome").hide();
        $(".playingField").fadeIn(2000);
        $("#player").find("button").show();
        newGame();
    });
    $("#hit").click(function() { hitMe(); });
    $("#stand").click(function() {
        $("#player").find("button").hide();
        stand();
    });
});

var myDeck = new Deck();
var dealerHand = new Hand();
var playerHand = new Hand();

function newGame() {
    dealerHand.clearHand();
    playerHand.clearHand();
    dealerHand.addCard();
    playerHand.addCard();
    playerHand.addCard();
    $('#dealerHand').html(function(){ return dealerHand.formatCards(); }); //dealerHand.formatCards(); });
    $('#dealerSum').text(function() { return dealerHand.sum(); });
    $('#playerHand').html(function(){ return playerHand.formatCards(); });
    $('#playerSum').text(function() {
        if (playerHand.sum() === 21) {
            stand();
            $("#player").find("button").hide();             
            return playerHand.sum() + " Black Jack!";
        } else {
            return playerHand.sum();
        };
    });
};

function hitMe() {    
    playerHand.addCard();
    $('#playerHand').html(function() {return playerHand.formatCards();});
    $('#playerSum').text(function() {
        if (playerHand.sum() > 21) {
            $("#player").find("button").hide(); 
            $("#result").show();           
            $("#resultMsg").text(" AAUGH... Busted, You lose!");
            $("#result").find("button").fadeIn(3000);
            return playerHand.sum();
        }
        else if (playerHand.sum() === 21) {
            $("#player").find("button").hide();
            stand();
            return playerHand.sum() + "!";
        }
        else {
            return playerHand.sum();
        };
    });
};

function stand() {
    if (dealerHand.sum() < 17) {
        dealerHand.addCard();
        $('#dealerHand').html(function() { return dealerHand.formatCards(); });
        $('#dealerSum').text(function() { return dealerHand.sum() });
        return stand();
    } else if (dealerHand.sum() > 21) {
        $('#dealerHand').html(function() { return dealerHand.formatCards(); });
        $('#dealerSum').text(function() {
            $("#result").show();
            $("#resultMsg").text("Congratulations! You win. Dealer busted.");
            $("#result").find("button").fadeIn();
            return dealerHand.sum();
        });
    } else {
        $('#dealerHand').html(function() { return dealerHand.formatCards(); });
        $('#dealerSum').text(function() {
            if (dealerHand.sum() > playerHand.sum()) {
                $("#result").show();
                $("#resultMsg").text("Sorry, dealer wins.");
                $("#result").find("button").fadeIn();
                return dealerHand.sum();
            }
            else if (dealerHand.sum() === playerHand.sum()){
                $("#result").show();           
                $("#resultMsg").text("It's a draw!");
                $("#result").find("button").fadeIn();                

                return dealerHand.sum();
            }
            else {
                $("#result").show();           
                $("#resultMsg").text(" Congratulations! You win.");
                $("#result").find("button").fadeIn();
                return dealerHand.sum();
            };
        });
    };
};

// Card Deck object
function Deck() {    
    this.resetDeck = function () {
        this.cardDeck = { 
            0 : [0,0,0,0,0,0,0,0,0,0,0,0,0],
            1 : [0,0,0,0,0,0,0,0,0,0,0,0,0],
            2 : [0,0,0,0,0,0,0,0,0,0,0,0,0],
            3 : [0,0,0,0,0,0,0,0,0,0,0,0,0]
        };
    };
    this.resetDeck();
    this.reDressSuit = function(n) {
        if (n === 0) return 'H';
        else if (n === 1) return 'C';
        else if (n === 2) return 'D';
        else if (n === 3) return 'S';
        else return 'Error';
    };
    this.newCard = function() {
        let cardValue = Math.floor(Math.random() * 13) + 1; // Generate random num between 1 and 13
        let cardSuit  = Math.floor(Math.random() * 4) + 0; // Generate random num between 0 and 3
        if (this.cardDeck[cardSuit][cardValue-1] < 1) {
            this.cardDeck[cardSuit][cardValue-1] += 1;
            console.log("Value: " + cardValue + "Suit: " + cardSuit);            
            switch (cardValue) {
                case 1:  return ['A', this.reDressSuit(cardSuit)]; break;
                case 11: return ['J', this.reDressSuit(cardSuit)]; break;
                case 12: return ['Q', this.reDressSuit(cardSuit)]; break;
                case 13: return ['K', this.reDressSuit(cardSuit)]; break;
                default: return [cardValue, this.reDressSuit(cardSuit)]; break;
            }
        } else { //  if card already used regenerat new card or shuffle if no cards left in deck
            let cardsUsed = 0;
            let j = 0;
            while (j < 4) {
                cardsUsed += this.cardDeck[j].reduce((acc, val) => acc+val);
                j++;
            };
            console.log("Cards used so far: " + cardsUsed);
            if (cardsUsed === 52) this.resetDeck();  // Shuffle deck              
            return this.newCard(); // generate new card
        };
    };
};

// Hand object
function Hand() {
    this.clearHand = function () {
        this.cards = [];
        this.aces = 0;
    };
    this.clearHand();
    this.addCard = function () {
        let card = myDeck.newCard();
        let cardValue = card[0];
        if (cardValue === 'A') this.aces++;
        this.cards.push(card);
    };
    this.sum = function() {
        let mySum = 0;
        let myAces = this.aces;
        let i = 0;
        while(i < this.cards.length) {
            switch (this.cards[i][0]) {
                case 'A': mySum += 11; break;
                case 'J': mySum += 10; break;
                case 'Q': mySum += 10; break;
                case 'K': mySum += 10; break;
                default : mySum += this.cards[i][0]; break;
            }
            i++
        };
        while (mySum > 21 && myAces !== 0) {
            mySum = mySum - 10;
            myAces--;
        }
        return mySum;
    };
    this.formatCards = function () {
        let cardArrString = this.cards.map((x) => x.toString());
        let cardArrString2 = cardArrString.map((x) => {
            x = x.replace(/[10]\w/g,"0"); // Replace 10 with 0
            x = x.replace(/\,/g,""); // Remove commas
            return x;
        });
        let card2Return = [];
        cardArrString2.forEach(element => {         
             card2Return.push('<img src="./image/' + element + '.png" alt="' + element + '" height="120" width="80">');
        });
        return card2Return;
    };
};
