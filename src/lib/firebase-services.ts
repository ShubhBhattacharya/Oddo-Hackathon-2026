import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import type {
  Vehicle,
  Driver,
  Trip,
  Maintenance,
  FuelLog,
  Expense,
} from "@/types";

// Vehicles
export const addVehicle = async (vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "vehicles"), {
    ...vehicle,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
  await updateDoc(doc(db, "vehicles", id), {
    ...vehicle,
    updatedAt: serverTimestamp(),
  });
};

export const deleteVehicle = async (id: string) => {
  await deleteDoc(doc(db, "vehicles", id));
};

export const getVehicleById = async (id: string) => {
  const docSnap = await getDoc(doc(db, "vehicles", id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Vehicle;
  }
  return null;
};

// Drivers
export const addDriver = async (driver: Omit<Driver, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "drivers"), {
    ...driver,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateDriver = async (id: string, driver: Partial<Driver>) => {
  await updateDoc(doc(db, "drivers", id), {
    ...driver,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDriver = async (id: string) => {
  await deleteDoc(doc(db, "drivers", id));
};

// Trips
export const addTrip = async (trip: Omit<Trip, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "trips"), {
    ...trip,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateTrip = async (id: string, trip: Partial<Trip>) => {
  await updateDoc(doc(db, "trips", id), {
    ...trip,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTrip = async (id: string) => {
  await deleteDoc(doc(db, "trips", id));
};

// Maintenance
export const addMaintenance = async (
  maintenance: Omit<Maintenance, "id" | "createdAt" | "updatedAt">
) => {
  const docRef = await addDoc(collection(db, "maintenance"), {
    ...maintenance,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateMaintenance = async (
  id: string,
  maintenance: Partial<Maintenance>
) => {
  await updateDoc(doc(db, "maintenance", id), {
    ...maintenance,
    updatedAt: serverTimestamp(),
  });
};

export const deleteMaintenance = async (id: string) => {
  await deleteDoc(doc(db, "maintenance", id));
};

// Fuel Logs
export const addFuelLog = async (fuelLog: Omit<FuelLog, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "fuelLogs"), {
    ...fuelLog,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateFuelLog = async (id: string, fuelLog: Partial<FuelLog>) => {
  await updateDoc(doc(db, "fuelLogs", id), {
    ...fuelLog,
    updatedAt: serverTimestamp(),
  });
};

export const deleteFuelLog = async (id: string) => {
  await deleteDoc(doc(db, "fuelLogs", id));
};

// Expenses
export const addExpense = async (expense: Omit<Expense, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "expenses"), {
    ...expense,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateExpense = async (id: string, expense: Partial<Expense>) => {
  await updateDoc(doc(db, "expenses", id), {
    ...expense,
    updatedAt: serverTimestamp(),
  });
};

export const deleteExpense = async (id: string) => {
  await deleteDoc(doc(db, "expenses", id));
};
