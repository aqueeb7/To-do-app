// Check if token exists in localStorage
function checkToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect user to login page or show an error msg
    window.location.href = '/login.html';
    return false;
  }
  // We can also check if token is expired or invalid here
  return true;
}

if (checkToken()) {
  console.log('Access granted');
} else {
  console.log('Access not granted');
}

// Logout button click event
$('#logoutBtn').click(function () {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
})

$(document).ready(function () {
  //Load initial todo when the page is loaded
  loadTodos();
});

const addTitle = document.getElementById("addTitle");
const addText = document.getElementById("addText");
const addNoteButton = document.getElementById("addNote");
const notesDiv = document.getElementById("notes");

var todosUrl = "http://todo-api.aavaz.biz/todos?";
var bearerToken = 'Bearer ' + localStorage.getItem('token');


const notes = [];

function addNotes() {

  if (addText.value == '') {
    alert('Add your Note')
    return;
  }
  const formData = {
    title: addTitle.value,
    description: addText.value
  }
  $.ajax({
    type: 'POST',
    url: todosUrl,
    headers: {
      'Accept': 'application/json',
      'Authorization': bearerToken,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(formData),
    function(data, status) {
      alert("Data: " + data + "\nStatus: " + status);
    }
  })

  loadTodos();
}

function loadTodos() {
  $.ajax({
    type: 'GET',
    url: todosUrl,
    headers: {
      // 'Accept': 'application/json',
      'Authorization': bearerToken,
      'Content-Type': 'application/json',
      "Accept": "*/*",
    },
    success: function (todosResponse) {
      // notes = todosResponse.content;
      let item = '';
      todosResponse.content.forEach(element => {



        item += `<div class="card col-md-3 m-1" todoId="${element.todoId}" style="width: 18rem;" dragable="true">
        <div class="card-body">
        <button class="deletenote btn btn-danger btn-sm" onclick="deletenote(${element.todoId})">Delete</button>
          <h5 class="card-title">${element.title === "" ? 'Note' : element.title}</h5>
          <p class="card-text">${element.description}</p>
        </div>
      </div>`;
      });
      notesDiv.innerHTML = item;

    },
    error: function (request, textStatus, errorThrown) {
      console.log('Error:', textStatus, errorThrown);
    }
  });
}

function deletenote(id) {
  const todoId = id;
  const settings = {
    // "async": true,
    // "crossDomain": true,
    "url": "http://todo-api.aavaz.biz/todos/"+ todoId,
    "method": "DELETE",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": bearerToken
    }
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
}

addNoteButton.addEventListener('click', addNotes);
