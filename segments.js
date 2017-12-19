import axios from 'axios';
import * as Shakespeare from 'shakespeare-data';
let token;
let appId;
let id;
let amount = 1;
let host = 'http://localhost/';
let duration;
let type = 'COMMENT';
let colors = ['#73853f', '#cc2e3b', '#ad8db0', '#e46e34', '#ce9f3d', '#ffffff', '#4993f7', '#49f3d7'];

process.argv.forEach(function (val, index, array) {
  const key = val.split('=')[0];
  const value = val.split('=')[1];
  if (key && value) {
    console.log(key + ': ' + value);

    if (key === 'token') {
      token = value;
    }

    if (key === 'appId') {
      appId = value;
    }

    if (key === 'id') {
      id = value;
    }

    if (key === 'amount') {
      amount = value;
    }

    if (key === 'host') {
      host = value;
    }

    if (key === 'duration') {
      duration = value;
    }

    if (key === 'type') {
      type = value;
    }
  }
});

if (token && appId && id) {
  for (let i = 0; i < amount; i ++) {
    // generate text
    const sonnet = Shakespeare.sonnets.random();
    const amountOfLines = Math.floor(Math.random() * sonnet.lines.length) + 1;
    const segment_text = sonnet.lines.splice(0, amountOfLines)
    .toString().replace(/,,/g, ', ').replace(/;,/g, ', ');

    const data = { segment_text, segment_type: type };

    //generate time
    let time_start_milliseconds;
    let time_end_milliseconds;
    let segment_color;

    if (duration && duration > 15) {
      time_start_milliseconds = Math.floor(Math.random() * duration - 15) + 0;
      time_end_milliseconds = time_start_milliseconds + 15;
      segment_color = colors[Math.floor(Math.random() * colors.length)];

      data["time_start_milliseconds"] = time_start_milliseconds;
      data["time_end_milliseconds"] = time_end_milliseconds;
      data["segment_color"] = segment_color;
    }

    // url and headers
    const url = `${host}/API/assets/v1/assets/${id}/segments/`;
    const headers = { 'Content-Type': 'application/json', 'App-ID': appId, 'Auth-Token': token };

    console.log(url);
    console.log(data);
    console.log(headers);
    
    // request
    axios({
      url,
      method: 'post',
      data,
      headers,
    }).then(data => {
      console.log("SUCCESS");
    }).catch(error => {
      console.log(error.response.data.errors);
    })
  }
} else {
  console.log("NOT ENOUGH DATA");
}
