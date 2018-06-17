import React from 'react';
import { Select } from 'antd';
import { pca, pcaa } from 'area-data';
// import './react-antd-area-picker.css';

const Option = Select.Option;

class AreaPicker extends React.Component{
  constructor(props){
    super(props);
    console.log("area props:", props);
    const value = props.value || [];
    const level = props.level || 3;
    this.state = {
      value: value,
      level: level,
    };
  }
  componentWillMount(){
    const value = this.state.value;
    const level = this.state.level;
    if(level === 3){
      if(value.length === 0){
        this.setState({
          firstLevelOptions: pcaa['86'],
          secondLevelOptions: pcaa['110000'],
          thirdLevelOptions: pcaa['110100'],
          value: ['','','']
        });
      } else if(value.length === 3){
        this.setState({
          firstLevelOptions: pcaa['86'],
          secondLevelOptions: pcaa[value[0]],
          thirdLevelOptions: pcaa[value[1]],
        });
      } else {
        console.error("Invalid value length: supposed to be 3 elements in value.")
      }
    } else if(level === 2){
      if(value.length === 0){
        this.setState({
          firstLevelOptions: pca['86'],
          secondLevelOptions: pca['110000'],
          thirdLevelOptions: {},
          value: ['','','']
        });
      } else if(value.length === 2){
        this.setState({
          firstLevelOptions: pca['86'],
          secondLevelOptions: pca[value[0]],
          thirdLevelOptions: {},
        });
      } else {
        console.error("Invalid value length: supposed to be 3 elements in value.")
      }
    } else {
      console.error("Invalid level value: supposed 2 or 3.");
    }
    
  }
  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    if('value' in nextProps){
      const value = nextProps.value;
      console.log("value:", nextProps.value);
      this.setState({value: value});
    }
    if('level' in nextProps){
      const level = nextProps.level;
      console.log("level:", nextProps.level);
      this.setState({level: level});
    }
  }
  handleFirstLevelChange = (e) => {
    let value = this.state.value;
    const level = this.state.level;
    const secondKey = Object.keys(pcaa[e])[0];
    const thirdKey = Object.keys(pcaa[secondKey])[0]

    value.splice(0, 3, e, secondKey, thirdKey);
    this.setState({
      value: value,
      secondLevelOptions: level===2?pca[e]:pcaa[e],
      thirdLevelOptions: level===2?pca[secondKey]:pcaa[secondKey]
    });
  }
  handleSecondLevelChange = (e) => {
    let value = this.state.value;
    const level = this.state.level;
    
    value.splice(1, 2, e, Object.keys(pcaa[e])[0]);
    this.setState({
      value: value,
      thirdLevelOptions: level===2?pca[e]:pcaa[e],
    });
  }
  handleThirdLevelChange = (e) => {
    let value = this.state.value;
    value.splice(2, 1, e);
    this.setState({
      value: value,
    });
  }
  selectedAreaChange(e){
    this.setState({value: e});
    this.triggerChange({value: e});
  }
  triggerChange(changeValue){
    const change = this.props.onChange;
    if(change)  change(Object.assign({}, this.state, changeValue));
  }
  render(){
    const first = this.state.firstLevelOptions;
    const second = this.state.secondLevelOptions;
    const third = this.state.thirdLevelOptions;
    const { level, value } = this.state;
    console.log("first:",  first, " second:", second, " third:", third);
    console.log("level:", level, " value:", value);

    return (<div>
      <Select style={{'marginRight': '1%'}} dropdownMatchSelectWidth={false} value={value.length===0?'':value[0]} onChange={this.handleFirstLevelChange}>
        {Object.keys(first).map(item => {
          if(level === 2){
            return <Option key={item} value={item}>{first[item]}</Option>;
          } else if(level === 3){
            return <Option key={item} value={item}>{first[item]}</Option>;
          }
        })}
      </Select>
      <Select style={{'marginRight': '1%'}} dropdownMatchSelectWidth={false} value={value.length===0?'':value[1]} onChange={this.handleSecondLevelChange}>
      {Object.keys(second).map(item => {
          if(level === 2){
            return <Option key={item} value={item}>{second[item]}</Option>;
          } else if(level === 3){
            return <Option key={item} value={item}>{second[item]}</Option>;
          }
        })}
      </Select>
      {level > 2 ?
      <Select dropdownMatchSelectWidth={false} value={value.length===0?'':value[2]} onChange={this.handleThirdLevelChange}>
        {Object.keys(third).map(item => {
          return <Option key={item} value={item}>{third[item]}</Option>;
        })}
      </Select> : ''}
    </div>);
  }
}

module.exports = AreaPicker;