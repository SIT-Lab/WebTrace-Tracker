import { Timestamp } from 'firebase/firestore';

export const nowTime = () => {
  return Timestamp.now();
};
