import React, { useEffect, useState, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
import axios from "axios";
import { addStudent, uploadCSVFile } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import { ADD_STUDENT, SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null); 
    const [error, setError] = useState({});
  const errorRef = useRef();

  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: "",
    department: "",
    contactNumber: "",
    avatar: "",
    batch: "",
    gender: "",
    year: "",
    fatherName: "",
    section: "",
    fatherContactNumber: "",
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      errorRef.current.scrollIntoView({ behavior: "smooth" });
      setValue({ ...value, email: "" });
    }
  }, [store.errors]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // If a file is selected, update the file state
    setFile(selectedFile);
    
    // Optionally, you can also read the file content if needed
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setValue({ ...value, avatar: base64 || "" });
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setValue({ ...value, avatar: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setError({});
      setLoading(true);
  
      // Always dispatch the addStudent action without checking for the avatar
      await dispatch(addStudent(value));
    } catch (error) {
      // Handle errors, update state, show error messages, etc.
      setError({ message: error.message });
    } finally {
      setLoading(false);
    }
  };
  


  const handleCSVUpload = async () => {
    try {
      if (!file) {
        throw new Error("No file selected");
      }

      const formData = new FormData();
      formData.append("file", file);

      // Make the API call to upload the CSV file
      const response = await axios.post(
        "http://localhost:5000/api/admin/csvUpload",
        formData
      );

      console.log("CSV file uploaded successfully", response.data);

      // Handle any success logic here

      setError({});
      setLoading(false);
    } catch (error) {
      console.error("Error uploading CSV file:", error.message);
      setError({ csvError: error.message });
      setLoading(false);
    }
  };

  const handleClear = () => {
    setValue({
      name: "",
      dob: "",
      email: "",
      department: "",
      contactNumber: "",
      avatar: "",
      batch: "",
      gender: "",
      year: "",
      fatherName: "",
      section: "",
      fatherContactNumber: "",
    });
    setError({});
  };

  useEffect(() => {
    if (store.errors || store.admin.studentAdded) {
      setLoading(false);
      if (store.admin.studentAdded) {
        setValue({
          name: "",
          dob: "",
          email: "",
          department: "",
          contactNumber: "",
          avatar: "",
          batch: "",
          gender: "",
          year: "",
          fatherName: "",
          section: "",
          fatherContactNumber: "",
        });

        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_STUDENT, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.admin.studentAdded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          {/* Add Student Section */}
          <AddIcon />
          <h1>Add Student</h1>

          {/* Use the existing FileBase component for both student addition and CSV upload */}
        {/* Input field for CSV File */}
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Upload Button for triggering CSV upload */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCSVUpload}
        >
          Upload CSV
        </button>
        </div>

        <div className="mr-10 bg-white flex flex-col rounded-xl">
          <form
            className={`${classes.adminForm0} scrollbar-thin scrollbar-track-white scrollbar-thumb-black overflow-y-scroll h-[30rem]`}
            onSubmit={handleSubmit}
          >
            <div className={classes.adminForm1}>
              <div className={classes.adminForm2l}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Name :</h1>

                  <input
                    placeholder="Full Name"
                    required
                    className={classes.adminInput}
                    type="text"
                    value={value.name}
                    onChange={(e) =>
                      setValue({ ...value, name: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>DOB :</h1>

                  <input
                    required
                    placeholder="DD/MM/YYYY"
                    className={classes.adminInput}
                    type="date"
                    value={value.dob}
                    onChange={(e) =>
                      setValue({ ...value, dob: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Email :</h1>

                  <input
                    required
                    placeholder="Email"
                    className={classes.adminInput}
                    type="email"
                    value={value.email}
                    onChange={(e) =>
                      setValue({ ...value, email: e.target.value })
                    }
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Father's Name :</h1>

                  <input
                    required
                    placeholder="Father's Name"
                    className={classes.adminInput}
                    type="text"
                    value={value.fatherName}
                    onChange={(e) =>
                      setValue({ ...value, fatherName: e.target.value })
                    }
                  />
                </div>
                {/* <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Mother's Name :</h1>

                  <input
                    required
                    placeholder="Mother's Name"
                    className={classes.adminInput}
                    type="text"
                    value={value.motherName}
                    onChange={(e) =>
                      setValue({ ...value, motherName: e.target.value })
                    }
                  />
                </div>  */}
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Section :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.year}
                    onChange={(e) =>
                      setValue({ ...value, year: e.target.value })
                    }
                    
                  >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="4">5</MenuItem>
                  <MenuItem value="4">6</MenuItem>
                  <MenuItem value="4">7</MenuItem>
                  <MenuItem value="4">8</MenuItem>
                  <MenuItem value="4">9</MenuItem>
                  <MenuItem value="4">10</MenuItem>
                  <MenuItem value="4">11</MenuItem>
                  <MenuItem value="4">12</MenuItem>


                  </Select>
                </div>
              </div>
              <div className={classes.adminForm2r}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Course :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.department}
                    onChange={(e) =>
                      setValue({ ...value, department: e.target.value })
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    {departments?.map((dp, idx) => (
                      <MenuItem key={idx} value={dp.department}>
                        {dp.department}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Gender :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.gender}
                    onChange={(e) =>
                      setValue({ ...value, gender: e.target.value })
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Contact Number :</h1>

                  <input
                    required
                    placeholder="Contact Number"
                    className={classes.adminInput}
                    type="number"
                    value={value.contactNumber}
                    onChange={(e) =>
                      setValue({ ...value, contactNumber: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>
                    Father's Contact Number :
                  </h1>

                  <input
                    required
                    placeholder="Father's Contact Number"
                    className={classes.adminInput}
                    type="number"
                    value={value.fatherContactNumber}
                    onChange={(e) =>
                      setValue({
                        ...value,
                        fatherContactNumber: e.target.value,
                      })
                    }
                  />
                </div>
                {/* <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>
                    Mother's Contact Number :
                  </h1>

                  <input
                    required
                    placeholder="Father's Contact Number"
                    className={classes.adminInput}
                    type="number"
                    value={value.motherContactNumber}
                    onChange={(e) =>
                      setValue({
                        ...value,
                        motherContactNumber: e.target.value,
                      })
                    }
                  />
                </div> */}
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Batch :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.section}
                    onChange={(e) =>
                      setValue({ ...value, section: e.target.value })
                    }
                  >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="1">A</MenuItem>
                  <MenuItem value="2">B</MenuItem>
                  <MenuItem value="3">C</MenuItem>
                  <MenuItem value="4">D</MenuItem>
                  <MenuItem value="4">E</MenuItem>
                  <MenuItem value="4">F</MenuItem>
                  <MenuItem value="4">G</MenuItem>
                  <MenuItem value="4">H</MenuItem>
                  <MenuItem value="4">I</MenuItem>
                  <MenuItem value="4">J</MenuItem>
                  <MenuItem value="4">K</MenuItem>
                  <MenuItem value="4">L</MenuItem>
                  </Select>
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Avatar :</h1>

                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) =>
                      setValue({ ...value, avatar: base64 })
                    }
                  />
                </div>
              </div>
            </div>
            <div className={classes.adminFormButton}>
              <button
                className={classes.adminFormSubmitButton}
                type="submit"
              >
                Submit
              </button>
              <button
                onClick={handleClear}
                className={classes.adminFormClearButton}
                type="button"
              >
                Clear
              </button>
            </div>
            <div ref={errorRef} className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Adding Student"
                  height={30}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {(error.emailError || error.backendError || error.csvError) && (
                <p className="text-red-500">
                  {error.emailError || error.backendError || error.csvError}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body
