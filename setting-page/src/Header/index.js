import React, { Component } from "react";
import * as firebase from "firebase";
import Loader from "halogen/ScaleLoader";
import "./styles.css";
import swal from "sweetalert2";
import GitHubButton from "react-github-button";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isSignInOuting: true
    };
  }
  signIn() {
    this.setState({ isSignInOuting: true });
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {})
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    const { user, isSignInOuting } = this.props;
    return (
      <div className="header">
        <div className="header-content">
          <div>
            <div>{`排雲山莊申請工具 v1.2.0`}</div>
            <div>
              人員清單編輯 {user ? `- ${user.name}` : ""}
            </div>
          </div>

          {isSignInOuting &&
            <Loader className="loader" color="#26A65B" size="10px" />}

          {!isSignInOuting &&
            <button
              className="btn btn-primary"
              onClick={() => {
                window.open(
                  "https://chrome.google.com/webstore/detail/%E6%8E%92%E9%9B%B2%E5%B1%B1%E8%8E%8A%E7%94%B3%E8%AB%8B%E5%B7%A5%E5%85%B7/gbofmccdcffgdinnlpimjhlhopmldkim"
                );
              }}
            >
              Chrome 擴充功能
            </button>}
          {!isSignInOuting &&
            <button
              className="btn btn-primary"
              onClick={() => {
                swal({
                  title: "隱私權政策",
                  text:
                    "本服務將會儲存使用者在使用服務過程中所建立的人員個資，並在個人資料保護法的規範下進行服務，本服務不會將使用者的個人資料提供給第三者，或將使用者的個人資料移作其他非本服務用途之使用。",
                  type: "info",
                  confirmButtonText: "我知道了"
                });
              }}
            >
              隱私權政策
            </button>}
          {!isSignInOuting &&
            <button
              className="btn btn-primary"
              onClick={() => {
                window.open(
                  "mailto:hiiamyes.contact@gmail.com?subject=排雲山莊申請工具問題"
                );
              }}
            >
              聯絡我
            </button>}

          {!isSignInOuting &&
            <button
              className="btn btn-primary"
              onClick={() => {
                firebase.auth().currentUser
                  ? firebase
                      .auth()
                      .signOut()
                      .then(function() {
                        this.setState({ user: null });
                      })
                      .catch(function(error) {})
                  : this.signIn();
              }}
            >
              {user ? "登出" : "以 Google 帳號登入"}
            </button>}
          <GitHubButton
            type="stargazers"
            namespace="hiiamyes"
            repo="paiyun-auto-apply"
          />
        </div>
      </div>
    );
  }
}

export default Header;
