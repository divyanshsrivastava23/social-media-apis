import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import PopModal from "../PopModal";

const Home = () => {
  const { state } = useUser();
  const [post, setPost] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [comment, setComment] = useState({});
  useEffect(() => {
    // * Fetching all the posts:
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPost(result.posts);
      });
  }, [modalOpen, post]);

  //* Like post:
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newPost = post.map((item) => {
          if (item._id === result._id) return result;
          else return item;
        });
        setPost(newPost);
      })
      .catch((err) => console.log(err));
  };

  //* Unlike Post:
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newPost = post.map((item) => {
          if (item._id === result._id) return result;
          else return item;
        });
        setPost(newPost);
      })
      .catch((err) => console.log(err));
  };

  // * Comments:
  const makeComment = (text, postId) => {
    fetch("/comments", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: postId,
        text: text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newPost = post.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPost(newPost);
      })
      .catch((err) => console.log(err));

    setModalOpen(false);
  };

  // * Delete Post:

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newPost = post.filter((item) => {
          return item._id !== result._id;
        });
        setPost(newPost);
      });

    alert("Post deleted successfully!");
  };

  // * Delete Comment:
  const deleteComment = (postId, commentId) => {
    fetch(`/deletecomment/${postId}/${commentId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newPost = post.map((item) => {
          if (item._id === result._id) return result;
          else return item;
        });
        setPost(newPost);
      });
    setModalOpen(false);
  };

  return (
    <div className="home">
      {post.map((item) => {
        return (
          <div className="home__card" key={item._id}>
            <div className="home__card__header">
              <img src={state ? item.postedBy.avatar : ""} alt="posts" />
              <h5>
                <Link
                  to={
                    item.postedBy._id !== state._id
                      ? `/profile/${item.postedBy._id}`
                      : `/profile`
                  }
                  className="home__card__header__profile-link"
                >
                  {item.postedBy.name}
                </Link>
              </h5>
            </div>
            <div className="home__card__img-container">
              <img src={item.photo} alt="posts" />
            </div>
            <div className="home__card__card-content">
              <div className="home__card__card-content__title-body">
                <h5>{item.title}</h5>
                <p> {item.body} </p>
              </div>
              <div className="home__card__card-content__icon-container">
                <FontAwesomeIcon
                  className={
                    item.likes.includes(state._id)
                      ? "icons icon-heart red-heart"
                      : "icons icon-heart"
                  }
                  icon={faHeart}
                  onClick={
                    item.likes.includes(state._id)
                      ? () => {
                          unlikePost(item._id);
                        }
                      : () => {
                          likePost(item._id);
                        }
                  }
                />
                <FontAwesomeIcon
                  className="icons icon-comment"
                  icon={faComment}
                  onClick={() => {
                    setComment(item.comments);
                    setModalData(item);
                    setModalOpen(true);
                  }}
                />
                <FontAwesomeIcon
                  className={
                    item.postedBy._id === state._id
                      ? "icons icon-delete"
                      : "icon-delete-hidden"
                  }
                  icon={faTrash}
                  onClick={() => deletePost(item._id)}
                />
              </div>
            </div>
            <div className="likes-container">
              <h5 className="likes">
                {item.likes.length} people like this post.
              </h5>
            </div>
            {item.comments ? (
              <PopModal
                key={item._id}
                item={modalData}
                comment={comment}
                makeComment={makeComment}
                deleteComment={deleteComment}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                state={state}
              />
            ) : (
              <h2>Loading</h2>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Home;
