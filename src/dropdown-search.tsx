import React from 'react';
import * as _ from 'lodash';
import ChevronUpIcon from 'mdi-react/ChevronUpIcon';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';
import MagnifyIcon from 'mdi-react/MagnifyIcon';

import './dropdown-search.scss';

type Props = {
  countriesList: any;
  value?: any;  
  privilege: boolean;
  noOfItems: number;
  addAndSelectHandler: (options: any) => void;
  onChange: (options: any) => void;
};

export default class DropdownSearch extends React.Component<Props> {
  state = {
    open: false,
    countriesList: [],
    filteredList: [],
    searchVal: "",
    newCountryVal: "",
    loadMoreCount: 0,
    privilege: false
  };

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (this.props.countriesList !== prevState.countriesList) {
      this.setState({ countriesList: this.props.countriesList, filteredList: this.sliceCountries(this.props.noOfItems) })
    }
    if (this.props.privilege !== prevState.privilege) {
      this.setState({ privilege: this.props.privilege })
    }
    if (this.props.noOfItems !== prevState.noOfItems) {
      this.setState({ noOfItems: this.props.noOfItems, loadMoreCount: this.props.noOfItems })
    }
  }

  private _node: any = React.createRef<HTMLDivElement>();

  public closeDropdown = () => {
    this.setState({ open: false, filteredList: this.sliceCountries(this.props.noOfItems) });
  };

  private handleClick = (event: any) => {
    if (this._node.current.contains(event.target))
      return;

    this.closeDropdown();
  };

  private handleChange = (value: any, index: number) => {
    if (this.state.filteredList.length - 1 === index && this.getRemainingCount()) {
      this.loadMore();
      return false;
    }

    if (this.props.onChange)
      this.props.onChange(value)
    this.setState({ open: !this.state.open, searchVal: "", filteredList: Object.assign([], this.state.countriesList) });
  };

  private onAdd = (value: any) => {
    this.props.addAndSelectHandler(value);
    this.setState({ open: !this.state.open, newCountryVal: "", searchVal: "" });
  }

  private sliceCountries = (val: any) => Object.assign([], this.state.countriesList).slice(0, val);

  private onSearch = (event: any) => {
    let filterList = this.sliceCountries(this.props.noOfItems).filter((item: any) => item.name.toLowerCase().includes(event.target.value.toLowerCase()));
    this.setState({ filteredList: Object.assign([], filterList), searchVal: event.target.value });
    if (!filterList.length) {
      this.setState({ newCountryVal: event.target.value })
    }
    if (!event.target.value)
      this.setState({ newCountryVal: "" });
  }

  private loadMore = () => {
    if (this.state.filteredList.length < this.state.countriesList.length) 
      this.setState({ filteredList: this.sliceCountries(this.state.filteredList.length + this.props.noOfItems) }) 
  }

  public getRemainingCount = () => this.state.countriesList.length - this.state.filteredList.length < this.props.noOfItems ? this.state.countriesList.length - this.state.filteredList.length : this.props.noOfItems;

  render() {

    const { open, filteredList, newCountryVal, searchVal, privilege } = this.state;
    const { value } = this.props;

    return (
      <div className="dropdown-component" ref={this._node}>
        <div className="dropdown">
          <div className="dropdown-button" onClick={() => this.setState({ open: !open })}>
            <div className="dropdown-text">{value ? value : "Select a Location"}</div>
            <div className="dropdown-arrow">
              {open && <ChevronUpIcon color="black" />}
              {!open && <ChevronDownIcon color="black" />}
            </div>
          </div>
          <div className={`dropdown-menu ${open ? 'open' : 'closed'}`}>
            <div key="search" className="search">
              <span><MagnifyIcon className="magnifyIcon" size="23" /></span>
              <span><input type="text" name="search" placeholder="Search..." value={searchVal} onChange={this.onSearch} /></span>
            </div>
            {_.map(filteredList, (item: any, index) => (
              <div className="options" key={`item-${item.name}`} onClick={() => this.handleChange(item.name, index)}>
                <span>{item.name}</span>
                {filteredList && index === filteredList.length - 1 && this.getRemainingCount() ? (
                  <span className="loadMore" onClick={this.loadMore}> {this.getRemainingCount()} Load More...</span>
                ) : null}
              </div>
            ))}
            {newCountryVal?.length && privilege ? (
              <div key="new" className="">
                <span>{newCountryVal}</span>
                <button className="addBtn" onClick={() => this.onAdd(newCountryVal)}>Add & Select</button>
              </div>
            ) : null}
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}