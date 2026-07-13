// documents.js

import {
    auth,
    db,
    onAuthStateChanged,
    doc,
    getDoc
} from "./firebase.js";


const box =
document.getElementById("documentsBox");



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



    const docs =
    data.documents || {};



    box.innerHTML = `

    <div class="card">

    <h2>🪪 Kimlik Kartı</h2>

    <p>
    Durum:
    ${docs.identity?.status || "Yok"}
    </p>

    </div>



    <div class="card">

    <h2>🚗 Ehliyet</h2>

    <p>
    Durum:
    ${data.license?.status || "Yok"}
    </p>

    </div>



    <div class="card">

    <h2>📄 Diğer Belgeler</h2>

    <p>
    Durum:
    Aktif
    </p>

    </div>

    `;


});