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
document.getElementById("notifications");



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
        "notifications"
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
        "<p>Bildirim yok.</p>";

        return;

    }



    snap.forEach((item)=>{


        const data =
        item.data();



        box.innerHTML +=
        `

        <div class="card">

        <h3>
        🔔 ${data.title}
        </h3>

        <p>
        ${data.message}
        </p>

        </div>

        `;


    });


});