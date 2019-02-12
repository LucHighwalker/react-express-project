/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable semi */
import React, { Component } from 'react';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    // State holds values returned from server
    this.state = {
      about: null,
      message: null,
      lotto: null,
      power: null,
    };
  }

  componentDidMount() {
    // Use Fetch to call API. The /test route returns a simple string
    // This call in componentDidMount will only be called once
    fetch('/about')
      .then((res) => {
        // stream the response as JSON
        res.json();
      })
      .then((json) => {
        console.log(json);
        const { about } = json; // Get a value from JSON object
        this.setState({ about }); // Set a value on state with returned value
      })
      .catch((err) => {
        // Handle errors
        console.log(err.message);
      });

    // Let's call another API
    this.fetchMessage();
  }

  formatLotto() {
    const { lotto } = this.state;
    if (lotto !== undefined) {
      let index = -1;
      return lotto.map((number) => {
        index += 1;
        return (
          <span key={index}>
            {number}
            &nbsp;
          </span>
        );
      });
    }
    return null;
  }

  fetchMessage(url = '/random/99') {
    // Wrapping the API call in a function allow you to make calls to this
    // API as often as needed.

    // This calls a route and passes value in the query string.
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        console.log('>', json);
        this.setState({
          message: json.value,
          lotto: json.numbers,
          power: json.power,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  renderMessage() {
    // Used to conditionally render data from server.
    // Returns null if message is null otherwise returns
    // a populated JSX element.
    const { message, power } = this.state;
    if (message === null) {
      return undefined;
    }

    return (
      <div>
        <h1>{message}</h1>
        <h1>{this.formatLotto()}</h1>
        <h1>{power}</h1>
      </div>
    );
  }

  render() {
    const { about } = this.state;

    return (
      <div className="App">
        <p>
          <strong>About:</strong>
          {about}
        </p>
        <div>{this.renderMessage()}</div>
        <p>
          <button
            type="button"
            onClick={() => {
              this.fetchMessage();
            }}
          >
            Random Num
          </button>
          <button
            type="button"
            onClick={() => {
              this.fetchMessage('/lotto');
            }}
          >
            Random Lotto
          </button>
        </p>
      </div>
    );
  }
}

export default App;
