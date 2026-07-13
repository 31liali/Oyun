// home.js

import {
    auth,
    db,
    onAuthStateChanged,
    signOut,
    doc,
    getDoc
} from "./firebase.js";


// Profil bilgileri

const usernameBox = document.getElementById("username");
const balanceBox = document.getElementById("balance");
const roleBox = document.getElementById("role");
const createdBox = document.getElementById("created");



// Oturum kontrolü

onAuthStateChanged(auth, async (user)=>{


    if(!user){

        window.location.replace("index.html");
        return;

    }



    const userRef = doc(
        db,
        "users",
        user.uid
    );


    const snap = await getDoc(userRef);



    if(snap.exists()){


        const data = snap.data();



        if(usernameBox){

            usernameBox.textContent =
            data.username;

        }



        if(balanceBox){

            balanceBox.textContent =
            data.balance + " €";

        }



        if(roleBox){

            roleBox.textContent =
            data.admin
            ? "👑 Admin"
            : "👤 Vatandaş";

        }



        if(createdBox && data.createdAt){


            let date;


            if(data.createdAt.toDate){

                date = data.createdAt.toDate();

            }
            else{

                date = new Date(data.createdAt);

            }



            createdBox.textContent =
            date.toLocaleDateString("tr-TR");


        }


    }


});




// Çıkış

const logoutBtn =
document.getElementById("logoutBtn");



if(logoutBtn){


    logoutBtn.onclick = async()=>{


        await signOut(auth);


        window.location.replace("index.html");


    };


}