import React, { useEffect, useState } from 'react'
import './Sidebar.scss'
import { NavLink, useNavigate } from "react-router-dom"
import { motion } from 'framer-motion'
import { sidebarRoutes } from './sidebarRoutes';
import magic from '../../services/magic';
import Cookies from 'js-cookie'
import app_logo from '../../assets/images/easy_lern.svg'
import { useMediaQuery } from 'react-responsive';
import {
    Card,
    List,
    ListItem,
    ListItemPrefix,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
} from "@material-tailwind/react";
import {
    ArrowLeftOnRectangleIcon,
    Bars3BottomLeftIcon,
    XMarkIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/solid";
import useAuthStore from '../../store/useAuthStore';
import Modal from "../modal/Modal"
import toast, { Toaster } from 'react-hot-toast';

const Sidebar = () => {
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const isMobile = useMediaQuery({ query: '(max-width: 896px)' });

    useEffect(() => {
        setIsSidebarOpen(!isMobile);
    }, [isMobile]);

    const handleLogout = () => {
        magic.user.logout().then(() => {
            Cookies.remove("token");
            logout();
            navigate("/", { replace: true });
        });
    }
    const handleOpen = (res) => {
        setDialogOpen(!dialogOpen);
        console.log("handler called");
        if (res=="success") {
            toast.success("We have received your feedback!");
            
            return;
        }
    }

    return (
        <>
            <Toaster />
            {isMobile && isSidebarOpen ? <div className="fixed inset-0 bg-black opacity-25 z-40"></div> : null}
            {isMobile && (
                <button className="fixed top-4 left-0 z-30 p-2"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <Bars3BottomLeftIcon className="h-5 w-5" />
                </button>
            )}
            <Card className={`box-border h-[calc(100vh-2rem)] max-w-[18rem] p-2 shadow-xl shadow-blue-gray-900/5 ${isMobile ? 'rounded-l-none h-full fixed inset-0 z-40 transform transition-all ease-in-out duration-300' : ''
                } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="px-4 py-2 flex justify-between">
                    <img src={app_logo} alt="EasyLearn" className='app-logo' />
                    {isMobile && <button className="p-2"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>}
                </div>
                <List className='w-full'>
                    {sidebarRoutes.map((route, index) => {
                        return <NavLink to={route.path} key={route.name}>
                            <ListItem>
                                <ListItemPrefix>
                                    <route.icon className="h-5 w-5" />
                                </ListItemPrefix>
                                {route.name}
                            </ListItem>
                        </NavLink>
                    })}
                </List>
                <List className='absolute bottom-4 left-2'>
                    <ListItem className='top-auto' onClick={()=>handleOpen()} variant="gradient">
                        <ListItemPrefix>
                            <PencilSquareIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Feedback
                    </ListItem>
                    <ListItem className='top-auto' onClick={handleLogout}>
                        <ListItemPrefix>
                            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Logout
                    </ListItem>
                </List>
                <Dialog open={dialogOpen} handler={handleOpen} size={"xs"}>
                    <Modal handler={handleOpen} />
                </Dialog>
            </Card>
        </>
    )
}

export default Sidebar