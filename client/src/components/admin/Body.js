import React, { useState, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import axios from 'axios';
import EngineeringIcon from "@mui/icons-material/Engineering";
import BoyIcon from "@mui/icons-material/Boy";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import Notice from "../notices/Notice";
import ShowNotice from "../notices/ShowNotice";
import ReplyIcon from "@mui/icons-material/Reply";

const Body = () => {
  const [open, setOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState({});
  const notices = useSelector((state) => state.admin.notices.result);
  const students = useSelector((state) => state.admin.allStudent);
  const faculties = useSelector((state) => state.admin.allFaculty);
  const admins = useSelector((state) => state.admin.allAdmin);
  const departments = useSelector((state) => state.admin.allDepartment);
  const [timetableFile, setTimetableFile] = useState(null);
  const [recentTimetable, setRecentTimetable] = useState(null);

  const handleTimetableUpload = async () => {
    try {
      if (!timetableFile) {
        throw new Error("No timetable file selected");
      }

      const formData = new FormData();
      formData.append("file", timetableFile);

      // Make the API call to upload the timetable file
      const response = await axios.post(
        "http://localhost:5000/api/admin/uploadTimeTable",
        formData
      );

      console.log("Timetable file uploaded successfully", response.data);

      // Handle any success logic here

      setTimetableFile(null); // Reset the timetable file state
    } catch (error) {
      console.error("Error uploading timetable file:", error.message);
      // Handle error, show a message, etc.
    }
  };
  const downloadPdf = async () => {
    console.log('Trying to download PDF');
  
    try {
      if (!recentTimetable || !recentTimetable.timetableId) {
        console.error('No valid recent timetable provided');
        return;
      }
  
      console.log('Timetable ID from frontend:', recentTimetable.timetableId);
  
      // Fetch the PDF content by timetable ID
      const pdfResponse = await axios.get(`http://localhost:5000/api/admin/getTimetableById/recent`, {
        responseType: 'arraybuffer',
      });
  
      // Check if the PDF content is valid
      if (!pdfResponse.data) {
        console.error('No PDF content received from the backend');
        return;
      }
  
      // Convert the array buffer to a Blob
      const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });
  
      // Create a data URL from the Blob
      const pdfDataUrl = URL.createObjectURL(pdfBlob);
  
      // Create an anchor element
      const downloadLink = document.createElement('a');
  
      // Set the href attribute to the data URL
      downloadLink.href = pdfDataUrl;
  
      // Set the download attribute to the desired file name or fallback to a generic name
      downloadLink.download = recentTimetable.filename || 'timetable.pdf';
  
      // Append the anchor element to the document
      document.body.appendChild(downloadLink);
  
      // Trigger a click on the anchor element to start the download
      downloadLink.click();
  
      // Remove the anchor element from the document
      document.body.removeChild(downloadLink);
  
      console.log('PDF download initiated successfully');
    } catch (error) {
      console.error('Error initiating PDF download:', error);
      // Handle error, show a message, etc.
    }
  };
  
  // Fetch the recent timetable when the component mounts
  const fetchRecentTimetable = async () => {
    try {
      const recentTimetableResponse = await axios.get("http://localhost:5000/api/admin/getTimetableById/recent");
  
      if (!recentTimetableResponse.data || !recentTimetableResponse.data.success) {
        console.error('No valid recent timetable found');
        return;
      }
  
      setRecentTimetable(recentTimetableResponse.data);
    } catch (error) {
      console.error('Error fetching recent timetable:', error);
      // Handle error, show a message, etc.
    }
  };
  
  useEffect(() => {
    fetchRecentTimetable();
  }, []);
  
  // Empty dependency array ensures the effect runs once when the component mounts

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <HomeIcon />
          <h1>Dashboard</h1>
          <div className="flex text-green-400 items-center ">
            <AddIcon />
            <input
              type="file"
              accept=".pdf" // Adjust accepted file formats as needed
              onChange={(e) => setTimetableFile(e.target.files[0])}
            />
            <button onClick={handleTimetableUpload}>Upload TimeTable</button>
          </div>
        </div>

        <div className="flex flex-col mr-5 space-y-4 overflow-y-hidden">
          <div className="bg-white h-[8rem] rounded-xl shadow-lg grid grid-cols-4 justify-between px-8 items-center space-x-4">
            <div className="flex items-center space-x-4 border-r-2">
              <EngineeringIcon
                className="rounded-full py-2 bg-orange-300"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1>Faculty</h1>
                <h2 className="text-2xl font-bold">{faculties?.length}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 border-r-2">
              <BoyIcon
                className="rounded-full py-2 bg-orange-300"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1>Student</h1>
                <h2 className="text-2xl font-bold">{students?.length}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 border-r-2">
              <SupervisorAccountIcon
                className="rounded-full py-2 bg-orange-300"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1>Admin</h1>
                <h2 className="text-2xl font-bold">{admins?.length}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 ">
              <MenuBookIcon
                className="rounded-full py-2 bg-orange-300"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1>Courses</h1>
                <h2 className="text-2xl font-bold">{departments?.length}</h2>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="bg-white h-[17rem] w-full rounded-xl shadow-lg flex flex-col pt-3">
              <div className="flex px-3">
                {open && (
                  <ReplyIcon
                    onClick={() => setOpen(false)}
                    className="cursor-pointer"
                  />
                )}
                <h1 className="font-bold text-xl w-full text-center">
                  Notices
                </h1>
              </div>
              <div className="mx-5 mt-5 space-y-3 overflow-y-auto h-[12rem]">
                {!open ? (
                  notices?.map((notice, idx) => (
                    <div
                      onClick={() => {
                        setOpen(true);
                        setOpenNotice(notice);
                      }}
                      className=""
                    >
                      <Notice idx={idx} notice={notice} notFor="" />
                    </div>
                  ))
                ) : (
                  <ShowNotice notice={openNotice} />
                )}
              </div>
              {recentTimetable && (
                <div className="mx-5 mt-5 space-y-3">
                  <h1>Recent Timetable</h1>
                  <p
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => downloadPdf(recentTimetable)}
                  >
                    File Name: {recentTimetable.filename}
                  </p>
                  <p>Uploaded At: {new Date(recentTimetable.createdAt).toLocaleString()}</p>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
