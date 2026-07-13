// fines.js

import {
    auth,
    db,
    onAuthStateChanged,
    collection,
    getDocs,
    query,
    orderBy
} from "./firebase.js";


const box =
document.getElementById("finesBox");



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
        "fines"
    );



    const q =
    query(
        ref,
        orderBy("date","desc")
    );



    const snap =
    await getDocs(q);



    box.innerHTML="";



    if(snap.empty){

        box.innerHTML =
        `
        <div class="card">

        <h2>🚔 Ceza Sistemi</h2>

        <p>Ceza kaydı bulunamadı.</p>

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


        <h3>
        🚔 ${data.reason}
        </h3>


        <p>
        💶 Ceza:
        ${data.amount} €
        </p>


        <p>
        📌 Durum:
        ${data.status}
        </p>


        <p>
        📅 Tarih:
        ${data.date}
        </p>


        </div>

        `;


    });



});