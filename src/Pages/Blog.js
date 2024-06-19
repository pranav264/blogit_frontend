import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import client from "../sanityClient";
import { toHTML } from "@portabletext/to-html";
import axios from "axios";
import { CircularProgress, IconButton, Tooltip } from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
const { REACT_APP_SERVER_URL } = process.env;

const Blog = () => {
  const location = useLocation();

  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const getDocument = async () => {
    setIsLoading(true);

    const arr = location.pathname.split("/");
    const sanity_document_id = arr[arr.length - 2];
    const document_id = arr[arr.length - 1];

    const document = await client.getDocument(sanity_document_id);
    const htmlContent = toHTML(document.editor);

    const document_ = await axios.get(
      `${REACT_APP_SERVER_URL}/documents/getDocument/${document_id}`
    );

    setContent(htmlContent);
    setName(document.name);
    setAuthor(document_.data.author);

    setIsLoading(false);
  };

  const copyLinkToClipboard = async () => {
    const shareData = {
        title: name,
        url: window.location.toString(),
    }

    await navigator.share(shareData);

  }

  useEffect(() => {
    getDocument();
  }, []);

  return (
    <div className="w-full h-screen p-10">
      {!isLoading ? (
        <div className="flex flex-col items-center gap-10 w-5/12 mx-auto mt-20">
        <div className="flex justify-center items-center gap-5">
          <p className="poppins text-xl font-semibold">{name}</p>
          <Tooltip>
            <IconButton borderRadius={20} onClick={copyLinkToClipboard}>
                <LinkIcon />
            </IconButton>
          </Tooltip>
        </div>
          <div
            className="poppins"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className="flex justify-center items-center gap-3 flex-wrap">
            <p className="poppins">Author </p>
            <p className="poppins font-semibold">{author}</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center mt-20">
            <CircularProgress isIndeterminate />
        </div>
      )}
    </div>
  );
};

export default Blog;
