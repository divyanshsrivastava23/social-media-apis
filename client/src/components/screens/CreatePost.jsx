import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const CreatePost = () => {
  // * history hook:
  const history = useHistory();

  // * states:
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [imgurl, setImgurl] = useState("");

  const postDetails = (e) => {
    e.preventDefault();
    const formData = new FormData(); //? to upload files
    formData.append("file", image);
    formData.append("upload_preset", "clickera");
    formData.append("cloud_name", "devyanshsrivastava");
    fetch("https://api.cloudinary.com/v1_1/devyanshsrivastava/image/upload", {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => setImgurl(data.url))
      .catch((err) => console.log(err));
  };

  // * useEffect for the imgurl:

  useEffect(() => {
    if (imgurl) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          photo: imgurl,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            alert("Post is successfully created");
            history.push("/");
          } else {
            alert(data.error);
          }
        });
    }
  }, [body, history, imgurl, title]);

  return (
    <div className="create-post">
      <form onSubmit={postDetails} className="create-post__main">
        <input
          type="text"
          placeholder="title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="body"
          value={body}
          required
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="create-post__main__file-upload">
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="upload-box"
          />
        </div>
        <button className="btn btn-size-medium">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
