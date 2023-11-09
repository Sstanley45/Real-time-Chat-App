import React, { useState, useEffect } from "react";
import { Trash2 } from "react-feather";

import client, {
  databases,
  // import.meta.env.VITE_DATABASE_ID,
  //  import.meta.env.VITE_COLLECTION_ID_MESSAGES,
} from "../appwriteConfig";

import { ID, Query, Role, Permission } from "appwrite";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const Room = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");

  //create a message in the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    //add more info in the payload like user info
    let payload = {
      body: messageBody,
      user_id: user.$id,
      username: user.name,
    };

    //add permissions

    let permissions = [Permission.write(Role.user(user.$id))];

    try {
      let response = await databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID_MESSAGES,
        ID.unique(),
        payload,
        permissions
      );
      //update the messageBody state
      //   setMessages((prevState) => [response, ...messages]);
    } catch (error) {
      console.log(error);
    }
    setMessageBody("");
  };

  //get messages from database
  const getMessages = async () => {
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID_MESSAGES,
        [Query.orderAsc("$createdAt"), Query.limit(50)]
      );
     // console.log("Response", response);

      setMessages(response.documents);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages();

    //subscribe to events
    const unSubscribe = client.subscribe(
      `databases.${import.meta.env.VITE_DATABASE_ID}.collections.${
        import.meta.env.VITE_COLLECTION_ID_MESSAGES
      }.documents`,
      (response) => {
        // Callback will be executed on changes for documents A and all files.
       // console.log(response);
        //from the response, we have an array of events. we'll use it to check if the type
        //of the event triggered.
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("A MESSAGE WAS CREATED with user id:");
          setMessages((prevState) => [...prevState, response.payload]);
        }
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("A MESSAGE WAS DELETED!!");
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    //we are supposed to use a clean up function in this useEffect so as to avoid calling twice which
    //results in subscribing twice making which causes the problem of sending one message but it goes twice.
    //To add the clean up function we set a variable 'unsubscribe' to the return value of the subscribe method then
    //we invoke the subscribe in the useEffect cleanup method

    return () => {
      unSubscribe();
    };
  }, []);

  //delete message fxn
  const deleteMessage = async (message_id) => {
    await databases.deleteDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID_MESSAGES,
      message_id
    );

    //Delete via the event because all users receives the event.
    // setMessages((prevState) =>
    //   messages.filter((message) => message.$id !== message_id)
    // );
  };

  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <div>
          {messages.map((message) => {
            return (
              <div
                key={message.$id}
                className={`message--wrapper ${
                  user.$id === message.user_id ? "my-message" : ""
                }`}
              >
                <div
                  className={`message--header ${
                    user.$id === message.user_id ? "my-message--header" : ""
                  }`}
                >
                  <p>
                    {message?.username ? (
                      <>
                        <span>{message.username}</span>
                      </>
                    ) : (
                      <span>Anonymous user</span>
                    )}
                    <small className="message-timestamp">
                      ({new Date(message.$createdAt).toLocaleString()})
                    </small>
                  </p>

                  {message.$permissions.includes(
                    `delete(\"user:${user.$id}\")`
                  ) && (
                    <Trash2
                      onClick={() => deleteMessage(message.$id)}
                      className={`delete--btn ${
                        user.$id === message.user_id ? "my-trash-icon" : ""
                      }`}
                    />
                  )}
                </div>
                <div
                  className={`message--body ${
                    user.$id === message.user_id ? "my-message--body" : ""
                  }`}
                >
                  <span>{message.body}</span>
                </div>
              </div>
            );
          })}
        </div>

        <form id="message--form" onSubmit={handleSubmit}>
          <div>
            <textarea
              required
              maxLength="1000"
              placeholder="Say something.."
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
            ></textarea>
          </div>

          <div className="send-btn--wrapper">
            <input type="submit" value="send" className="btn btn--secondary" />
          </div>
        </form>
      </div>
    </main>
  );
};

export default Room;
