import React, { Component } from 'react';
import Sound from '../components/Sound';

class SoundList extends Component {
  render() {
    return (
      <div className="sound-list-container">
          {
            this.props.products.map(product => 
              <Sound product={product} key={product._id}/>
            )
          }
      </div>
    );
  }
}

export default SoundList;