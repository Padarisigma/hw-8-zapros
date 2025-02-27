import { useState, useEffect } from 'react'
import axios from 'axios'
import TextField from '@mui/material/TextField';
import {  Modal, Input } from 'antd';
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import './App.css'
import DeleteIcon from '@mui/icons-material/Delete';
import { Checkbox } from 'antd';


const Api='https://to-dos-api.softclub.tj/api/to-dos'
function App() {
  const [data,setData]=useState([])
  const [openEditModal, setEditModal]=useState(false)
  const [openAddModal, setAddModal]=useState(false)
  const [openShowModal, setShowModal]=useState(false)
  const [imgModal, setPostImgModal]=useState(false)
  const [taskAddName, setAddTaskName]=useState('')
  const [taskDesc, setAddTaskDesc]=useState('')
  const [image, setImage]=useState(null)
  const [taskEditName, setEditTaskName]=useState('')
  const [taskEditDesc, setEditTaskDesc]=useState('')
  const [taskNumber, setTaskNumber]=useState('')
 const [idx, setIdx]=useState('')
 const [dataId, setGetById]=useState([])

  const get= async ()=>{
    try {
      const {data}= await axios.get(Api)
      setData(data.data)
    } catch (error) {
      console.error(error);
      
    }
  }

  function handleClick() {
    if (localStorage.theme === "dark" || !("theme" in localStorage)) {
      //add class=dark in html element
      document.documentElement.classList.add("dark");
    } else {
      //remove class=dark in html element
      document.documentElement.classList.remove("dark");
    }

    if (localStorage.theme === "dark") {
      localStorage.theme = "light";
    } else {
      localStorage.theme = "dark";
    }
  }
  
  useEffect(()=>{
    handleClick()
    get()
  }, [])

  const deleteUser= async (id)=>{
  try {
    await axios.delete(`${Api}?id=${id}`)
    get()
  } catch (error) {
    console.error(error);
    
  }
  }

  const handleSave=async (e)=>{
    e.preventDefault()
    setAddModal(false)
    const formData=new FormData()
    formData.append('name', taskAddName)
    formData.append('description', taskDesc)
    for(let i=0; i<image.length; i++) {
      formData.append('images', image[i])
    }
    console.log(image);
     try {
      await axios.post(Api, formData)
      get()
     } catch (error) {
      console.error(error);
     }
     setImage(null)
     setAddTaskDesc('')
     setAddTaskName('')
  }
  const handleChange = (info) => {
    const files = info.fileList.map((file) => file.originFileObj); 
    setImage(files);        
  };

  const editUser=async (e)=>{
    e.preventDefault()
    const newUser={
      name: taskEditName,
      description: taskEditDesc,
      images: image,
      id:idx
    }
    try {
      await axios.put(Api, newUser)
      get()
    } catch (error) {
      console.error(error);
      
    }
    setEditModal(false)
  }
  

  const put=(user)=>{
  setEditModal(true)
  setEditTaskDesc(user.description)
  setEditTaskName(user.name)
  setIdx(user.id)
  setImage(user.images)
  }


  const postImg=async (e)=>{
    e.preventDefault()
    const formData=new FormData() 
    for(let i=0; i<image.length; i++) {
      formData.append('images', image[i])
    }
    console.log(image);
     try {
      await axios.post(`${Api}/${taskNumber}/images`, formData)
      get()
     } catch (error) {
      console.error(error);
     }
     setPostImgModal(false)
  }

  const img=(id)=>{
setPostImgModal(true)
setTaskNumber(id)
  }

  const getById=async (id)=>{
    setShowModal(true)
    try {
      const {data}=await axios.get(`${Api}/${id}`)
      setGetById(data.data)
      console.log(data.data);
      console.log(data.data.images);
      
    } catch (error) {
      console.error(error);
    }
  }
 

  const deleteImg=async (id)=>{
  try {
    await axios.delete(`${Api}/images/${id}`)
    get()
  } catch (error) {
    console.error(error);
  }
  }

  

  const handleCheckboxChange = async (id, isCompleted) => {
    try {
      await axios.put(`https://to-dos-api.softclub.tj/completed?id=${id}`, { isCompleted: !isCompleted });
      setData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, isCompleted: !isCompleted } : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };
  
 
  return (
    <>
    <div className='flex gap-[20px] items-center w-[90%] m-auto py-[40px]'>
      <button onClick={handleClick} className='border-solid border-1 px-[20px] rounded-[5px]  py-[7px]'>Dark</button>
      <button onClick={()=>setAddModal(true)} className='border-1 border-solid py-[7px] px-[30px] rounded-[6px]' >Add</button>
    </div>
        
        <Modal open= {openAddModal} onCancel={()=>setAddModal(false)}  footer={null}>
        <form onSubmit={handleSave} className='flex flex-col gap-[20px] py-[30px]'>
      <TextField id="standard-basic" label="Name" variant="standard" value={taskAddName} onChange={(e)=>setAddTaskName(e.target.value)}/>
      <TextField id="standard-basic" label="Description" variant="standard" value={taskDesc} onChange={(e)=>setAddTaskDesc(e.target.value)}/>
      <Upload beforeUpload={() => false} multiple onChange={handleChange}>
      <Button icon={<UploadOutlined  />} >Загрузить файл</Button>
    </Upload>
        <button type='submit' className='border-1 text-[white] bg-[#4040d1] rounded-[6px] border-solid py-[8px]'>Save</button>
        </form>
      </Modal>
      
      
      <Modal open= {imgModal} onCancel={()=>setPostImgModal(false)}  footer={null}>
      <form onSubmit={postImg} className='flex flex-col gap-[20px] py-[30px]'>
        <Input value={taskNumber} />
      <Upload beforeUpload={() => false} multiple onChange={handleChange}>
      <Button icon={<UploadOutlined  />} >Загрузить файл</Button>
    </Upload>
        <button type='submit' className='border-1 text-[white] bg-[#4040d1] rounded-[6px] border-solid py-[8px]'>Save</button>
        </form>
      </Modal>

      <Modal open= {openEditModal} onCancel={()=>setEditModal(false)}  footer={null}>
        <form onSubmit={editUser} className='flex flex-col gap-[20px] py-[30px]'>
      <TextField id="standard-basic" label="Name" variant="standard" value={taskEditName} onChange={(e)=>setEditTaskName(e.target.value)}/>
      <TextField id="standard-basic" label="Description" variant="standard" value={taskEditDesc} onChange={(e)=>setEditTaskDesc(e.target.value)}/>
      <Upload beforeUpload={() => false} multiple onChange={handleChange}>
      <Button icon={<UploadOutlined  />} >Загрузить файл</Button>
    </Upload>
        <button type='submit' className='border-1 text-[white] bg-[#4040d1] rounded-[6px] border-solid py-[8px]'>Save</button>
        </form>
      </Modal>

      
      <Modal open={openShowModal} onCancel={() => setShowModal(false)} footer={null}>
  <p>Name: {dataId.name}</p>
  <p>Desc: {dataId.description}</p>
  <div className='grid grid-cols-3 gap-[20px] py-[20px]'>
  {dataId.images && Array.isArray(dataId.images) && dataId.images.map((e) => (
    <img key={e.id} src={'https://to-dos-api.softclub.tj/images/' + e.imageName} alt="" className="w-[100px] h-[100px] rounded-[50%]" />
  ))}
  </div>
  
</Modal>
         <div className='grid  pb-[50px] sm:grid-cols-4 w-[90%] gap-[30px] m-auto'>
          {
          data.map((el)=>{
            return <div key={el.id} className='flex dark:shadow-2xl dark:border-1 border-1 border-solid  p-[20px] rounded-[10px] flex-col gap-[10px] '>
            <p className='text-[20px] font-semibold italic tracking-[2px] overflow-hidden w-[100%]'>{el.name}</p>
            <p className='text-[18px] italic tracking-[1px]'>{el.description}</p>
            <div className='grid grid-cols-3'>
              {el.images.slice(0,3).map((e)=>{
              return <div>
                <div className='flex flex-col items-center gap-[10px]'>
                  <img key={e.id} src={'https://to-dos-api.softclub.tj/images/' + e.imageName} alt="" className='w-[70px] h-[70px] rounded-[50%]' /> 
                <button className='hover:bg-gray-300 dark:hover:bg-gray-800 p-[7px] rounded-[50%]' onClick={()=> deleteImg(e.id)} > <DeleteIcon /></button>
                </div>
                
                </div> 
              
            })}
            </div>
            
            <button onClick={()=> deleteUser(el.id)} className='py-[7px] px-[20px] dark:hover:border-[white] dark:bg-gray-800 dark:hover:bg-gray-800 dark:hover:text-white border-1 hover:bg-gray-200 hover:text-gray-950 border-solid border-gray-900 bg-transparent rounded-[5px]'>Delete</button>
            <button onClick={()=> put(el)} className='py-[7px] px-[20px] border-1 dark:hover:border-[white] dark:bg-gray-800 dark:hover:bg-gray-800 dark:hover:text-white border-solid  hover:bg-gray-200 hover:text-gray-950  border-gray-900 bg-transparent rounded-[5px]'>Edit</button>
            <button onClick={()=> getById(el.id)} className='py-[7px] px-[20px] border-1 dark:hover:border-[white] dark:bg-gray-800 dark:hover:bg-gray-800 dark:hover:text-white hover:bg-gray-200 hover:text-gray-950 border-solid border-gray-900 bg-transparent rounded-[5px]'>Show</button>
            <button onClick={()=>img(el.id)} className='py-[7px] px-[20px] border-1 border-solid dark:hover:border-[white] dark:bg-gray-800 dark:hover:bg-gray-800 dark:hover:text-white hover:bg-gray-200 hover:text-gray-950 border-gray-900 bg-transparent rounded-[5px]'>Add image</button>
            <Checkbox  checked={el.isCompleted} onChange={()=>handleCheckboxChange(el.id, el.isCompleted)} style={{color: el.isCompleted ? 'green': 'red'}}>{el.isCompleted ? 'Done': 'Not Done'}</Checkbox>
            </div>
          })
        }
</div>
        
        
    </>
  )
}

export default App
