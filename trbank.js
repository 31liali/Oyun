// trbank.js

import {
    auth,
    db,
    onAuthStateChanged,
    doc,
    getDoc
} from "./firebase.js";


const usernameBox =
document.getElementById("bankUser");


const balanceBox =
document.getElementById("bankBalance");



// Kullanıcı kontrolü

onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location.replace("index.html");
        return;

    }



    const userRef =
    doc(
        db,
        "users",
        user.uid
    );



    const snap =
    await getDoc(userRef);



    if(snap.exists()){


        const data =
        snap.data();



        if(usernameBox){

            usernameBox.textContent =
            data.username;

        }



        if(balanceBox){

            balanceBox.textContent =
            data.balance + " €";

        }


    }


});