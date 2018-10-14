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
              offsetX: -0.01,
              offsetY: -0.01,
            }}
            width={800}
            height={800}
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
                  size: 12,
                  color: '#fff',
                  weight: 'bold',
                }}
            labelFont={{
                  family: 'Arial',
                  size: 16,
                  color: '#fff',
                  weight: 'bold',
                }}
            //Custom bubble/legend click functions such as searching using the label, redirecting to other page
            bubbleClickFunc={this.bubbleClick}
            legendClickFun={this.legendClick}
            data={[
              { label: 'CRM', value: 1, color: '#000000' },
              { label: 'API', value: 1 , color: '#ff00ff'},
              { label: 'Data', value: 1, color: '#00000f' },
              { label: 'Commerce', value: 1, color: '#f000ff' },
              { label: 'AI', value: 3, color: '#ff0000' },
              { label: 'Management', value: 5, color: '#ff00ff' },
              { label: 'Testing', value: 6, color: '#ff00ff' },
              { label: 'Mobile', value: 9, color: '#ff00ff' },
            ]}
          />
      </div>
    );
  }
}

export default App;