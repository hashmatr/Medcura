import React from 'react'
import { assets } from '../../assets/assets_admin/assets';
import { AdminContext } from '../../Context/AdminContext';
import { useContext } from 'react';
import axios from 'axios';
  import { ToastContainer, toast } from 'react-toastify';
const AddDoctor = () => {
  const [docimg,setDocimg] = React.useState(false);
const [name,setName] = React.useState('');
const [email,setEmail] = React.useState('');
const [password,setPassword] = React.useState('');
const [experience,setExperience] = React.useState('1 year');
const [fees,setFees] = React.useState('');
const [about,setAbout] = React.useState('');
const [degree,setDegree] = React.useState('');
const [address1,setAddress1] = React.useState('');
const [address2,setAddress2] = React.useState('');
const [speciality,setSpeciality] = React.useState('General Physician');

const{BackendURL,aToken} = useContext(AdminContext);
const onSubmitHandler = async (e) => {
  e.preventDefault();
  try {
    if(!docimg){
      return toast.error('Image not Selected')
    }
    const formData = new FormData();
    formData.append('image', docimg);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('experience', experience);
    formData.append('fees', Number(fees));
    formData.append('about', about);
    formData.append('degree', degree);
    formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
    formData.append('speciality', speciality);

    formData.forEach((value, key) => {
      console.log(key, value);
    });
    const {data}=await axios.post(BackendURL+'/api/admin/add-doctor', formData, {
      headers: {
        Authorization: `Bearer ${aToken}`
      }
    });
    if(data?.success){
      toast.success('Doctor added successfully');
      setDocimg(false);
      setName('');
      setEmail('');
      setPassword('');
      setFees('');
      setAbout('');
      setDegree('');
      setAddress1('');
      setAddress2('');    }
    else{
      toast.error('Error adding doctor');} 
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
};
  return (
    <form 
      onSubmit={onSubmitHandler}
      action="" 
      className="w-[90%] max-w-7xl bg-white p-10 shadow-md rounded-md space-y-10 overflow-hidden"
    >
      <p className="text-2xl font-semibold text-gray-800">Add Doctor</p>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Upload Picture */}
        <div className="flex flex-col items-center justify-start w-full md:w-1/4">
          <label
            htmlFor="doc_img"
            className="cursor-pointer flex flex-col items-center justify-center w-28 h-28 rounded-full border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition"
          >
            <img src={docimg ? URL.createObjectURL(docimg) : assets.upload_area} alt="" className="w-24 h-24    opacity-70" />
          </label>
          <input onChange={(e)=>{setDocimg(e.target.files[0])}} type="file" id="doc_img" hidden />
          <p className="text-sm text-gray-500 mt-2 text-center leading-tight">
            Upload doctor picture
          </p>
        </div>

        {/* Form Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-600">Doctor Name</p>
            <input
            onChange={(e)=>{setName(e.target.value)}}
              value={name}
              type="text"
              placeholder="Name"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <p className="text-sm text-gray-600">Doctor Email</p>
            <input onChange={(e)=>{setEmail(e.target.value)}}
              type="email"
              value={email}
              placeholder="Email"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <p className="text-sm text-gray-600">Doctor Password</p>
            <input
              onChange={(e)=>{setPassword(e.target.value)}}
              type="password"
              value={password}
              placeholder="Password"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <p className="text-sm text-gray-600">Experience</p>
            <select onChange={(e)=>{setExperience(e.target.value)}}
              required
              value={experience}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1} Year{i>0 && 's'}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm text-gray-600">Fees</p>
            <input onChange={(e)=>{setFees(e.target.value)}}
              type="number"
              value={fees}
              placeholder="Fees"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <p className="text-sm text-gray-600">Speciality</p>
            <select
              onChange={(e)=>{setSpeciality(e.target.value)}}
              value={speciality}
              name="speciality"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            >
              <option value="General Physician">General Physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>

          <div>
            <p className="text-sm text-gray-600">Education</p>
            <input
              onChange={(e)=>{setDegree(e.target.value)}}
              value={degree}
              type="text"
              placeholder="Education"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">Address</p>
            <input
              onChange={(e)=>{setAddress1(e.target.value)}}
              value={address1}
              type="text"
              placeholder="Address 1"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm mb-3"
            />
            <input
              onChange={(e)=>{setAddress2(e.target.value)}}
              value={address2}
              type="text"
              placeholder="Address 2"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">About Doctor</p>
            <textarea
              onChange={(e)=>{setAbout(e.target.value)}}
              value={about}
              placeholder="Write about doctor"
              rows={4}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          
          type="submit"
          className="px-8 py-3 cursor-pointer bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 transition"
        >
          Add Doctor
        </button>
      </div>
    </form>
  )
}



export default AddDoctor
