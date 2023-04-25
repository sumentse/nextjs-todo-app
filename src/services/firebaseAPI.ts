import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getFirestore,
  UpdateData,
  orderBy,
  query,
} from "firebase/firestore";

const COLLECTION_NAME = "tasks";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const create = async (data: any): Promise<Task> => {
  const newDocRef = await addDoc(
    collection(getFirestore(), COLLECTION_NAME),
    data
  );
  const newDocSnapshot = await getDoc(
    doc(getFirestore(), COLLECTION_NAME, newDocRef.id)
  );
  const snapshot = newDocSnapshot.data();
  return {
    id: newDocRef.id,
    ...snapshot,
    createdAt: snapshot!.createdAt.toDate(),
    updatedAt: snapshot!.updatedAt.toDate(),
  } as Task;
};

export const read = async (): Promise<Task[]> => {
  const tasksSnapshot = await getDocs(
    query(
      collection(getFirestore(), COLLECTION_NAME),
      orderBy("createdAt", "asc")
    )
  );
  return tasksSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Task;
  });
};

export const update = <T extends Record<string, unknown>>(
  id: string,
  data: UpdateData<T>
): Promise<void> => updateDoc(doc(getFirestore(), COLLECTION_NAME, id), data);

export const remove = (id: string): Promise<void> =>
  deleteDoc(doc(getFirestore(), COLLECTION_NAME, id));
