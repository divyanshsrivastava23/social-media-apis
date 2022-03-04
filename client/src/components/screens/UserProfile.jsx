import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";

const UserProfile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useUser();
  const { userId } = useParams();
  const [showFollow, setShowFollow] = useState(true);
  useEffect(() => {
    setShowFollow(state && !state.following.includes(userId));
    let isMounted = true; //! avoiding the error: cannot update the state of an unmounted component
    fetch(`/user/${userId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (isMounted) {
          setProfile(result);
        } else {
          return () => {
            isMounted = false;
          };
        }
      });
  }, [userId, state]);

  const followUser = () => {
    fetch("/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: data.following,
            followers: data.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setProfile((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user,
            followers: [...prevState.user.followers, data._id],
          },
        }));
        setShowFollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: data.following,
            followers: data.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
        <div className="profile">
          <div className="profile__person-details">
            <div className="profile__person-details__img-container">
              <img src={userProfile.user.avatar} alt="person" />
            </div>
            <div className="profile__person-details__user-info">
              <h4> {userProfile.user.name} </h4>
              <h5> {userProfile.user.username} </h5>
              <div className="profile__person-details__user-statistics">
                <h5>
                  <span> {userProfile.posts.length} </span>posts
                </h5>
                <h5>
                  <span> {userProfile.user.followers.length} </span>followers
                </h5>
                <h5>
                  <span> {userProfile.user.following.length} </span>following
                </h5>
              </div>
              {showFollow ? (
                <button
                  onClick={() => followUser()}
                  className="btn btn-size-medium follow"
                >
                  Follow
                </button>
              ) : (
                <button
                  onClick={() => unfollowUser()}
                  className="btn btn-size-medium follow"
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>
          <div className="profile__user-posts">
            {userProfile.posts.map((item) => {
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
      ) : (
        <h2>Loading . . .</h2>
      )}
    </>
  );
};

export default UserProfile;
