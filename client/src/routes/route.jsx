import React from "react";
import { Routes, Route } from 'react-router-dom'
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ApplyDoctor from "../pages/ApplyDoctor";
import ApplyTicket from "../pages/ApplyTicket";
import ComplainTickets from "../pages/ComplainTickets";
import Notifications from "../pages/Notifications";
import Appointments from "../pages/Appointments";
import BookAppointment from "../pages/BookAppointment";
import TicketForm from "../pages/TicketForm";
import Userslist from "../pages/Admin/Userslist";
import DoctorsList from "../pages/Admin/DoctorsList";
import Profile from "../pages/Doctor/Profile";
import PatientChat from "../pages/Patient/PatientChat";
import AdminChat from "../pages/Admin/AdminChat";
import SupportTickets from "../pages/Admin/SupportTickets";
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
    {
        path: '/admin/support-tickets',
        layout: 'admin',
        auth: true,
        component: <SupportTickets />
    },
    {
        path: '/Admin-Chat',
        layout: 'admin',
        auth: true,
        component: <AdminChat />
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
    {
        path: '/Patient-Chat',
        layout: 'user',
        auth: true,
        component: <PatientChat />
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
        path: '/apply-ticket-form',
        auth: true,
        component: <TicketForm />
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
    },{
        path: '/complain-tickets',
        auth: true,
        component: <ComplainTickets />
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
                            <Route path={info.path} element={<Layout>{info.component}</Layout>} />
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