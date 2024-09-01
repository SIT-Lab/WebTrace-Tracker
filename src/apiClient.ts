// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";

import { nowTime } from './utils/time'; //현재 시간 불러오기
import { LogArray, ResultData } from './interfaces/apiTypes'; //만들어둔 타입(인터페이스) 가져오기
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

/**
 * Base64 데이터를 Firebase Storage에 업로드하고 URL을 반환하는 함수
 * @param {string} base64Data - Base64 인코딩된 데이터
 * @param {string} fileName - 저장할 파일의 이름
 * @returns {Promise<string>} - 업로드된 파일의 다운로드 URL
 */
export const uploadBase64ToStorage = async (base64Data: string, fileName: string): Promise<string> => {
  try {
    const fileRef = ref(storage, `images/${fileName}`);

    // Base64 데이터를 'data_url' 포맷으로 업로드
    const snapshot = await uploadString(fileRef, base64Data, 'data_url');

    // 업로드된 파일의 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Base64 image uploaded with URL:', downloadURL);

    return downloadURL; // 이미지 파일의 URL을 반환
  } catch (error) {
    console.error('Error uploading Base64 image:', error);
    throw new Error('Failed to upload Base64 image');
  }
};

/**
 * 로그 데이터를 Firebase Firestore에서 가져오는 함수
 * @param {string} userId - 사용자 ID
 * @param {string} taskSuiteId - task suite ID
 * @param {string} taskId - 태스크 ID
 * @returns {Promise<void>}
 */
export const getLog = async (
  userId = 'cCYeFqNi5qU7bIdhbtGI',
  taskSuiteId = 'NVxzx3mo1KcwdVVd90yA',
  taskId = 'ltAzJeOpJs0HYf9tdMsH'
) => {
  try {
    const docRef = doc(db, `project/${userId}/taskSuite/${taskSuiteId}/task/${taskId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
    } else {
      throw 'No such document!';
    }
  } catch (error) {
    console.log('getLog error : ' + error);
  }
};

/**
 * 특정 문서가 Firestore에 존재하는지 확인하는 함수
 * @param {string} projectId - 프로젝트 ID
 * @param {string} taskSuiteId - task suite ID
 * @param {string} taskId - 태스크 ID
 * @returns {Promise<boolean>}
 */
export const isRefExists = async (
  projectId: string,
  taskSuiteId: string,
  taskId: string
) => {
  const ref = await doc(
    db,
    `project/${projectId}/taskSuite/${taskSuiteId}/task/${taskId}`
  );
  const docSnap = await getDoc(ref);

  console.log(docSnap.exists());
  return docSnap.exists();
};

/**
 * 특정 태스크의 문서 참조를 가져오는 함수
 * @param {string} projId - 프로젝트 ID
 * @param {string} taskSuiteId - task suite ID
 * @param {string} taskId - 태스크 ID
 * @returns {Promise<DocumentReference | void>}
 */
const getTaskRef = async (projId: string, taskSuiteId: string, taskId: string) => {
  try {
    return doc(db, `project/${projId}/taskSuite/${taskSuiteId}/task/${taskId}`);
  } catch (err) {
    console.log('setTaskRef error:' + err);
  }
};

/**
 * 지정된 길이의 랜덤 ID를 생성하는 함수
 * @param {number} length - 생성할 ID의 길이
 * @returns {string} - 생성된 랜덤 ID
 */
function generateRandomId(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = ~~(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

/**
 * 로그 데이터를 Firestore에 저장하는 함수
 * @param {LogArray} log - 로그 데이터 배열
 * @param {string} projectId - 프로젝트 ID
 * @param {string} taskSuiteId - 태스크수트 ID
 * @param {string} taskId - 태스크 ID
 * @returns {Promise<void>}
 */
export const setTask = async (
  log: LogArray,
  projectId: string,
  taskSuiteId: string,
  taskId: string
) => {
  try {
    const docRef = await getTaskRef(projectId, taskSuiteId, taskId);
    // log.data를 시간 순으로 정렬
    const sortedLogData = log.data.sort((a, b) => {
      return a.time - b.time;
    });
    if (docRef) {
      await updateDoc(docRef, {
        log: arrayUnion({ data: sortedLogData, result: log.result }),
        modifiedAt: nowTime(),
      });
    }
  } catch (err) {
    console.log('setTask error:', err);
  }
};