// transactions.js

import {
    auth,
    db,
    onAuthStateChanged,
    collection,
    getDocs,
    query,
    orderBy
} from "./firebase.js";


const list =
document.getElementById("transactions");



onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location.replace("index.html");
        return;

    }



    const transactionsRef =
    collection(
        db,
        "users",
        user.uid,
        "transactions"
    );



    const q =
    query(
        transactionsRef,
        orderBy(
            "date",
            "desc"
        )
    );



    const snap =
    await getDocs(q);



    if(snap.empty){

        list.innerHTML =
        "<p>Henüz işlem yok.</p>";

        return;

    }



    list.innerHTML = "";



    snap.forEach((item)=>{


        const data =
        item.data();



        let text = "";



        if(data.type === "send"){


            text =
            `
            <p>
            💸 ${data.amount} € gönderildi
            <br>
            Alıcı: ${data.to}
            </p>
            `;


        }



        if(data.type === "receive"){


            text =
            `
            <p>
            💰 ${data.amount} € alındı
            <br>
            Gönderen: ${data.from}
            </p>
            `;


        }



        list.innerHTML += text;


    });



});