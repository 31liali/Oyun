console.log("script.js başladı");

import {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    doc,
    setDoc,
    getDoc
} from "./firebase.js";

// ==========================
// Sayfa Değiştirme
// ==========================

window.showRegister = () => {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("registerPage").style.display = "block";
};

window.showLogin = () => {
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("registerPage").style.display = "none";
};

// ==========================
// Kayıt
// ==========================

window.register = async () => {

    const username = document.getElementById("regUser").value.trim().toLowerCase();
    const password = document.getElementById("regPass").value;
    const password2 = document.getElementById("regPass2").value;

    if (username.length < 3) {
        alert("Kullanıcı adı en az 3 karakter olmalı.");
        return;
    }

    if (password !== password2) {
        alert("Şifreler uyuşmuyor.");
        return;
    }

    try {

        const email = username + "@rpdevlet.com";

        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const isAdmin = (email === "a.b@rpdevlet.com");

        await setDoc(
            doc(db, "users", result.user.uid),
            {
                username,
                balance: isAdmin ? 999999999 : 0,
                role: isAdmin ? "Admin" : "Vatandaş",
                admin: isAdmin,
                createdAt: Date.now()
            }
        );

        if (isAdmin) {
            location.href = "admin.html";
        } else {
            location.href = "home.html";
        }

    } catch (e) {

        console.error(e);
        alert(e.message);

    }

};

// ==========================
// Giriş
// ==========================

window.login = async () => {

    const username = document.getElementById("loginUser").value.trim().toLowerCase();
    const password = document.getElementById("loginPass").value;

    try {

        const email = username + "@rpdevlet.com";

        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const snap = await getDoc(
            doc(db, "users", result.user.uid)
        );

        if (!snap.exists()) {
            alert("Kullanıcı verisi bulunamadı.");
            return;
        }

        const userData = snap.data();

        if (userData.admin === true) {
            location.href = "admin.html";
        } else {
            location.href = "home.html";
        }

    } catch (e) {

        console.error(e);
        alert("Kullanıcı adı veya şifre yanlış.");

    }

};
