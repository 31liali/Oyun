// admin.js

import {
    auth,
    db,
    onAuthStateChanged,
    doc,
    getDoc,
    collection,
    getDocs,
    updateDoc
} from "./firebase.js";


const usersBox =
document.getElementById("usersList");



let adminUser = null;



onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location.replace("index.html");
        return;

    }



    const adminRef =
    doc(
        db,
        "users",
        user.uid
    );



    const adminSnap =
    await getDoc(adminRef);



    if(!adminSnap.exists()){

        window.location.replace("home.html");
        return;

    }



    const adminData =
    adminSnap.data();



    if(!adminData.admin){

        alert("Yetkiniz yok.");

        window.location.replace("home.html");

        return;

    }



    adminUser = user;


    loadUsers();


});





async function loadUsers(){


    const snap =
    await getDocs(
        collection(db,"users")
    );



    usersBox.innerHTML = "";



    snap.forEach((item)=>{


        const data =
        item.data();



        usersBox.innerHTML +=
        `

        <div class="card">

        <h3>
        👤 ${data.username}
        </h3>

        <p>
        Bakiye:
        ${data.balance} €
        </p>


        <button onclick="addMoney('${item.id}')">

        💶 Para Ekle

        </button>


        </div>

        `;


    });


}




window.addMoney = async function(uid){


    const amount =
    Number(
        prompt("Eklenecek miktar (€)")
    );



    if(!amount || amount <= 0){

        return;

    }



    const userRef =
    doc(
        db,
        "users",
        uid
    );



    const snap =
    await getDoc(userRef);



    const data =
    snap.data();



    await updateDoc(
        userRef,
        {

            balance:
            data.balance + amount

        }
    );



    alert(
        amount+" € eklendi."
    );


    location.reload();


};