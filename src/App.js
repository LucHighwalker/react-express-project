/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable semi */
import React, { Component } from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    // State holds values returned from server
    this.state = {
      mode: 'number',
      about: null,
      message: null,
      rolls: null,
      sides: null,
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

  fetchMessage() {
    // Wrapping the API call in a function allow you to make calls to this
    // API as often as needed.

    const { mode, rolls, sides } = this.state;

    let url = '';

    switch (mode) {
      case 'lotto':
        url = 'lotto';
        break;

      case 'die':
        url = `random/die/${sides}`;
        break;

      case 'dice':
        url = `random/dice/${sides}/${rolls}`;
        break;

      default:
        url = 'random/99';
        break;
    }

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

  renderControls() {
    const { mode } = this.state;

    switch (mode) {
      case 'die':
        return (
          <span>
            sides:&nbsp;
            <input
              type="text"
              onChange={(e) => {
                console.log(e);
                e.preventDefault();
                this.setState({
                  sides: e.target.value,
                });
              }}
            />
          </span>
        );

      case 'dice':
        return (
          <div>
            <span>
              rolls:&nbsp;
              <input
                type="text"
                onChange={(e) => {
                  console.log(e);
                  e.preventDefault();
                  this.setState({
                    rolls: e.target.value,
                  });
                }}
              />
            </span>
            <br />
            <span>
              sides:&nbsp;
              <input
                type="text"
                onChange={(e) => {
                  console.log(e);
                  e.preventDefault();
                  this.setState({
                    sides: e.target.value,
                  });
                }}
              />
            </span>
          </div>
        );

      default:
        return null;
    }
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
    const { about, mode } = this.state;

    return (
      <div className="App">
        <p>
          <strong>About:&nbsp;</strong>
          {about}
          <br />
          <strong>Mode:&nbsp;</strong>
          {mode}
        </p>
        <div>{this.renderMessage()}</div>
        <br />
        <div>{this.renderControls()}</div>

        <button
          type="button"
          onClick={() => {
            this.fetchMessage();
          }}
        >
          Generate
        </button>

        <br />
        <br />

        <DropdownButton id="dropdown-basic-button" title="Dropdown button">
          <Dropdown.Item
            onClick={() => {
              this.setState({
                mode: 'number',
              });
            }}
          >
            Number
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              this.setState({
                mode: 'lotto',
              });
            }}
          >
            Lotto
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              this.setState({
                mode: 'die',
              });
            }}
          >
            Die
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              this.setState({
                mode: 'dice',
              });
            }}
          >
            Dice
          </Dropdown.Item>
        </DropdownButton>
      </div>
    );
  }
}

export default App;
