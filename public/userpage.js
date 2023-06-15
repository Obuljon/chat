

        var friends = []       
        var room = ""
		var friend
        
		var messages = document.getElementById("messags")
        var form = document.getElementById('form');
        var input = document.getElementById('input');

    
		
            socket.on("new chat", data => {
                friend = data.friend
                friends.unshift(data.friend);
                room = data.room
                socket.emit("main room", data.room)
                if(data.friend.images.length == 0) data.friend.images = [{image: "noavatar.png"}]
                document.getElementById("friendname").innerText = data.friend.name
                document.getElementById("friendimg").innerHTML = `<img class="avatar-md" src="file/${data.friend.images[data.friend.images.length - 1].image}" data-toggle="tooltip" data-placement="top" title="" alt="avatar" data-original-title="Keith">`
                document.getElementById("status").innerHTML = `<i class="material-icons online"></i>`
                friendspage(friends)
            })

            socket.on("search", (data) => {
                const chats = document.querySelector("#chats");
                                chats.innerHTML = ""
                                data.forEach(item => {
                                    if(item.images.length == 0){
                                        item.images = [{image: "noavatar.png"}]
                                    }
                                    const button = document.createElement('button');
                                    button.className = "btn filterDiscussions all unread single";
                                    button.setAttribute("onclick", `newchat('${item._id}')`);
                                   
                                    button.innerHTML = `
                                        <img class="avatar-md" src="/file/${item.images[item.images.length - 1].image}" data-toggle="tooltip" data-placement="top" title="Michael" alt="avatar">
                                        <div class="data">
                                            <h5>${item.name}</h5>
                                            <span></span>
                                            <p></p>
                                        </div>`

                                    chats.appendChild(button);
                                    });
            })
            
            socket.on("online", (data) => {
                const buttonId = data._id;
                const lineStatus = data.line;
                if(user_id != buttonId){
                    const button = document.getElementById(buttonId);
                    const statusElement = button.querySelector(".status i");
                    if (lineStatus === "online") {
                        statusElement.classList.remove("offline");
                        statusElement.classList.add("online");
                    } else if (lineStatus === "offline") {
                        statusElement.classList.remove("online");
                        statusElement.classList.add("offline");
                    }
                }
            })

            socket.on("user friends", friendspage)

            socket.on("sidebar", (data) => {
                const newroom = data.friends.find(e => e.friends_id == user_id).chat_id
                socket.emit("main room", newroom)
                if(friends.some(e => e._id && e._id.toString() ===  data._id.toString())) return
                friends.unshift(data);
                const chats = document.querySelector("#chats")
                if(data.images.length == 0) data.images = [{image:"noavatar.png"}]
                const button = document.createElement('button');
                button.id = data._id
                button.className = "btn filterDiscussions all unread single";
                button.setAttribute("onclick", `theChat('${data._id}')`);
                button.innerHTML = `
                                        <img class="avatar-md" src="/file/${data.images[data.images.length - 1].image}" data-toggle="tooltip" data-placement="top" title="Michael" alt="avatar">
                                            <div class="status">
                                                <i class="material-icons online">
                                                    fiber_manual_record
                                                </i>
                                            </div>
                                        
                                        <div class="data">
                                            <h5>${data.name}</h5>
                                            <span></span>
                                            <p></p>
                                        </div>`
                chats.insertBefore(button, chats.firstChild);
            })

            socket.on("response offer", (data) => {
                room = data.mainroom
            })

            socket.on("chat-message", (data) => {
                const now = new Date();
                const formattedTime = now.toLocaleTimeString();
				const messages = document.querySelector("#messages");
				const div = document.createElement("div");
				div.className = "";
                if(room == data.room)
				if (data.user != user) {
				div.innerHTML = `
				<div class="message">
					<div class="text-main">
					<div class="text-group">
						<div class="text">
						<p>${data.text}</p>
						</div>
					</div>
					<span>${formattedTime}</span>
					</div>
				</div>`;
				} else {
				div.innerHTML = `
				<div class="message me">
					<div class="text-main">
					<div class="text-group me">
						<div class="text me">
						<p>${data.text}</p>
						</div>
					</div>
					<span><i class="material-icons">check</i>${formattedTime}</span>
					</div>
				</div>`;
				}

				messages.appendChild(div);
				div.scrollIntoView({ behavior: "smooth", block: "end" });	
            if(data.user_id != user_id){
                swapfriends(data.user_id,data.text)
                if(data.room != room)
                messagenum(data.user_id,)
            } 
			});

           

        document.getElementById("button").addEventListener("click", (e) =>{	
				e.preventDefault();
				const input = document.getElementById("chatsend")
                if(input.value != ''){
                    const data = {text: input.value, user, user_id, room}
                    socket.emit('send-message', data);
                    input.value = '';
                    swapfriends(friend._id, input.value)
                }

        })


		
			function newchat(id){
				socket.emit("new friend", id)
			}

			function theChat(id){
                document.getElementById("messages").innerHTML = ""
                const button = document.getElementById(id);
                if (button) {
                const statusElement = button.querySelector('.new');
                if (statusElement) {
                    statusElement.remove();
                }
                }
				friend = friends.find(e => e._id === id)
                room = friend.friends.find(e => e.friends_id == user_id).chat_id;
				if(friend.images.length == 0){
                    friend.images = [{image: "noavatar.png"}]
                    }
                document.getElementById("friendname").innerText = friend.name
                document.getElementById("friendimg").innerHTML = `<img class="avatar-md" src="file/${friend.images[friend.images.length - 1].image}" data-toggle="tooltip" data-placement="top" title="" alt="avatar" data-original-title="Keith">`
                document.getElementById("status").innerHTML = `<i class="material-icons online"></i>`
				socket.emit("offer", id)
			}

				const inputElement = document.getElementById('conversations');
				// input o'zgartirilganda yoki xabar yuborish tugmasiga bosilganda
				inputElement.addEventListener('input', function() {
                    if(inputElement.value != ""){
                        const text = inputElement.value;
                        socket.emit("searchpost", text)
                    }else{
                        inputElement.value = ""
                        friendspage(friends)
                    }
				});

          function friendspage(data){
            friends = data
            const chats = document.querySelector("#chats");
            chats.innerHTML = "";
            friends.forEach(item => {
                if(item.images.length == 0) item.images = [{image:"noavatar.png"}]
                const button = document.createElement('button');
                button.id = item._id
                button.className = "btn filterDiscussions all unread single";
                button.setAttribute("onclick", `theChat('${item._id}')`);
                button.innerHTML = `
                                        <img class="avatar-md" src="/file/${item.images[item.images.length - 1].image}" data-toggle="tooltip" data-placement="top" title="Michael" alt="avatar">
                                            <div class="status">
                                                <i class="material-icons offline">
                                                    fiber_manual_record
                                                </i>
                                            </div>
                                        
                                        <div class="data">
                                            <h5>${item.name}</h5>
                                            <span></span>
                                            <p></p>
                                        </div>`
                chats.appendChild(button);
                })
          }
            function swapfriends(_id, text) {
                const chats = document.querySelector("#chats");
                const swap = document.getElementById(_id)
                const pElement = swap.querySelector(".data p");
                pElement.textContent = text;
                chats.insertBefore(swap, chats.firstChild);
            }

            function messagenum(_id){
                const button = document.getElementById(_id);
                
                if(!button.querySelector("#count")){
                    const newDiv = document.createElement("div");
                    newDiv.className = "new bg-pink";
                    newDiv.innerHTML = '<span id="count">+1</span>';
                    button.appendChild(newDiv);
                }else{
                    const spanElement = button.querySelector(".new.bg-pink span");
                    let count = parseInt(spanElement.textContent);
                    const newCount = count + 1;
                    spanElement.textContent = `+${newCount}`;
                }
            } 

            