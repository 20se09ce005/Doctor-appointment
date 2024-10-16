import React from "react";
import { Routes, Route } from 'react-router-dom'
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ApplyDoctor from "../pages/ApplyDoctor";
import ApplyTicket from "../pages/ApplyTicket";
import Notifications from "../pages/Notifications";
import Appointments from "../pages/Appointments";
import BookAppointment from "../pages/BookAppointment";
import Userslist from "../pages/Admin/Userslist";
import DoctorsList from "../pages/Admin/DoctorsList";
import Profile from "../pages/Doctor/Profile";
import DoctorAppointments from "../pages/Doctor/DoctorAppointments";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import Layout from "../components/Layout";

const routes = [
    //admin
    {
        path: '/admin/userslist',
        layout: 'admin',
        auth: true,
        component: <Userslist />
    },
    {
        path: '/admin/doctorslist',
        layout: 'admin',
        auth: true,
        component: <DoctorsList />
    },

    //doctor
    {
        path: '/doctor/appointments',
        layout: 'doctor',
        auth: true,
        component: <DoctorAppointments />
    },
    {
        path: '/doctor/profile/:userId',
        layout: 'doctor',
        auth: true,
        component: <Profile />
    },

    //user
    {
        path: 'appointments',
        layout: 'user',
        auth: true,
        component: <Appointments />
    },
    {
        path: '/apply-doctor',
        layout: 'user',
        auth: true,
        component: <ApplyDoctor />
    },

    //common
    {
        path: '/',
        auth: true,
        component: <Home />
    },
    {
        path: '/book-appointment/:doctorId',
        auth: true,
        component: <BookAppointment />
    },
    {
        path: '/notifications',
        auth: true,
        component: <Notifications />
    },
    {
        path: '/apply-ticket',
        auth: true,
        component: <ApplyTicket />
    },
    {
        path: '/login',
        auth: false,
        component: <Login />
    },
    {
        path: '/register',
        auth: false,
        component: <Register />
    },
];

const MainRoutes = () => {
    return (
        <Routes>
            {routes.map((info) => {
                if (info.auth === true) {
                    return (
                        <Route element={<ProtectedRoute></ProtectedRoute>} >
                            <Route path={info.path} element={<Layout>{info.component}</Layout>}/>
                        </Route>
                    );
                } else if (info.auth === false) {
                    return (
                        <Route element={<PublicRoute></PublicRoute >}>
                            <Route path={info.path} element={info.component} />
                        </Route>
                    )
                }
            })}
        </Routes>
    )
}

export default (MainRoutes)