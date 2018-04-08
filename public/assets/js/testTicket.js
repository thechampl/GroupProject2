// inputs
const ticketStreet = document.querySelector("#ticketStreet");
const ticketCity = document.querySelector("#ticketCity");
const ticketState = document.querySelector("#ticketState");
const ticketZip = document.querySelector("#ticketZip");
const ticketComments = document.querySelector("#ticketComments");
const characters = document.querySelector("#remainingChars");


// submit button
const ticketSubmit = document.querySelector("#ticketSubmit");


// Events
ticketSubmit.addEventListener("click", postTicket);
ticketComments.addEventListener("keyup", remainingChars);
//Test Ticket button listener
//Dept dropdown select
//Req dropdown select


// Functions
function getDepts() {
    //AJAX call GET /api/departments
    $.ajax({
        url: "/api/departments",
        method: "GET"
    }).done(function(response){
        console.log(response);
    });
}

function getReqs() {
    //AJAX call GET /api/departments/:id
    $.ajax({
        url: "/api/departments/" + this.value,
        method: "GET"
    }).done(function(response){
        console.log(response);
    });
}

function getQuestions() {
    //AJAX call /api/questions/:id
    $.ajax({
        url: "/api/questions/" + this.value,
        method: "GET"
    }).done(function(response){
        console.log(response);
    });
}

function postTicket() {
    const ticketData = {
        comments: ticketComments.value.trim(),
        street: ticketStreet.value.trim(),
        city: ticketCity.value.trim(),
        state: ticketState.value.trim(),
        zip: ticketZip.value.trim()
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/userTicket", true);
    xhr.onload = function() {
        if (this.status === 200) {
            console.log("apples");
            console.log(this.responseText);
        };
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(ticketData));
}


function remainingChars() {
    const defaultCharValue = 255;
    let textLength = ticketComments.value.length;
    let charactersRemaining = parseInt(characters.textContent);
    let totalRemainingChars = defaultCharValue - textLength;
    characters.textContent = totalRemainingChars;
}

// Create validation for this form
// Make sure users submit the required information
// make sure that users cannot submit symbols or other malicious characters that could inject our software