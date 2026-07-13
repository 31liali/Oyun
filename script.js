console.log("script.js başladı");

import {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    doc,
    setDoc
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

        // Admin hesabı
        if (username === "a.b") {

            await signInWithEmailAndPassword(
                auth,
                "a.b@rpdevlet.com",
                password
            );

            location.href = "admin.html";
            return;
        }

        // Normal kullanıcı
        const email = username + "@rpdevlet.com";

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        location.href = "home.html";

    } catch (e) {

        console.error(e);
        alert("Kullanıcı adı veya şifre yanlış.");

    }

};
