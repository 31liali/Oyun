import {
    auth,
    db,
    storage,
    onAuthStateChanged,
    collection,
    addDoc,
    serverTimestamp,
    ref,
    uploadBytes,
    getDownloadURL,
    doc,
    getDoc
} from "./firebase.js";

let currentUser = null;
let currentData = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.replace("index.html");
        return;
    }

    currentUser = user;

    const snap = await getDoc(
        doc(db, "users", user.uid)
    );

    if (snap.exists()) {
        currentData = snap.data();
    }

});

const sendBtn = document.getElementById("sendDepositBtn");

if (sendBtn) {

    sendBtn.onclick = async () => {

        const amount = Number(
            document.getElementById("euroAmount").value
        );

        const image =
            document.getElementById("euroImage").files[0];

        if (!amount || !image) {

            alert("Miktar ve fotoğraf gerekli.");
            return;

        }

        try {

            // Storage'a yükle
            const fileRef = ref(
                storage,
                "deposits/" +
                currentUser.uid +
                "_" +
                Date.now() +
                "_" +
                image.name
            );

            await uploadBytes(fileRef, image);

            const imageUrl =
                await getDownloadURL(fileRef);

            // Firestore'a kaydet
            await addDoc(
                collection(db, "deposits"),
                {

                    userId: currentUser.uid,

                    username: currentData.username,

                    amount: amount,

                    imageUrl: imageUrl,

                    status: "waiting",

                    createdAt: serverTimestamp()

                }
            );

            alert("Yükleme isteği başarıyla gönderildi.");

            window.location.href = "trbank.html";

        } catch (err) {

            console.error(err);
            alert("Bir hata oluştu.");

        }

    };

}
