import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FeedScreen from "../screens/FeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import GroupsScreen from "../screens/GroupsScreen";
import BadgeScreen from "../screens/BadgeScreen";
import CheckInScreen from "../screens/CheckInScreen";
// riceve l'oggetto user e lo passa a cascata (FeedScreen, ProfileScreen, ecc.).
// Questo evita l'uso complesso di Redux, mantenendo l'app leggera:
// se l'utente fa logout, lo stato si pulisce in alto e l'interfaccia si resetta.
export default function AppRouter({ user, onLogout }) {
    return (
        <>
            <Navbar onLogout={onLogout} />

            <Routes>
                <Route path="/" element={<Navigate to="/feed" />} />
                <Route path="/feed" element={<FeedScreen user={user} />} />
                <Route path="/profile" element={<ProfileScreen user={user} />} />

                <Route path="/groups" element={<GroupsScreen />} />
                <Route path="/badges" element={<BadgeScreen />} />
                <Route path="/checkin" element={<CheckInScreen user={user} />} />

                <Route path="/login" element={<Navigate to="/feed" />} />
                <Route path="/register" element={<Navigate to="/feed" />} />
            </Routes>
        </>
    );
}