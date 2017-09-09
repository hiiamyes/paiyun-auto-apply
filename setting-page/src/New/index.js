import React, { Component } from "react";
import * as firebase from "firebase";
import toastr from "toastr/build/toastr.min.js";
import Select from "react-select";

toastr.options = {
  positionClass: "toast-top-center",
  timeOut: "3000",
  progressBar: true
};

const countryCodeOptions = [
  { value: "TW", label: "台灣" },
  { value: "JP", label: "日本" },
  { value: "KR", label: "韓國" },
  { value: "SG", label: "新加坡" },
  { value: "CN", label: "中國" },
  { value: "HK", label: "香港" },
  { value: "EUUS", label: "歐美" },
  { value: "Others", label: "其他" }
];

const Label = props => (
  <label style={{ marginTop: "1rem" }}>{props.children}</label>
);

class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCode: "TW",
      gender: "male"
    };
  }
  newContact() {
    const { googleID } = this.props.user;
    const idCardNumber = this._id ? this._id.value.toUpperCase() : "";
    const passportNumber = this._passportNumber
      ? this._passportNumber.value
      : "";
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
      tel: this._tel.value,
      countryCode: this.state.countryCode,
      passportNumber,
      gender: this.state.gender
    };
    firebase
      .database()
      .ref(`users/${googleID}/contacts`)
      .push(contact);
    toastr.success("新增人員成功");
    this._address.value = null;
    this._birthday.value = null;
    this._cellPhone.value = null;
    this._email.value = null;
    this._ecName.value = null;
    this._ecr.value = null;
    this._ecPhone.value = null;
    if (this._id) this._id.value = null;
    this._name.value = null;
    this._tel.value = null;
    if (this._passportNumber) this._passportNumber.value = null;
    this.setState({ countryCode: "TW", gender: "male" });
  }
  render() {
    const { countryCode, gender } = this.state;
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          this.newContact();
        }}
      >
        <Label>姓名</Label>
        <input
          ref={c => (this._name = c)}
          type="text"
          className="form-control"
          required
        />
        <Label>國籍</Label>
        <Select
          value={countryCode}
          options={countryCodeOptions}
          onChange={o => this.setState({ countryCode: o.value })}
          clearable={false}
        />
        {countryCode === "TW" && (
          <div>
            <Label>身分證字號</Label>
            <input
              ref={c => (this._id = c)}
              type="text"
              className="form-control"
              required
            />
          </div>
        )}

        {countryCode !== "TW" && (
          <div>
            <Label>護照號碼</Label>
            <input
              ref={c => (this._passportNumber = c)}
              type="text"
              className="form-control"
              required
            />
          </div>
        )}
        <div>
          <Label>性別</Label>
          <div style={{ display: "flex" }}>
            <div class="form-check" style={{ marginRight: "1rem" }}>
              <label class="form-check-label">
                <input
                  class="form-check-input"
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onClick={() => this.setState({ gender: "male" })}
                />
                男
              </label>
            </div>
            <div class="form-check">
              <label class="form-check-label">
                <input
                  class="form-check-input"
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onClick={() => this.setState({ gender: "female" })}
                />
                女
              </label>
            </div>
          </div>
        </div>

        <Label>生日</Label>
        <input
          ref={c => (this._birthday = c)}
          type="date"
          className="form-control"
          required
        />
        <Label>室內電話</Label>
        <input
          ref={c => (this._tel = c)}
          type="text"
          className="form-control"
          required
        />
        <Label>手機</Label>
        <input
          ref={c => (this._cellPhone = c)}
          type="text"
          className="form-control"
          required
        />
        <Label>Email</Label>
        <input
          ref={c => (this._email = c)}
          type="text"
          className="form-control"
          required
        />
        <Label>地址</Label>
        <input
          ref={c => (this._address = c)}
          type="text"
          className="form-control"
          required
        />
        <Label>緊急聯絡人</Label>
        <input
          ref={c => (this._ecName = c)}
          type="text"
          className="form-control"
          required
        />
        <Label>緊急聯絡人電話</Label>
        <input
          ref={c => (this._ecPhone = c)}
          type="text"
          className="form-control"
          required
        />
        <Label>緊急聯絡人稱謂</Label>
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
