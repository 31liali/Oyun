// property.js

import {
    auth,
    db,
    onAuthStateChanged,
    collection,
    getDocs
} from "./firebase.js";


const box =
document.getElementById("propertyBox");



onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location.replace("index.html");
        return;

    }



    const ref =
    collection(
        db,
        "users",
        user.uid,
        "properties"
    );



    const snap =
    await getDocs(ref);



    box.innerHTML = "";



    if(snap.empty){


        box.innerHTML =

        `
        <div class="card">

        <h2>🏠 Tapu Sistemi</h2>

        <p>Kayıtlı tapu bulunamadı.</p>

        </div>
        `;


        return;

    }




    snap.forEach((item)=>{


        const data =
        item.data();



        box.innerHTML +=

        `

        <div class="card">

        <h2>🏠 ${data.title}</h2>


        <p>
        📍 Adres:
        ${data.address}
        </p>


        <p>
        🏢 Tür:
        ${data.type}
        </p>


        <p>
        📌 Durum:
        ${data.status}
        </p>


        </div>

        `;


    });



});