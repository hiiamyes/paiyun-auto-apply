import React, { Component } from "react";
import * as firebase from "firebase";
import toastr from "toastr/build/toastr.min.js";
toastr.options = {
  positionClass: "toast-top-center",
  timeOut: "3000",
  progressBar: true
};

class EditDelete extends Component {
  deleteContact() {
    const { googleID } = this.props.user;
    const idCardNumber = this._id.value.toUpperCase();
    if (
      idCardNumber &&
      idCardNumber !== "" &&
      window.confirm(`確定要刪除身分證字號 ${idCardNumber} 人員的資料嗎？`)
    ) {
      firebase
        .database()
        .ref(`users/${googleID}/contacts/${idCardNumber}`)
        .set(null);
      toastr.success("刪除人員資料成功");
      this.props.onDelete();
      this.clear();
    } else {
      toastr.error("刪除人員資料失敗");
    }
  }

  updateContact() {
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
    toastr.success("更新人員資料成功");
  }

  componentDidMount() {
    this.fill();
  }

  componentDidUpdate(prevProps, prevState) {
    this.fill();
  }

  fill() {
    this._address.value = this.props.contact.address;
    this._birthday.value = this.props.contact.birthday;
    this._cellPhone.value = this.props.contact.cellPhone;
    this._email.value = this.props.contact.email;
    this._ecName.value = this.props.contact.emergencyContactPersonName;
    this._ecr.value = this.props.contact.emergencyContactPersonRelationship;
    this._ecPhone.value = this.props.contact.emergencyContactPersonTel;
    this._id.value = this.props.contact.idCardNumber;
    this._name.value = this.props.contact.name;
    this._tel.value = this.props.contact.tel;
  }

  clear() {
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
      <div>
        <form onSubmit={e => e.preventDefault()}>
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
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => this.updateContact()}
          >
            更新人員資料
          </button>
        </form>
        <button className="btn btn-danger" onClick={() => this.deleteContact()}>
          刪除人員資料
        </button>
      </div>
    );
  }
}

export default EditDelete;
