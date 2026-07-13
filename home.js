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
const adminBtn = document.getElementById("adminBtn");

// Oturum kontrolü
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.replace("index.html");
        return;
    }

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        alert("Kullanıcı verisi bulunamadı.");
        return;
    }

    const data = snap.data();

    // Kullanıcı adı
    if (usernameBox) {
        usernameBox.textContent = data.username;
    }

    // Bakiye
    if (balanceBox) {
        balanceBox.textContent = (data.balance || 0) + " €";
    }

    // Rol
    if (roleBox) {
        roleBox.textContent = data.admin ? "👑 Admin" : "👤 Vatandaş";
    }

    // Kayıt tarihi
    if (createdBox && data.createdAt) {

        let date;

        if (data.createdAt.toDate) {
            date = data.createdAt.toDate();
        } else {
            date = new Date(data.createdAt);
        }

        createdBox.textContent = date.toLocaleDateString("tr-TR");
    }

    // Admin Paneli Butonu
    if (adminBtn) {
        if (data.admin === true) {
            adminBtn.style.display = "block";
        } else {
            adminBtn.style.display = "none";
        }
    }

});

// Çıkış
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.onclick = async () => {

        await signOut(auth);
        window.location.replace("index.html");

    };

}
