// license.js

import {
    auth,
    db,
    onAuthStateChanged,
    doc,
    getDoc
} from "./firebase.js";


const box =
document.getElementById("licenseBox");



onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location.replace("index.html");
        return;

    }



    const ref =
    doc(
        db,
        "users",
        user.uid
    );



    const snap =
    await getDoc(ref);



    if(!snap.exists()) return;



    const data =
    snap.data();



    if(!data.license){


        box.innerHTML =

        `
        <div class="card">

        <h2>🚗 Dijital Ehliyet</h2>

        <p>Henüz ehliyet kaydı yok.</p>

        </div>
        `;


        return;

    }





    box.innerHTML =

    `

    <div class="card">

    <h2>🚗 Dijital Ehliyet</h2>


    <p>
    👤 Ad:
    ${data.license.name}
    </p>


    <p>
    🚘 Sınıf:
    ${data.license.class}
    </p>


    <p>
    📌 Durum:
    ${data.license.status}
    </p>


    <p>
    📅 Tarih:
    ${data.license.date}
    </p>


    </div>

    `;



});