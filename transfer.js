// transfer.js

import {
    auth,
    db,
    onAuthStateChanged,
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp
} from "./firebase.js";


let currentUser = null;



onAuthStateChanged(auth,(user)=>{


    if(!user){

        window.location.replace("index.html");
        return;

    }


    currentUser = user;


});





window.sendMoney = async function(){


    const target =
    document.getElementById("targetUser")
    .value
    .trim()
    .toLowerCase();



    const amount =
    Number(
        document.getElementById("sendAmount").value
    );



    if(!target || amount <= 0){

        alert("Bilgileri kontrol et.");
        return;

    }



    // Gönderen bilgisi

    const senderRef =
    doc(
        db,
        "users",
        currentUser.uid
    );


    const senderSnap =
    await getDoc(senderRef);



    if(!senderSnap.exists()){

        alert("Hesap bulunamadı.");
        return;

    }



    const senderData =
    senderSnap.data();



    if(senderData.balance < amount){

        alert("Yetersiz bakiye.");
        return;

    }




    // Alıcı bul

    const q =
    query(
        collection(db,"users"),
        where(
            "username",
            "==",
            target
        )
    );



    const result =
    await getDocs(q);



    if(result.empty){

        alert("Kullanıcı bulunamadı.");
        return;

    }




    const receiver =
    result.docs[0];



    const receiverRef =
    doc(
        db,
        "users",
        receiver.id
    );



    const receiverData =
    receiver.data();





    // Bakiyeleri değiştir

    await updateDoc(
        senderRef,
        {

            balance:
            senderData.balance - amount

        }
    );



    await updateDoc(
        receiverRef,
        {

            balance:
            receiverData.balance + amount

        }
    );





    // Gönderen işlem kaydı

    await addDoc(
        collection(
            db,
            "users",
            currentUser.uid,
            "transactions"
        ),
        {

            type:"send",

            amount:amount,

            to:target,

            date:serverTimestamp()

        }
    );





    // Alıcı işlem kaydı

    await addDoc(
        collection(
            db,
            "users",
            receiver.id,
            "transactions"
        ),
        {

            type:"receive",

            amount:amount,

            from:senderData.username,

            date:serverTimestamp()

        }
    );



    alert(
        amount + " € gönderildi."
    );


    location.reload();


};