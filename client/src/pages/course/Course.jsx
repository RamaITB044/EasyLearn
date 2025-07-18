import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Course.scss'
import Axios from 'axios'
import useCourseStore from '../../store/useCourseStore';
import useUserStore from '../../store/useUserStore';
import { Button, Card } from '@material-tailwind/react';
import Cookies from 'js-cookie';
import ChapterList from '../../components/chapterList/ChapterList';
import toast, { Toaster } from 'react-hot-toast';

const APP_SERVER = import.meta.env.VITE_APP_SERVER;

const Course = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    // const [courseResp, setCourseResp] = useState({});
    const setCourse = useCourseStore(state => state.setCourse);
    const course = useCourseStore(state => state.course);
    const user = useUserStore(state => state.user);
    const setUser = useUserStore((state) => state.setUser);

    const fetchCourseDetails = async () => {
        if (course?._id === courseId) {
            console.log("Already fetched course details");
            return
        }
        try {
            const courseResp = await Axios.get(APP_SERVER + `/api/course/${courseId}`, {
                headers: {
                    Authorization: "Bearer " + Cookies.get('token')
                }
            });
            // setCourseResp(courseResp.data.course);
            setCourse(courseResp.data.course);
        } catch (err) {
            toast.error("Something went wrong!");
            console.log(err);
        }
    }

    useEffect(() => {
        if (!courseId) return navigate('/app/courses');
        fetchCourseDetails();
    }, [])

    return (
        <Card className="w-full p-2" id="resp-con">
        <Toaster/>
            <div className="flex flex-wrap h-screen">
                <div className="relative w-full lg:w-1/2 md:w-2/3 px-4 sm:px-8">
                    <h1 className="text-2xl md:text-3xl lg:text-5xl ">{course?.title}</h1>
                    <ChapterList course={course} />
                    <div className='w-full flex justify-end p-2 pt-4'>

                    </div>
                    {/* <p className='absolute bottom-4 w-[90%]'>The generated curriculum provided by this app aims to foster curiosity, knowledge, and learning. It should be used as a helpful tool to supplement your educational journey.</p> */}
                </div>
                <div className="hidden w-full lg:w-1/2 md:w-1/3 md:block overflow-hidden course-img"></div>
            </div>
        </Card>
    )
}

export default Course