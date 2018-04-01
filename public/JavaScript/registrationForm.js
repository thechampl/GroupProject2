const button = document.querySelector("#submitButton");
console.log(button);
button.addEventListener("click", postUserInput);

function userInput(event) {
    event.preventDefault();
    const userName = document.querySelector("#nameInput").value.trim();
    const userEmail = document.querySelector("#emailInput").value.trim();
    const userPassword = document.querySelector("#passwordInput").value.trim();

    const data = {
        userName,
        userEmail,
        userPassword
    };

    return data;
}


function postUserInput() {
    // Store user Data object to a variable
    const userData = userInput(event);
    // Create a new instance of an xmlhttprequest object
    const xhr = new XMLHttpRequest();
    // set parameters on method, route, and async
    xhr.open("POST", "/userData", true);
    // What happens when we get a response back from server
    xhr.onload = function() {
        if (this.status === 200) {
            console.log(this.responseText);
        }
    }
    // send data
    xhr.send(userData);
}

