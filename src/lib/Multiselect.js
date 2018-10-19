import React, {Component} from 'react';
import './Multiselect.css'

export class Multiselect extends Component {

  constructor (props) {
    super(props);

    let { selected, list } = props;
    list = list.map(e => {
      const s = {
        value: e,
        selected: false
      }
      if (selected && selected.indexOf(e) > -1) {
        s.selected = true;
      }
      return s;
    });

    this.state = {
      values: [...list],
      selectedValues: selected || [],
      searched: [],
      allSelected: false
    }

    if (selected.length) {
      props.onSelectItem(this.state.selectedValues);
    }
  }

  selectValue (item) {
    if (item.selected) {
      const newItems = this.state.selectedValues.filter(e => (e !== item.value ));

      this.setState({ 
        selectedValues: newItems,
        allSelected: false
      }, () => {
        this.props.onSelectItem(this.state.selectedValues);
      });
    } else {
      this.setState({ 
        selectedValues: [...this.state.selectedValues, item.value]
      }, () => {
        this.props.onSelectItem(this.state.selectedValues);
      });
    }

    item.selected = !item.selected;
    this.setState((state) => ({values: state.values}));
  }

  searchText () {
    const { values } = this.state;
    const s = values.filter(e => ( e.value.toLowerCase().indexOf(this.textInput.value) > -1 ));

    this.setState({searched: s});
  }

  checkAll () {
    const { allSelected, values } = this.state;
    const { onSelectItem } = this.props;
    const v = [];

    values.forEach(e => {
      if (allSelected)
        e.selected = false;
      else
        e.selected = true;
      if (e.selected) {
        v.push(e.value);
      }
    });

    this.setState({
      selectedValues: v,
      allSelected: !allSelected 
    }, () => {
      onSelectItem(this.state.selectedValues);
    });
  }

  displayList (e, i, theme) {
    return (
      <div key={i} className={ e.selected ? theme + ' selected value' : theme + ' value' } onClick={this.selectValue.bind(this, e)}>
        {e.value}
      </div>
    )
  }

  render () {
    const { values, searched, allSelected } = this.state;
    const { title, theme } = this.props;

    return (
      <div className='list'>
        <h1 className={`title ${theme}`}>{title}</h1>
        <div className='topbar'>
          <input className='search-box' placeholder='Search' onChange={this.searchText.bind(this)} ref={(input) => { this.textInput = input }} />
          { !allSelected ? <button className={`select-all ${theme}`} onClick={this.checkAll.bind(this)}>Select All</button>
          : <button className={`deselect-all ${theme}`} onClick={this.checkAll.bind(this)}>Deselect All</button> }
        </div>
        <div className='values'>
          { searched.length === 0 ? values.map((e, i) => ( this.displayList(e, i, theme) )
          ) : values.map((e, i) => (
            <div key={i}>
              { (searched.indexOf(e) > -1) ?
                this.displayList(e, i, theme)
              : null }
            </div>
          ))}
        </div>
      </div>
    )
  }
}
