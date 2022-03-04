import React from "react";
import Modal from "react-modal";
import { useUser } from "../Contexts/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

Modal.setAppElement("#root");

const modalStyle = {
  overlay: {
    backgroundColor: "grey",
  },
  content: {
    margin: "5rem auto",
    width: "70%",
    position: "relative",
    height: "70vh",
    display: "flex",
    padding: "0",
  },
};

const close = {
  color: "#333",
  fontSize: "1.2rem",
  fontWeight: "700",
  position: "absolute",
  top: "0.5rem",
  right: "0.5rem",
  cursor: "pointer",
};

const PopModal = ({
  modalOpen,
  setModalOpen,
  item,
  comment,
  makeComment,
  deleteComment,
}) => {
  const { state } = useUser();

  return (
    <>
      <Modal
        isOpen={modalOpen}
        style={modalStyle}
        onRequestClose={() => setModalOpen(false)}
      >
        <h2 style={close} onClick={() => setModalOpen(false)}>
          X
        </h2>
        <div style={{ height: "100%", width: "60%" }}>
          <img
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              borderRadius: "3px",
            }}
            src={item.photo}
            alt="pic"
          />
        </div>
        <div className="commentsContainer">
          {item.comments ? (
            comment.map((comt) => {
              return (
                <div key={comt._id}>
                  <div className="commentsContainer__comments">
                    <div className="commentsContainer__comment">
                      <h4 className="name">{comt.postedBy.name}</h4>
                      <p>{comt.text}</p>
                    </div>
                    <div
                      className={
                        comt.postedBy._id === state._id
                          ? "commentsContainer__delete--show"
                          : "commentsContainer__delete"
                      }
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="sm"
                        onClick={() => deleteComment(item._id, comt._id)}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h5>Loading</h5>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              makeComment(e.target[0].value, item._id);
              e.target[0].value = "";
            }}
            className="commentsContainer__comment-box"
          >
            <input type="text" placeholder="Write a comment" />
            <button className="btn-comment">Post</button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default PopModal;
