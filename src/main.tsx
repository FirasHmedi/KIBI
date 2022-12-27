import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import "./index.css";
import Home from "./pages/home/Home";
import { SignUp } from "./pages/registration/SignUp";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDDg52B5IZ4dHiqdkO3R5J1q3q-t3z_er8",
	authDomain: "kawa-58848.firebaseapp.com",
	projectId: "kawa-58848",
	storageBucket: "kawa-58848.appspot.com",
	messagingSenderId: "883525077090",
	appId: "1:883525077090:web:c7bc21bca0b8548fee693b",
	measurementId: "G-6FX2GG20FJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Layout>
				<Home />
			</Layout>
		),
	},
	{
		path: "/signup",
		element: (
			<Layout>
				<SignUp />
			</Layout>
		),
	},
	{
		path: "/signin",
		element: (
			<Layout>
				<SignUp />
			</Layout>
		),
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
