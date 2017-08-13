import React, { Component } from "react";
import * as firebase from "firebase";
import toastr from "toastr/build/toastr.min.js";
toastr.options = {
  positionClass: "toast-top-center",
  timeOut: "3000",
  progressBar: true
};

class New extends Component {
  newContact() {
    const { googleID } = this.props.user;
    const idCardNumber = this._id.value.toUpperCase();
    const contact = {
      address: this._address.value,
      birthday: this._birthday.value,
      cellPhone: this._cellPhone.value,
      email: this._email.value,
      emergencyContactPersonName: this._ecName.value,
      emergencyContactPersonRelationship: this._ecr.value,
      emergencyContactPersonTel: this._ecPhone.value,
      idCardNumber,
      name: this._name.value,
      tel: this._tel.value
    };
    firebase
      .database()
      .ref(`users/${googleID}/contacts/${idCardNumber}`)
      .set(contact);
    toastr.success("新增人員成功");
    this._address.value = null;
    this._birthday.value = null;
    this._cellPhone.value = null;
    this._email.value = null;
    this._ecName.value = null;
    this._ecr.value = null;
    this._ecPhone.value = null;
    this._id.value = null;
    this._name.value = null;
    this._tel.value = null;
  }
  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          this.newContact();
        }}
      >
        <lable>姓名</lable>
        <input
          ref={c => (this._name = c)}
          type="text"
          className="form-control"
          required
        />
        <lable>身分證字號</lable>
        <input
          ref={c => (this._id = c)}
          type="text"
          className="form-control"
          required
        />
        <lable>生日</lable>
        <input
          ref={c => (this._birthday = c)}
          type="date"
          className="form-control"
          required
        />
        <lable>室內電話</lable>
        <input
          ref={c => (this._tel = c)}
          type="text"
          className="form-control"
          required
        />
        <lable>手機</lable>
        <input
          ref={c => (this._cellPhone = c)}
          type="text"
          className="form-control"
          required
        />
        <lable>Email</lable>
        <input
          ref={c => (this._email = c)}
          type="text"
          className="form-control"
          required
        />
        <lable>地址</lable>
        <input
          ref={c => (this._address = c)}
          type="text"
          className="form-control"
          required
        />
        <lable>緊急聯絡人</lable>
        <input
          ref={c => (this._ecName = c)}
          type="text"
          className="form-control"
          required
        />
        <lable>緊急聯絡人電話</lable>
        <input
          ref={c => (this._ecPhone = c)}
          type="text"
          className="form-control"
          required
        />
        <lable>緊急聯絡人稱謂</lable>
        <input
          ref={c => (this._ecr = c)}
          type="text"
          className="form-control"
          required
          placeholder="例: 父、女、姊、弟"
        />
        <button type="submit" className="btn btn-primary">
          新增人員
        </button>
      </form>
    );
  }
}

export default New;
