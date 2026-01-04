


let allUsers = [];  


// check user session 
const profile = document.getElementById("profile")
const  usersection = document.getElementById("alluser")
const user = localStorage.getItem("id")
const userEmail = localStorage.getItem("email")
const u = document.getElementById("sender")
const  s = document.getElementById("sender")
const r = document.getElementById("reciever")    //chosse the sender name later
const sendbutton = document.getElementById("send")



let  fileSize=0








if(!user || !userEmail)window.location = "login.html"

if(user){
    s.innerHTML =userEmail
}


// u.innerText = userEmail   // must replace with the name later 

async function logout(){
   
    localStorage.removeItem("id") 
    localStorage.removeItem("email")
    window.location = "login.html"
}




//displaying all the users 


function displayUsers(users) {
    usersection.innerHTML = "";   // clear old content

  
    users.forEach(items => {
        usersection.innerHTML += `
            <div class="user-card" data-email="${items.email}" onclick="selectUser(this)">
                <h3 class="name">${items.name}</h3>
                <p class="email">${items.email}</p>
                <p id="info"><span>click to select</span></p>
            </div>
        `;
    });


}



//fetch all user via this function 
async function fetchAlluser() {
    try {
        let response = await fetch("https://retro-backend-u2vk.onrender.com/alluser");
        let res = await response.json();

        allUsers = res.filter(user => user.email !==userEmail)
        
     
        displayUsers(allUsers); // show all users

    } catch (err) {
        console.log("there is an error", err);
    }
}



fetchAlluser()


//search for all users 
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchinput");

  searchInput.addEventListener("input", function () {
    let searchValue = this.value.toLowerCase().trim();

    if (searchValue === "") {
      displayUsers(allUsers);
      return;
    }

    let filteredUsers = allUsers.filter(user =>
      user.name && user.name.toLowerCase().includes(searchValue)
    );

    displayUsers(filteredUsers);
  });
});









let temp ; 
// fetch session user 

async function fetchuser() {

    try{



        let response = await fetch(`https://retro-backend-u2vk.onrender.com/user/${user}`)
        let res = await response.json()
      profile.innerHTML = `<div id="p" > Your Info  <p> <b>Name :</b> ${res.name} </p> <p><b>Email :</b>  ${res.email}</p></div>`
      temp = res.name
      
    }catch(err){
        console.log("Error" , err )
    }
    
}







async function  receivedFile() {

    fetchuser()

    let mainbody = document.getElementById("main")
    mainbody.innerHTML = ` <h1>${temp} </h1>`
console.log(temp)
    
    
}

 document.getElementById("progressBar").style.display="none"



// upload function on cloudinary 



function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {

         const cloudName = "dvabdgcni";
    const uploadPreset = "videofor";

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const xhr = new XMLHttpRequest();

        // Progress like YouTube
        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                 document.getElementById("progressBar").style.display="block"
                document.getElementById("progressBar").value = percent;
                document.getElementById("progressText").innerText = percent + "%";
            
                    


                
            }
        };

        xhr.onload = function () {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                resolve(response.secure_url); // ✅ returns URL
            } else {
                reject("Upload failed");
            }
        };

        xhr.onerror = function () {
            reject("Network error");
        };

        xhr.open("POST", url);
        xhr.send(formData);
    });
}



//global url 

let url;   //very imp url actually it is the file url


document.getElementById("fileInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    fileSize =file.size/(1024 * 1024)  //in mb 

    if(fileSize>1600){
        alert("this file is  more than 1500mb")
        return
    }

    try {
      
      
        let ensure = confirm("are sure to upload the ? ")

        if(ensure){
             const uploadedURL = await uploadToCloudinary(file);
        console.log("Uploaded file URL:", uploadedURL);
        url = uploadedURL

        if(url){
             document.getElementById("progressText").innerText="uploaded succesfully.."

        }
        }
      

         
       
    } catch (err) {
        console.error(err);
    }
});



let recieverEmail;   // very important the reciver email 

//return reciver 
function selectUser(card) {
    // remove bg from all cards first
    document.querySelectorAll(".user-card").forEach(c => {
        c.classList.remove("bg");
    });

     const email = card.dataset.email;

    // add bg only to clicked card
    card.classList.add("bg");
    recieverEmail=email
     r.innerText=recieverEmail
   
}


// if(url && recieverEmail && userEmail){
//     let sendbtn = document.getElementById("send")

//        sendbtn.disabled = false;

       
// }


let checked = false;

function handleChange(box) {
    
    checked = box.checked

    if(checked && url && userEmail && recieverEmail){
        sendbutton.disabled=false
       

    }else{
        sendbutton.disabled=true
        alert("some fileds still need to fill ")
     box.checked = false;

    }
}



async function sendToUser(){

    //  const { senderEmail, receiverEmail,  senderMessage, fileLink } = req.body;

 

    try{
        
  let senderMessage = document.getElementById("message").value;
  const receiverEmail = recieverEmail
   const senderEmail = userEmail;
   const fileLink = url ;
  


  let response = await fetch("https://retro-backend-u2vk.onrender.com/sendfile", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({senderEmail , receiverEmail , senderMessage , fileLink , fileSize })
});


let res = await response.json();
console.log("file sent to the user succesfully "  )

         alert(res.message)

         location.reload()


    }catch(err){
        alert(err)
    }


}






// final block of code 

sendbutton.addEventListener("click" ,(e)=>{
    e.preventDefault()
    sendToUser();
    console.log("sending ...")
    document.getElementById("send").disabled=true


})