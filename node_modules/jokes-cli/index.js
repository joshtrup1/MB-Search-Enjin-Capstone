#!/usr/bin/env node
const color = require('colors');
const ora = require('ora');

const spinner = ora('asking reddit').start();

const jokes = require('./lib');

jokes.then((data) => {
  spinner.stop();
  data.forEach(joke => {
    console.log(`${joke.title.underline}`);
    console.log(`${joke.punchline}`);
  })
});