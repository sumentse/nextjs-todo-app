import { SwapOrder } from "@/types";
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
  writeBatch,
} from "firebase/firestore";

enum COLLECTIONS {
  TASKS = "tasks",
  COUNTERS = "counters",
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const swapOrder = async (source: SwapOrder, target: SwapOrder) => {
  const db = getFirestore();
  const batch = writeBatch(db);
  const refOne = doc(db, COLLECTIONS.TASKS, source.id);
  batch.update(refOne, { order: target.order, updatedAt: new Date() });
  const refTwo = doc(db, COLLECTIONS.TASKS, target.id);
  batch.update(refTwo, { order: source.order, updatedAt: new Date() });
  await batch.commit();
};

export const create = async (data: any): Promise<Task> => {
  const counterDocRef = doc(
    getFirestore(),
    COLLECTIONS.COUNTERS,
    "tasksCounter"
  );
  const counterSnapshot = await getDoc(counterDocRef);

  const counterData = counterSnapshot.data();

  const newDocRef = await addDoc(
    collection(getFirestore(), COLLECTIONS.TASKS),
    {
      ...data,
      order: counterData!.value + 1,
    }
  );

  await updateDoc(counterDocRef, {
    value: counterData!.value + 1,
  });

  const newDocSnapshot = await getDoc(
    doc(getFirestore(), COLLECTIONS.TASKS, newDocRef.id)
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
      collection(getFirestore(), COLLECTIONS.TASKS),
      orderBy("order", "asc")
    )
  );
  return tasksSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Task;
  });
};

export const update = <T extends Record<string, unknown>>(
  id: string,
  data: UpdateData<T>
): Promise<void> =>
  updateDoc(doc(getFirestore(), COLLECTIONS.TASKS, id), {
    ...data,
    updatedAt: new Date(),
  });

export const remove = (id: string): Promise<void> =>
  deleteDoc(doc(getFirestore(), COLLECTIONS.TASKS, id));
