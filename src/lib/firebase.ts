// Import the functions you need from the SDKs you need

import { error } from "console";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { resolve } from "path";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJ1yAWpYhHF59CUqhaj80qsJ8wl6qtDS0",
  authDomain: "repomind-5ec77.firebaseapp.com",
  projectId: "repomind-5ec77",
  storageBucket: "repomind-5ec77.firebasestorage.app",
  messagingSenderId: "590524744881",
  appId: "1:590524744881:web:dcaa902c3574205e48ce90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFile(file: File , setProgess?: (progress: number) => void) {
    return new Promise((resolve, reject) => {
        try {
            const stroageRef = ref(storage, file.name)
            const uploadTask = uploadBytesResumable(stroageRef, file)

            uploadTask.on('state_changed', snapshot => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                if(setProgess) setProgess(progress)
                    switch( snapshot.state){
                        case 'paused':
                            console.log('upload is paused'); break;
                        case 'running':
                            console.log('upload is running'); break;

                    }

            }, error => {
                reject(error)
            }, () => { 
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                    resolve(downloadURL as string) 
                })
            })
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}