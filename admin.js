// admin.js

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
    serverTimestamp,
    query,
    where
} from "./firebase.js";

const usersBox = document.getElementById("usersList");
const userCountBox = document.getElementById("userCount");
const totalBalanceBox = document.getElementById("totalBalance");

const moneyUser = document.getElementById("moneyUsername");
const moneyAmount = document.getElementById("moneyAmount");
const sendMoneyBtn = document.getElementById("sendMoneyBtn");

const fineUser = document.getElementById("fineUsername");
const fineReason = document.getElementById("fineReason");
const fineAmount = document.getElementById("fineAmount");
const fineBtn = document.getElementById("fineBtn");

const licenseUser = document.getElementById("licenseUsername");
const giveLicenseBtn = document.getElementById("giveLicenseBtn");
const removeLicenseBtn = document.getElementById("removeLicenseBtn");

let currentAdmin = null;
let users = [];

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.replace("index.html");
        return;
    }

    currentAdmin = user;

    const adminRef = doc(db, "users", user.uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
        alert("Admin bilgisi bulunamadı.");
        location.replace("home.html");
        return;
    }

    if (!adminSnap.data().admin) {
        alert("Bu sayfaya giriş yetkin yok.");
        location.replace("home.html");
        return;
    }

    loadUsers();

});

async function loadUsers() {

    users = [];

    usersBox.innerHTML = "";

    let toplamPara = 0;

    const snap = await getDocs(collection(db, "users"));

    snap.forEach((item) => {

        const data = item.data();

        toplamPara += Number(data.balance || 0);

        users.push({
            uid: item.id,
            ...data
        });

        usersBox.innerHTML += `

<div class="card">

<h3>👤 ${data.username}</h3>

<p>💶 ${data.balance} €</p>

<p>${data.admin ? "👑 Admin" : "👤 Vatandaş"}</p>

<p>${data.license ? "🚗 Ehliyeti Var" : "❌ Ehliyeti Yok"}</p>

</div>

`;

    });

    userCountBox.textContent = users.length;
    totalBalanceBox.textContent = toplamPara + " €";

}

function findUser(username){

    username = username.trim().toLowerCase();

    return users.find(
        x => x.username.toLowerCase() === username
    );

}
// ==========================
// Para Gönder
// ==========================

if (sendMoneyBtn) {

    sendMoneyBtn.onclick = async () => {

        const user = findUser(moneyUser.value);

        if (!user) {
            alert("Kullanıcı bulunamadı.");
            return;
        }

        const amount = Number(moneyAmount.value);

        if (amount <= 0) {
            alert("Geçerli miktar gir.");
            return;
        }

        await updateDoc(
            doc(db, "users", user.uid),
            {
                balance: Number(user.balance || 0) + amount
            }
        );

        await addDoc(
            collection(db, "transactions"),
            {
                type: "admin_money",
                username: user.username,
                amount: amount,
                admin: currentAdmin.uid,
                createdAt: serverTimestamp()
            }
        );

        alert("Para gönderildi.");

        loadUsers();

    };

}

// ==========================
// Ceza Kes
// ==========================

if (fineBtn) {

    fineBtn.onclick = async () => {

        const user = findUser(fineUser.value);

        if (!user) {
            alert("Kullanıcı bulunamadı.");
            return;
        }

        const amount = Number(fineAmount.value);

        if (amount <= 0) {
            alert("Ceza miktarı hatalı.");
            return;
        }

        await addDoc(
            collection(db, "fines"),
            {
                uid: user.uid,
                username: user.username,
                reason: fineReason.value,
                amount: amount,
                paid: false,
                createdAt: serverTimestamp()
            }
        );

        alert("Ceza kesildi.");

    };

}

// ==========================
// Ehliyet Ver
// ==========================

if (giveLicenseBtn) {

    giveLicenseBtn.onclick = async () => {

        const user = findUser(licenseUser.value);

        if (!user) {
            alert("Kullanıcı bulunamadı.");
            return;
        }

        await updateDoc(
            doc(db, "users", user.uid),
            {
                license: true
            }
        );

        alert("Ehliyet verildi.");

        loadUsers();

    };

}

// ==========================
// Ehliyeti Al
// ==========================

if (removeLicenseBtn) {

    removeLicenseBtn.onclick = async () => {

        const user = findUser(licenseUser.value);

        if (!user) {
            alert("Kullanıcı bulunamadı.");
            return;
        }

        await updateDoc(
            doc(db, "users", user.uid),
            {
                license: false
            }
        );

        alert("Ehliyet kaldırıldı.");

        loadUsers();

    };

}

// ==========================
// TRBank Talepleri
// ==========================

async function loadDepositRequests() {

    const box = document.getElementById("depositRequests");

    if (!box) return;

    box.innerHTML = "Yakında aktif olacak.";

}

async function loadDepositRequests() {

    const box = document.getElementById("depositRequests");

    if (!box) return;

    box.innerHTML = "";

    const snap = await getDocs(
        query(
            collection(db, "deposits"),
            where("status", "==", "waiting")
        )
    );

    if (snap.empty) {

        box.innerHTML = "<p>Bekleyen talep yok.</p>";
        return;

    }

    snap.forEach((item) => {

        const data = item.data();

        box.innerHTML += `

<div class="card">

<h3>👤 ${data.username}</h3>

<p>💶 ${data.amount} €</p>

<img
src="${data.imageUrl}"
style="width:100%;border-radius:10px;margin-top:10px;">

<br><br>

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
window.approveDeposit = async function(depositId,userId,amount){

    const userRef = doc(db,"users",userId);

    const userSnap = await getDoc(userRef);

    if(!userSnap.exists()) return;

    const data = userSnap.data();

    await updateDoc(userRef,{
        balance:Number(data.balance||0)+Number(amount)
    });

    await updateDoc(
        doc(db,"deposits",depositId),
        {
            status:"approved"
        }
    );

    alert("Para hesaba aktarıldı.");

    loadUsers();
    loadDepositRequests();

};

window.rejectDeposit = async function(depositId){

    await updateDoc(
        doc(db,"deposits",depositId),
        {
            status:"rejected"
        }
    );

    alert("Talep reddedildi.");

    loadDepositRequests();

};
