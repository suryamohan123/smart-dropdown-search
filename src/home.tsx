import React from 'react';
import DropdownSearch from './dropdown-search';
import './home.scss';

export default class Home extends React.Component {

  state = {
    countriesList: [],
    selectedVal: "",
    privilege: false,
    noOfItems: 3
  };

  componentDidMount() {
    this.getCountriesList()
  }

  getCountriesList = () => {
    fetch("http://localhost:3000/listcountries", { crossDomain: true } as RequestInit)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({countriesList: result.data});
        }
      )
  };

  onAdd = (val: any) => {
    fetch('http://localhost:3000/add', {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'name': val
      })
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log("result", result);
          if (result.message === "success")
            this.getCountriesList();
          this.setState({ selectedVal: val })
        }
      );
  };

  setPrivilege = (event: any) => this.setState({privilege: event.target.value === "true" ? true : false})

  render() {
    const { countriesList, selectedVal, privilege, noOfItems } = this.state;
    return (
      <div className="home-component">
        <div onChange={this.setPrivilege.bind(this)}>
          <input type="radio" value="false" name="privilege" defaultChecked/> User
          <input type="radio" value="true" name="privilege" /> Admin
        </div>
        <br/>
        <div>
          <DropdownSearch
            privilege={privilege}
            noOfItems={noOfItems}
            addAndSelectHandler={val => this.onAdd(val)}
            countriesList={countriesList}
            value={selectedVal}
            onChange={val => this.setState({ selectedVal: val })}
          />
          <br/>
          <div>
            <b>Selected Country </b>: {selectedVal}
          </div>
        </div>
      </div>
    );
  }
}