import {  student } from "./student.js";

export function userLogin() {
    
    let userJwt;
    const mainLogin = document.createElement('div');
    mainLogin.classList.add('login-box');
    mainLogin.innerHTML = `
        <h1 class="login-title">Login to Zone O1 Dakar</h1>
        <form id="credForm">
            <input class="login-input" type="text" placeholder="Username" required><br>
            <input class="login-input" type="password" placeholder="Password" required><br>
            <button class="login-button" type="submit">Log In</button>
        </form>
    `
    const badCred = document.createElement('div');
    badCred.innerHTML = `Identifiants incorrects, veuillez réessayer`;
    badCred.style.display = "none";
    badCred.style.color = "red";
    mainLogin.appendChild(badCred)
    document.body.appendChild(mainLogin);

    // Récupérer le token d'utilisateur depuis le stockage local s'il est disponible
    const storedUserJwt = localStorage.getItem('userJwt');
    if (storedUserJwt) {
        userJwt = JSON.parse(storedUserJwt);
        validateUserJwt(userJwt)
    }

    document.getElementById('credForm').addEventListener('submit', function(event) {
        event.preventDefault();
      
        const username = document.querySelector('.login-input[placeholder="Username"]').value;
        const password = document.querySelector('.login-input[placeholder="Password"]').value;
    
        const authString = 'Basic ' + btoa(`${username}:${password}`);
      
        fetch('https://learn.zone01dakar.sn/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : authString
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.error) {
            badCred.style.display = "block";

            
          }
          else {
            userJwt = data;
            localStorage.setItem('userJwt', JSON.stringify(userJwt)); // Store userJwt in localStorage
            student(userJwt);
          }
          // do something with the response data
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
    
    function validateUserJwt(newUserJwt) {
        if (!userJwt || JSON.stringify(newUserJwt) !== JSON.stringify(userJwt)) {
            localStorage.removeItem('userJwt');
            document.body.appendChild(mainLogin);
        } else {
            student(userJwt);
        }
    }
    
}

userLogin();
