import { Avatar, Button, CircularProgress, Input } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import { Schema } from "@sanity/schema";
import { htmlToBlocks, getBlockContentFeatures } from "@sanity/block-tools";
import client from "../sanityClient";
import axios from "axios";
import customAlert from "../alerts";
import { toHTML } from "@portabletext/to-html";
const { REACT_APP_SERVER_URL } = process.env;

const defaultSchema = Schema.compile({
  name: "myBlog",
  types: [
    {
      type: "object",
      name: "blogPost",
      fields: [
        {
          title: "Title",
          type: "string",
          name: "title",
        },
        {
          title: "Body",
          name: "body",
          type: "array",
          of: [{ type: "block" }],
        },
      ],
    },
  ],
});

const blockContentType = defaultSchema
  .get("blogPost")
  .fields.find((field) => field.name === "body").type;

const WriteABlog = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOne, setIsLoadingOne] = useState(false);

  const editor_ = useRef(null);
  const [content, setContent] = useState("Start Writing");
  const config = {
    buttons: [
      "bold",
      "underline",
      "italic",
      "strikethrough",
      "font",
      "fontsize",
      "ul",
      "ol",
    ],
    toolbarAdaptive: false,
    toolbarSticky: false,
    toolbarStickyOffset: 0,
    buttonsXS: [
      "bold",
      "underline",
      "italic",
      "strikethrough",
      "font",
      "fontsize",
      "ul",
      "ol",
    ],
    buttonsSM: [
      "bold",
      "underline",
      "italic",
      "strikethrough",
      "font",
      "fontsize",
      "ul",
      "ol",
    ],
    buttonsMD: [
      "bold",
      "underline",
      "italic",
      "strikethrough",
      "font",
      "fontsize",
      "ul",
      "ol",
    ],
  };

  const handleUpdate = (event) => {
    setContent(event);
  };

  const getSanityDocument = async () => {
    setIsLoading(true);

    const document = await client.getDocument(
      location.state.sanity_document_id
    );
    const htmlContent = toHTML(document.editor);
    setContent(htmlContent);
    setTitle(document.name);
    
    setIsLoading(false);
  };

  const createDocument = async () => {
    const blocks = htmlToBlocks(content, blockContentType);
    setIsLoadingOne(true);
    if (!location.state.edit) {
      const doc = {
        _type: "textEditor",
        name: title,
        editor: blocks,
      };
      const response = await client.create(doc);

      const responseOne = await axios.post(
        `${REACT_APP_SERVER_URL}/documents/createDocument`,
        {
          username: location.state.username,
          sanity_document_id: response._id,
          name: title,
        },
        {
          headers: {
            Authorization: sessionStorage.getItem("token"),
          },
        }
      );

      customAlert(responseOne.data);
    } else {
      const doc = {
        _id: location.state.sanity_document_id,
        _type: "textEditor",
        name: title,
        editor: blocks,
      };

      await client.createOrReplace(doc);

      const responseOne = await axios.post(
        `${REACT_APP_SERVER_URL}/documents/editDocument`,
        {
          username: location.state.username,
          name: title,
          document_id: location.state.document_id,
        },
        {
          headers: {
            Authorization: sessionStorage.getItem("token"),
          },
        }
      );

      customAlert(responseOne.data);
    }

    setIsLoadingOne(false);
    navigate("/documents", { state: { username: location?.state?.username } });
  };

  useEffect(() => {
    if (location.state.edit) {
      getSanityDocument();
    }
  }, []);

  return (
    <div className="w-full h-screen p-10">
      <div className="flex justify-between items-center flex-wrap">
        <div className="flex justify-start items-center gap-10">
          <p className="text-xl font-semibold poppins">Blog It</p>
        </div>
        <Avatar
          name={location?.state?.username}
          bg="blue.400"
          textColor="white"
        />
      </div>
      {!isLoading ? (
        <>
          <div className="w-5/12 mx-auto mt-20">
            <Input
              variant="flushed"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex justify-center items-center mt-10">
            <JoditEditor
              ref={editor_}
              value={content}
              config={config}
              onBlur={handleUpdate}
            />
          </div>
          <div className="flex justify-center items-center mt-10 mb-10">
            <Button className="poppins" onClick={createDocument} isLoading={isLoadingOne}>
              {!location.state.edit ? "Post" : "Update"}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center mt-20">
          <CircularProgress isIndeterminate />
        </div>
      )}
    </div>
  );
};

export default WriteABlog;
