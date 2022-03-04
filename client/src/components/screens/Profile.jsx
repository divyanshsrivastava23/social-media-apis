import React, { useEffect, useState } from "react";
import { useUser } from "../../Contexts/UserContext";

const Profile = () => {
  const [photos, setPhotos] = useState([]);
  const [image, setImage] = useState("");
  const { state, dispatch } = useUser();

  useEffect(() => {
    let isMounted = true; //! avoiding the error: cannot update the state of an unmounted component
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (isMounted) {
          console.log(result);
          setPhotos(result.userCreatedPost);
        } else {
          return () => {
            isMounted = false;
          };
        }
      });
  }, [state]);

  const updateUser = (imgUrl) => {
    fetch("/updateUser", {
      method: "put",
      body: JSON.stringify({
        avatar: imgUrl,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "AVATARUPDATE",
          payload: {
            avatar: data.avatar,
          },
        });
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch((err) => console.log(err));
  };

  const uploadPhoto = () => {
    const formData = new FormData(); //? to upload files
    formData.append("file", image);
    formData.append("upload_preset", "clickera");
    formData.append("cloud_name", "devyanshsrivastava");
    fetch("https://api.cloudinary.com/v1_1/devyanshsrivastava/image/upload", {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        updateUser(data.url);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="profile">
      <div className="profile__person-details">
        <div className="profile-pic-container">
          <div className="profile__person-details__img-container">
            <img src={state ? state.avatar : ""} alt="person" />
          </div>

          <div className="create-post__main__file-upload file-upload">
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="upload-box"
            />
          </div>
          <button className="btn-size-medium btn follow" onClick={uploadPhoto}>
            Upload
          </button>
        </div>

        <div className="profile__person-details__user-info">
          <h4> {state ? state.name : "loading"} </h4>
          <h5> {state ? state.username : "loading"} </h5>
          <div className="profile__person-details__user-statistics">
            <h5>
              <span>{photos.length} </span>posts
            </h5>
            <h5>
              <span> {state ? state.followers.length : "0"} </span>
              followers
            </h5>
            <h5>
              <span> {state ? state.following.length : "0"} </span>
              following
            </h5>
          </div>
        </div>
      </div>
      <div className="profile__user-posts">
        {photos.map((item) => {
          return (
            <img
              className="profile__user-posts__item"
              key={item._id}
              src={item.photo}
              alt={item.title}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
