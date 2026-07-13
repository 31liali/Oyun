// admin_deposit.js

import {
    auth,
    db,
    onAuthStateChanged,
    doc,
    getDoc,
    updateDoc,
    collection,
    getDocs,
    addDoc,
    serverTimestamp
} from "./firebase.js";


const depositsBox =
document.getElementById("depositsList");



onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location.replace("index.html");
        return;

    }


    const adminRef =
    doc(db,"users",user.uid);


    const adminSnap =
    await getDoc(adminRef);



    if(!adminSnap.exists() || !adminSnap.data().admin){

        alert("Yetkiniz yok.");

        window.location.replace("home.html");

        return;

    }


    loadDeposits();


});





async function loadDeposits(){


    const snap =
    await getDocs(
        collection(db,"deposits")
    );


    depositsBox.innerHTML="";


    snap.forEach((item)=>{


        const data =
        item.data();



        if(data.status !== "waiting")
            return;



        depositsBox.innerHTML +=
        `

        <div class="card">

        <h3>
        💶 ${data.amount} €
        </h3>

        <p>
        Kullanıcı ID:
        ${data.userId}
        </p>


        <button onclick="approveDeposit('${item.id}','${data.userId}',${data.amount})">
        ✅ Onayla
        </button>


        <button onclick="rejectDeposit('${item.id}')">
        ❌ Reddet
        </button>


        </div>

        `;


    });


}






window.approveDeposit = async function(id,uid,amount){


    const userRef =
    doc(db,"users",uid);



    const userSnap =
    await getDoc(userRef);



    const userData =
    userSnap.data();



    // Para ekle

    await updateDoc(
        userRef,
        {
            balance:
            userData.balance + amount
        }
    );



    // İstek durumunu değiştir

    await updateDoc(
        doc(db,"deposits",id),
        {
            status:"approved"
        }
    );



    // Bildirim oluştur

    await addDoc(

        collection(
            db,
            "users",
            uid,
            "notifications"
        ),

        {

            title:"Euro Yüklendi",

            message:
            amount +
            " € hesabına eklendi.",

            read:false,

            date:serverTimestamp()

        }

    );



    alert("Onaylandı ve bildirim gönderildi.");

    location.reload();


};







window.rejectDeposit = async function(id){


    const depositRef =
    doc(
        db,
        "deposits",
        id
    );


    const depositSnap =
    await getDoc(depositRef);


    const data =
    depositSnap.data();



    await updateDoc(
        depositRef,
        {
            status:"rejected"
        }
    );



    // Reddedilme bildirimi

    await addDoc(

        collection(
            db,
            "users",
            data.userId,
            "notifications"
        ),

        {

            title:"Euro Yükleme Reddedildi",

            message:
            "Euro yükleme isteğin reddedildi.",

            read:false,

            date:serverTimestamp()

        }

    );



    alert("Reddedildi.");

    location.reload();


};