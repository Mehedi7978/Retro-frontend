



 async function  signup(){

 const name = document.getElementById('name').value.trim()      
 const email = document.getElementById('email').value.trim()
 const password = document.getElementById('password').value.trim()


 let formData = new FormData()

 formData.append('name' , name)
 formData.append('email', email)
 formData.append('password', password)



 let response = fetch('http://localhost:3000/signup' , {
    method:"POST",
    body :formData
 }


)

let res = await response.json()

console.log(response)


}