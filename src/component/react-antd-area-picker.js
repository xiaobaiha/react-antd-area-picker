import React from 'react';
import { Select } from 'antd';
import { pca, pcaa } from 'area-data';

const Option = Select.Option;

class AreaPicker extends React.Component{
  constructor(props){
    super(props);
    // console.log("area props:", props);
    const value = props.value || [];
    const level = props.level || 3;
    const disabled = props.disabled || false;
    this.state = {
      value: value,
      level: level,
      disabled: disabled,
    };
  }
  componentWillMount(){
    const value = this.state.value;
    const level = this.state.level;
    // console.log("will mount value:", value);
    if(level === 3){
      if(value.length === 0){
        this.setState({
          firstLevelOptions: pcaa['86'],
          secondLevelOptions: pcaa['110000'],
          thirdLevelOptions: pcaa['110100'],
          value: []
        });
      } else if(value.length === 3 && value[0] !== '' && value[1] !== ''){
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
          value: []
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
    // console.log("nextProps:",nextProps);
    if('value' in nextProps && nextProps.value){
      const value = nextProps.value;
      // console.log("value:", nextProps.value,value[0].code,value[1].code);
      this.setState({
        value: value,
        firstLevelOptions: pcaa['86'],
        secondLevelOptions: pcaa[value[0].code],
        thirdLevelOptions: pcaa[value[1].code]
      });
    }
    if('level' in nextProps && nextProps.level){
      const level = nextProps.level;
      // console.log("level:", nextProps.level);
      this.setState({level: level});
    }
    if('disabled' in nextProps && [true,false].includes(nextProps.disabled)){
      const disabled = nextProps.disabled;
      // console.log("disabled:", nextProps.disabled);
      this.setState({disabled: disabled});
    }
  }
  handleFirstLevelChange = (e) => {
    // console.log("first change:", e);
    let value = this.state.value;
    const level = this.state.level;
    const secondKey = Object.keys(pcaa[e])[0];
    const thirdKey = Object.keys(pcaa[secondKey])[0];
    const firstObj = level===2?pca['86']:pcaa['86'];
    const secondObj = level===2?pca[e]:pcaa[e];
    const thirdObj = level===2?pca[secondKey]:pcaa[secondKey];

    value.splice(0, 3,  {code:e},  {code:secondKey},  {code: thirdKey});
    this.setState({
      value: value,
      secondLevelOptions: secondObj,
      thirdLevelOptions: thirdObj
    });
    // console.log("second and third:", pcaa[e], pcaa[secondKey])
    this.triggerChange(value,firstObj,secondObj,thirdObj);
  }
  handleSecondLevelChange = (e) => {
    // console.log("second change:", e);
    let value = this.state.value;
    const level = this.state.level;
    const {firstLevelOptions,secondLevelOptions} = this.state;
    const thirdObj = level===2?pca[e]:pcaa[e];
    
    value.splice(1, 2,  {code:e},  {code:Object.keys(pcaa[e])[0]});
    this.setState({
      value: value,
      thirdLevelOptions: thirdObj,
    });
    this.triggerChange(value,firstLevelOptions,secondLevelOptions,thirdObj);
  }
  handleThirdLevelChange = (e) => {
    // console.log("third change:", e);
    let value = this.state.value;
    const {firstLevelOptions, secondLevelOptions,thirdLevelOptions} = this.state;

    value.splice(2, 1, {code:e});
    this.setState({
      value: value,
    });
    this.triggerChange(value,firstLevelOptions,secondLevelOptions,thirdLevelOptions);
  }
  triggerChange(changeValue, first, second, third){
    const change = this.props.onChange;
    // console.log("trigger change:", changeValue, first, second, third)

    if(change)  change([
      {code: changeValue[0].code,value: first[changeValue[0].code]},
      {code: changeValue[1].code,value: second[changeValue[1].code]},
      {code: changeValue[2].code,value: third[changeValue[2].code]},
    ]);
  }
  render(){
    const first = this.state.firstLevelOptions;
    const second = this.state.secondLevelOptions;
    const third = this.state.thirdLevelOptions;
    const { level, value } = this.state;
    // console.log("first:",  first, " second:", second, " third:", third);
    // console.log("level:", level, " value:", value);

    return (<div>
      <Select disabled={this.state.disabled} style={{'marginRight': '1%'}} dropdownMatchSelectWidth={false} value={value.length===0?'':value[0].code} onChange={this.handleFirstLevelChange}>
        {Object.keys(first).map(item => {
          if(level === 2){
            return <Option key={item} value={item}>{first[item]}</Option>;
          } else if(level === 3){
            return <Option key={item} value={item}>{first[item]}</Option>;
          }
        })}
      </Select>
      <Select disabled={this.state.disabled} style={{'marginRight': '1%'}} dropdownMatchSelectWidth={false} value={value.length===0?'':value[1].code} onChange={this.handleSecondLevelChange}>
      {Object.keys(second).map(item => {
          if(level === 2){
            return <Option key={item} value={item}>{second[item]}</Option>;
          } else if(level === 3){
            return <Option key={item} value={item}>{second[item]}</Option>;
          }
        })}
      </Select>
      {level > 2 ?
      <Select disabled={this.state.disabled} dropdownMatchSelectWidth={false} value={value.length===0?'':value[2].code} onChange={this.handleThirdLevelChange}>
        {Object.keys(third).map(item => {
          return <Option key={item} value={item}>{third[item]}</Option>;
        })}
      </Select> : ''}
    </div>);
  }
}

module.exports = AreaPicker;