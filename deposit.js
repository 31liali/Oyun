import {
    auth,
    db,
    onAuthStateChanged,
    collection,
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





window.sendDeposit = async function(){


    const amount =
    Number(
        document.getElementById("euroAmount").value
    );


    const image =
    document.getElementById("euroImage").files[0];



    if(!amount || !image){

        alert("Miktar ve fotoğraf gerekli.");

        return;

    }



    await addDoc(

        collection(
            db,
            "deposits"
        ),

        {

            userId: currentUser.uid,

            amount: amount,

            imageName: image.name,

            status:"waiting",

            date:serverTimestamp()

        }

    );



    alert("Yükleme isteği gönderildi.");

    window.location.href="home.html";


};