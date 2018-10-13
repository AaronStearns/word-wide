import React, { Component } from 'react';
import '../app.css'
import wordwide from '../wordwide.png'
import axios from 'axios'
// import * as d3 from "d3";
import plotly from 'plotly'


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
                  inputWord: targetWord}) 
  };


  ngramClusters() {
  let clusters = [];
  clusters.push(<p class="ptag">{this.state.inputWord}</p>) 
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
      </div>
    );
  }
}

export default App;