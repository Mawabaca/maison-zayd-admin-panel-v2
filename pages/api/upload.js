import multiparty from 'multiparty';
import fs from 'fs';
import mime from 'mime-types';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { mongooseConnect } from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";


const firebaseConfig = {

  apiKey: "AIzaSyC3ZqZBTyyIo-Y7ijzdVBppMoGBqQDtwM0",

  authDomain: "zayd-ecommerce.firebaseapp.com",

  projectId: "zayd-ecommerce",

  storageBucket: "zayd-ecommerce.appspot.com",

  messagingSenderId: "1076472833015",

  appId: "1:1076472833015:web:118b4c26c392b066b284f2",

  measurementId: "G-B2ZKN3V58L"

};

const firebaseApp = initializeApp(firebaseConfig);

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req,res);

  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  console.log('length:', files.file.length);

  const storage = getStorage(firebaseApp);
  const storageRef = ref(storage, 'gs://zayd-ecommerce.appspot.com/images'); // Specify your custom folder name

  const links = [];

  for (const file of files.file) {
    const ext = file.originalFilename.split('.').pop();
    const newFilename = Date.now() + '.' + ext;
    const fileRef = ref(storageRef, newFilename);
    await uploadBytes(fileRef, fs.readFileSync(file.path), { contentType: mime.lookup(file.path) });

    const link = await getDownloadURL(fileRef);
    links.push(link);
  }

  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};