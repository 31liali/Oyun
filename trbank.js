// trbank.js

import {
    auth,
    db,
    onAuthStateChanged,
    doc,
    getDoc,
    updateDoc,
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "./firebase.js";

const balanceBox = document.getElementById("balance");
const historyBox = document.getElementById("historyList");

let currentUser = null;
let currentData = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.replace("index.html");
        return;
    }

    currentUser = user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        alert("Kullanıcı bulunamadı.");
        return;
    }

    currentData = snap.data();

    if (balanceBox) {
        balanceBox.textContent = currentData.balance + " €";
    }

    loadHistory();

});

// =======================
// Para Gönder
// =======================

const sendBtn = document.getElementById("sendMoneyBtn");

if (sendBtn) {

    sendBtn.onclick = async () => {

        const username = prompt("Gönderilecek kullanıcı adı:");

        if (!username) return;

        const amount = Number(prompt("Gönderilecek miktar (€):"));

        if (amount <= 0) return;

        if (amount > currentData.balance) {

            alert("Yetersiz bakiye.");
            return;

        }

        const users = await getDocs(collection(db, "users"));

        let target = null;

        users.forEach((item) => {

            const data = item.data();

            if (data.username.toLowerCase() === username.toLowerCase()) {

                target = {
                    uid: item.id,
                    ...data
                };

            }

        });

        if (!target) {

            alert("Kullanıcı bulunamadı.");
            return;

        }

        await updateDoc(
            doc(db, "users", currentUser.uid),
            {
                balance: currentData.balance - amount
            }
        );

        await updateDoc(
            doc(db, "users", target.uid),
            {
                balance: Number(target.balance || 0) + amount
            }
        );

        await addDoc(
            collection(db, "transactions"),
            {
                type: "transfer",
                from: currentData.username,
                to: target.username,
                amount,
                createdAt: serverTimestamp()
            }
        );

        alert("Para gönderildi.");

        location.reload();

    };

}

// =======================
// Para İste
// =======================

const requestBtn = document.getElementById("requestMoneyBtn");

if (requestBtn) {

    requestBtn.onclick = async () => {

        const username = prompt("Kimden para istiyorsun?");

        if (!username) return;

        const amount = Number(prompt("İstenen miktar (€):"));

        if (amount <= 0) return;

        await addDoc(
            collection(db, "moneyRequests"),
            {
                from: username,
                to: currentData.username,
                amount,
                status: "Bekliyor",
                createdAt: serverTimestamp()
            }
        );

        alert("Para isteği gönderildi.");

    };

}

// =======================
// İşlem Geçmişi
// =======================

async function loadHistory() {

    if (!historyBox) return;

    historyBox.innerHTML = "";

    const snap = await getDocs(collection(db, "transactions"));

    snap.forEach((item) => {

        const data = item.data();

        historyBox.innerHTML += `
<div class="card">

<p>
💶 ${data.amount} €
</p>

<p>
${data.from} ➜ ${data.to}
</p>

</div>
`;

    });

}
