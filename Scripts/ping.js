
let sactive = document.getElementById("sact")

async function pingserver() {
    let content;

    try{

    const resposne = await fetch("https://retro-backend-u2vk.onrender.com/ping")

    let res = await resposne.json()

    if(res.active){

       content = `Server is active now ...`
       sactive.innerHTML=content
    }

    else{
        content=` Starting Server ...`
        sactive.innerHTML=content
    }
    }catch(err){
        console.log("error" , err)
    }
    
}