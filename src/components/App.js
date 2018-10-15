import React, { Component } from 'react';
import '../app.css'
import wordwide from '../wordwide.png'
import axios from 'axios'
// import * as d3 from "d3";
import plotly from 'plotly'
import BubbleChart from '@weknow/react-bubble-chart-d3';
import underscore from 'underscore';


class App extends Component {
  constructor() {
    super();

    this.state = {
      inputWord: "",
      returnedWords: {},
      phonetic: "",
      newSearchWord: null 
    }
  }

  handleSearchClick(event) {
    if (this.state.newSearchWord == null) {
    this.fetchWords(this.state.inputWord)
    console.log(this.state)
    } else {
      this.fetchWords(this.state.newSearchWord)
    }
  }

  async fetchWords(targetWord) {
    const res = await axios.get('http://localhost:2000/api/getWord/' + targetWord);
    const ipaReq = await axios.get('http://localhost:2000/api/getIpa/' + targetWord);
    this.setState({returnedWords: res.data,
                    phonetic: ipaReq.data,
                  inputWord: targetWord});
    console.log(this.state.returnedWords)
  };


  ngramClusters() {
  let clusters = [];
  clusters.push(<p class="wordtag">{this.state.inputWord}</p>) 
  clusters.push(<p class="ptag">{this.state.phonetic}</p>)
  for (let key in this.state.returnedWords) {
      clusters.push( 
      <p onClick={event => this.fetchWords(this.state.returnedWords[key][0])} class="phonetic">
        {key}  {this.state.returnedWords[key].slice(0, 1)}
      </p>
      )
    }
    return clusters
    console.log(clusters + "clusters logged")

  }
  bubbleClick = (label) =>{
    console.log("Custom bubble click func")
  }
  legendClick = (label) =>{
    console.log("Customer legend click func")
  }

  generateChart = (obj) => {

    // function below populates these arrays
    let phoneticLength = []
    let names = []
    const colors = ["#BBBBFF", "#BBDAFF", "#BBEBFF", "8CEFFD", "#A5FEFA"]
  
    // sample from colors and assign to the object
  
    let arrayPopulater = function (anObject) {
      for (var key in anObject) { 
        phoneticLength.push( Object.keys( anObject[key] ).length )
        names.push( key )
      }
    }
  
    arrayPopulater(obj)
  
    var words = [];
  
    for (var i = 0; i < names.length; i++)  
      words.push({
        label:names[i], 
        value:phoneticLength[i],
        color: colors[i % colors.length]
        }
      );
  
    return words;
  }

  render() {
    return (
      <div class="mainDiv">
        <div>
          <img src={wordwide} class = "wordwide"/>
        </div>
        <div>
          <p class = "spacerP"></p>
        </div>
          <input onChange={event => this.setState({inputWord: event.target.value})} class="text" placeholder="Enter a word"></input>
          <button onClick={event => this.handleSearchClick(event)} class="submitButton">🔍</button>
          <div className="sound-list-container">
            {this.ngramClusters()}
          </div>
          <BubbleChart
            graph = {{
              zoom: 1.0,
              offsetX: -0.00,
              offsetY: -0.00,
            }}
            width={1000}
            height={1000}
            showLegend={false} 
            legendPercentage={20} 
            // legendFont={{
            //       family: 'Arial',
            //       size: 12,
            //       color: '#000',
            //       weight: 'bold',
            //     }}
            valueFont={{
                  family: 'Arial',
                  size: 24,
                  color: '#000000',
                  weight: 'bold',
                }}
            labelFont={{
                  family: 'Arial',
                  size: 24,
                  color: '#000000',
                  weight: 'bold',
                }}
            //Custom bubble/legend click functions such as searching using the label, redirecting to other page
            bubbleClickFunc={this.bubbleClick}
            legendClickFun={this.legendClick}
            data={this.generateChart(this.state.returnedWords)}
          />
      </div>
    );
  }
}

export default App;