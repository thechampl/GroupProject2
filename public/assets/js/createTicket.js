$(document).ready(() => {
  // Constants
  const characters = document.querySelector("#remainingChars");
  const ticketDept = document.querySelector("#deptDropdown");
  const ticketRequest = document.querySelector("#reqDropdown");
  const ticketQuestions = document.querySelector("#ticketQuestions");
  const ticketComments = document.querySelector("#ticketComments");
  const ticketSubmit = document.querySelector("#ticketSubmit");

  // EVENT LISTENERS
  ticketSubmit.addEventListener("click", ticketSubmitCallback);
  ticketComments.addEventListener("keyup", remainingChars);

  // ON CLICK: Open Ticket
  $(".open-ticket").on("click", getDepts);

  // ON CHANGE: Department/Request Dropdowns
  $("#deptDropdown").on("change", getReqs);
  $("#reqDropdown").on("change", getQuestions);

  // GET: Departments /api/departments
  function getDepts() {
    $.ajax({ url: "/api/departments", method: "GET" }).done(response => {
      $("#deptDefault").nextAll("option").remove();
      response.forEach(dept => {
        var option = $("<option>").attr("value", dept.id).text(dept.name);
        $("#deptDropdown").append(option);
      })
    });
  }

  // GET: Requests /api/departments
  function getReqs() {
    $.ajax({ url: `/api/departments/${this.value}`, method: "GET" }).done(response => {
      $("#reqDropdown").removeAttr("disabled");
      $("#reqDefault").nextAll("option").remove();
      $("#ticketQuestions").empty();
      response.Requests.forEach(function (req) {
        var option = $("<option>").attr("value", req.id).text(req.name);
        $("#reqDropdown").append(option);
      })
    });
  }

  // GET: Questions /api/questions/:id
  function getQuestions() {
    $.ajax({ url: `/api/questions/${this.value}`, method: "GET" }).done(response => {
      var ticketQuestions = $("#ticketQuestions");
      ticketQuestions.empty();
      response.forEach(question => {
        var formGroup = $("<div>").addClass("form-group");
        if (question.type === "text") {
          var questionField = $("<input>").attr({
            "type": "text",
            "class": "form-control",
            "data-question": question.id,
            "placeholder": question.label
          });
        }
        else if (question.type === "select") {
          var selectChoices = question.choices.split(",");
          var questionField = $("<select>").addClass("form-control");
          var dropDefault = $("<option>").prop({
            "disabled": true,
            "selected": true
          }).text(question.label);
          questionField.append(dropDefault);
          selectChoices.forEach(choice => {
            var dropField = $("<option>").attr({
              "data-question": question.id,
            }).text(choice);
            questionField.append(dropField);
          })
        }
        formGroup.append(questionField);
        ticketQuestions.append(formGroup);
      })
    });
  }

  // Ticket Submit Callback
  function ticketSubmitCallback(e) {
    e.preventDefault();

    const requestId = ticketRequest.value;
    const answers = [];
    const comments = ticketComments.value.trim();
    for (let i = 0; i < ticketQuestions.childNodes.length; i++) {
      if (ticketQuestions.childNodes[i].children[0].options) {
        const selIndex = ticketQuestions.childNodes[i].children[0].selectedIndex;

        answers.push({
          question: ticketQuestions.childNodes[i].children[0][selIndex].getAttribute("data-question"),
          answer: ticketQuestions.childNodes[i].children[0][selIndex].value
        });
      } else {
        answers.push({
          question: ticketQuestions.childNodes[i].children[0].getAttribute("data-question"),
          answer: ticketQuestions.childNodes[i].children[0].value
        });
      }
    }

    const ticketData = {
      requestId,
      answers,
      comments
    };
    ticketValidation(ticketData);
  }

  // Ticket Validation
  function ticketValidation(dataObj) {
    let breakFlag = null;
    for (let property in dataObj) {
      // INVALID: Special Characters
      if (typeof (dataObj[property]) !== 'object') {
        if (/[^a-zA-Z0-9\-\/\s\.]/.test(dataObj[property])) {
          $("#invalid-modal").modal("show");
          breakFlag = true;
          break;
        };
      }
      // INVALID: Undefined
      if (dataObj[property] === "" || undefined) {
        $("#invalid-modal").modal("show");
        breakFlag = true;
        break;
      };
    };
    if (breakFlag === true) {
      return;
    };
    postTicket(dataObj);
  };

  // Remaining Characters
  function remainingChars() {
    const defaultCharValue = 255;
    let textLength = ticketComments.value.length;
    let charactersRemaining = parseInt(characters.textContent);
    let totalRemainingChars = defaultCharValue - textLength;
    characters.textContent = totalRemainingChars;
  };

  // POST: Ticket /userTicket
  function postTicket(data) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/userTicket", true);
    xhr.onload = function () {
      if (this.status === 200) {
        $("#ticket-modal form")[0].reset();
        $("#ticket-modal").modal("hide");
      };
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));

    setTimeout(pageReload, 1000)
    // $("#ticket-modal").modal("hide");
  }
});

const closeTickets = document.querySelectorAll(".closeTicket");

closeTickets.forEach((button) => {
  button.addEventListener("click", closeTicket);
});

function closeTicket() {
  const ticketText = this.parentElement.parentElement.previousElementSibling.innerText;
  const textNumber = /\d+/g;
  const ticketId = ticketText.match(textNumber);

  const ticketToggleButton = document.querySelector(`#ticket-${ticketId}-toggle-button`);
  ticketToggleButton.disabled = true;

  const statusUpdate = {
    ticketText,
    id: ticketId,
    status: "closed"
  };

  ticketStatusUpdate(statusUpdate);
}

function ticketStatusUpdate(ticketUpdate) {
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", "/userTicketsUpdate", true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(ticketUpdate));

  setTimeout(pageReload, 1000)
}

function pageReload() {
  location.reload();
}