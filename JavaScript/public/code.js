document.addEventListener("DOMContentLoaded", function() {
    const app = document.querySelector(".app");
    const socket = io();
    let uname = "";

    app.querySelector(".join-screen #join-user").addEventListener("click", function() {
        let username = app.querySelector(".join-screen #username").value;
        if (username.length === 0) {
            return;
        }
        socket.emit("new User", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });
    app.querySelector(".chat-screen #send-message").addEventListener("click", function(){
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.lenght === 0){
            return ;            
        }
        renderMessage("my",{
            username: uname,
            text: message
        });
        socket.emit("chat message",{
            username: uname,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });
    app.querySelector(" .chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit("user exit", uname);
// sourc
        window.location.href =  window.location.href;
    });

    socket.on("update", function(update)
    {
        renderMessage("update", update);
    });
    socket.on("chat message", function(message){
        renderMessage("other", message);
    });

    function renderMessage(type , message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type == "my"){
            let el = document.createElement("div"); 
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
            <div>
                <div class="name">You</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        }else if(type == "other"){
            let el = document.createElement("div"); 
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
            <div>
                <div class="name">${message.username}</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
            
        }else if (type == "update"){
            let el = document.createElement("div"); 
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
            
        }
        // scroll chat to bottom
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
});
