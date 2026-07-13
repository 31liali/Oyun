console.log("script.js başladı");

import {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    doc,
    setDoc
} from "./firebase.js";

// Sayfalar
window.showRegister = () => {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("registerPage").style.display = "block";
};

window.showLogin = () => {
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("registerPage").style.display = "none";
};

// Kayıt
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

        const email = username + "@gmail.com";

        const user = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await setDoc(
            doc(db, "users", user.user.uid),
            {
                username,
                balance: 0,
                role: "Vatandaş",
                createdAt: Date.now(),
                admin: false
            }
        );

        location.href = "home.html";

    } catch (e) {

        alert(e.message);
        console.error(e);

    }

};

// ==========================
// Giriş
// ==========================

window.login = async function () {

    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value;

    try {

        // ADMIN GİRİŞİ
        if (username === "A.B") {

            await signInWithEmailAndPassword(
                auth,
                "A.B@gmail.com",
                "A.B4141"
            );

            location.href = "admin.html";
            return;
        }

        // NORMAL KULLANICI
        const email = username + "@rpdevlet.app";

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        location.href = "home.html";

    } catch (err) {

        console.error(err);
        alert("Kullanıcı adı veya şifre yanlış.");

    }

};
window.login = window.login;
window.register = window.register;
window.showRegister = window.showRegister;
window.showLogin = window.showLogin;
};
