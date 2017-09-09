import React, { Component } from "react";
import "./App.css";
import * as firebase from "firebase";
import "./css/bootstrap.min.css";
import _ from "lodash";
import New from "./New";
import EditDelete from "./EditDelete";
import Select from "react-select";
import "react-select/dist/react-select.css";
import "toastr/build/toastr.min.css";
import firebaseConfig from "./configs/firebaseConfig";
import Header from "./Header";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isSignInOuting: true,
      userKey: null
    };
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const { uid: googleID, displayName: name, email } = user;
        firebase
          .database()
          .ref(`/users/${googleID}`)
          .once("value")
          .then(s => {
            if (s.val()) {
              this.setState({ user: s.val() });
            } else {
              const user = {
                googleID,
                name,
                email,
                contacts: []
              };
              firebase
                .database()
                .ref(`users/${googleID}`)
                .set(user);
              this.setState({ user });
            }
            this.setState({ isSignInOuting: false });
          });

        firebase
          .database()
          .ref(`/users/${googleID}`)
          .on("value", s => {
            if (s.val()) this.setState({ user: s.val() });
          });
      } else {
        this.setState({ user });
        this.setState({ isSignInOuting: false });
      }
    });
  }
  render() {
    const { user, userKey } = this.state;
    const contactOptions =
      user && user.contacts
        ? _.map(user.contacts, (c, key) => ({
            value: key,
            label: `${c.name}${c.idCardNumber.slice(0, 4) ||
              c.passportNumber.slice(0, 4)}...`
          }))
        : [];
    return (
      <div className="app">
        <Header {...this.props} {...this.state} />
        {user && (
          <div className="editor">
            <div className="contacts">
              <span>{`更新、刪除人員清單`}</span>
              <Select
                value={userKey}
                options={contactOptions}
                onChange={o => {
                  this.setState({ userKey: o.value });
                }}
              />
              {userKey && (
                <EditDelete
                  userKey={userKey}
                  contact={user.contacts[userKey]}
                  onDelete={() => this.setState({ userKey: null })}
                  user={user}
                />
              )}
            </div>
            <div className="new">
              <New user={user} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
