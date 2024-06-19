import { Avatar, Button, IconButton } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AddIcon } from "@chakra-ui/icons";
import axios from 'axios';
import client from '../sanityClient';
import customAlert from '../alerts';
const { REACT_APP_SERVER_URL } = process.env;

const Documents = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);

  const getDocuments = async () => {
    const response = await axios.get(`${REACT_APP_SERVER_URL}/documents/getDocuments/${location.state.username}`, {
      headers: {
        Authorization: sessionStorage.getItem("token")
      }
    })

    setDocuments(response.data);
  }
  
  const navigateToWrite = () => {
    navigate("/write", { state: { username: location.state.username, edit: false } });
  }
  
  const navigateToWriteForUpdate = (blogId, docId) => {
    navigate("/write", { state: { username: location.state.username, edit: true, sanity_document_id: blogId, document_id: docId } })
  }
  
  const navigateToBlog = (blogId, docId) => {
    navigate(`/blog/${blogId}/${docId}`);
  }

  const deleteDocument = async (blogId, docId) => {
    const response = await axios.delete(`${REACT_APP_SERVER_URL}/documents/deleteDocument/${location.state.username}/${docId}`, {
      headers: {
        Authorization: sessionStorage.getItem("token")
      }
    })

    if(response.data === "Document deleted successfully") {
      await client.delete(blogId);
      customAlert(response.data);
    }
    else {
      customAlert(response.data);
    }
  }

  useEffect(() => {
    getDocuments();
  },[])

  return (
    <div className="w-full h-screen p-10">
      <div className="flex justify-between items-center flex-wrap">
        <div className="flex justify-start items-center gap-10">
          <p className='text-xl font-semibold poppins'>Blog It</p>
          <IconButton icon={<AddIcon />} borderRadius={20} onClick={navigateToWrite} />
        </div>
        <Avatar name={location?.state?.username} bg="blue.400" textColor="white" />
      </div>
      {documents?.length > 0 ? (
        <div className="flex flex-col gap-5 mt-20 w-full">
          {documents?.map((document, index) => {
            return (
              <div key={document._id} className="flex justify-between items-center border-b-2 m-5 pb-2">
                <p className="poppins font-semibold text-lg">{document.name}</p>
                <div className="flex justify-start items-center gap-5">
                  <Button className="poppins" onClick={() => navigateToBlog(document.sanity_document_id, document._id)}>Open</Button>
                  <Button className="poppins" colorScheme="blue" onClick={() => navigateToWriteForUpdate(document.sanity_document_id ,document._id)}>Edit</Button>
                  <Button className="poppins" colorScheme="red" onClick={() => deleteDocument(document.sanity_document_id ,document._id)}>Delete</Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center mt-96">
        <p className="poppins text-lg">Get started by creating blogs using the &nbsp; <IconButton borderRadius={20}><AddIcon /></IconButton> &nbsp; button at the top</p>
        </div>
      )}
    </div>
  )
}

export default Documents
