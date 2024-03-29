[![Price](https://img.shields.io/badge/price-FREE-0098f7.svg)](https://github.com/wladradchenko/openai.wunjo.wladradchenko.ru/blob/main/LICENSE)
[![GitHub package version](https://img.shields.io/github/v/release/wladradchenko/openai.wunjo.wladradchenko.ru?display_name=tag&sort=semver)](https://github.com/wladradchenko/openai.wunjo.wladradchenko.ru)
[![License: MIT v1.0](https://img.shields.io/badge/license-Apache-blue.svg)](https://github.com/wladradchenko/openai.wunjo.wladradchenko.ru/blob/main/LICENSE)

<p align="right">(<a href="README_en.md">RU</a>)</p>
<div id="top"></div>

<br />
<div align="center">
  <a href="https://github.com/wladradchenko/wunjo.wladradchenko.ru">
    <img src="example/robot.gif" alt="Logo" width="180" height="180">
  </a>

  <h3 align="center">ChatGPT + Dall-e 2 in Wunjo AI</h3>
  <h4 align="center">Extensions</h4>

  <p align="center">
    Project documentation
    <br/>
    <br/>
    <br/>
    <a href="https://github.com/wladradchenko/wunjo.wladradchenko.ru/issues">Issue</a>
    ·
    <a href="https://github.com/wladradchenko/wunjo.wladradchenko.ru/issues">Features</a>
  </p>
</div>

>  Deprecated: Starting from version 1.4, the use of extensions in Wunjo AI is deprecated.

<!-- ABOUT THE EXTENSIONS -->
## About extension

The extension adds to the main application:
- Dialog generation
- Generation of txt2img image

<!-- ABOUT THE PROJECT -->
## About

Wunjo AI Extensions are add-on modules for extending the capabilities of Wunjo AI. Main GitHub project at <a href="https://github.com/wladradchenko/wunjo.wladradchenko.ru">link</a>.

Wunjo AI is a speech-to-text and speech-to-text recognition application. One of the unique features of this application is the ability to create multi-dialogues with multiple voices, and the number of characters used is not limited, unlike similar web applications. You can also speak text in real time and the app will recognize it from the audio. This feature is great for dictating text instead of manually typing it.

All in all, this neural network desktop application is a handy and powerful tool for anyone who needs speech synthesis and voice-to-text recognition. Best of all, the app is free, installs locally, and is easy to use! And you can use it in the voice acting of commercials, books, games, etc.

<!-- UPDATE -->
## Update 1.0.0

- [x] Added GPU usage for faster processing.
- [x] Switching work from CPU to GPU and vice versa
- [x] Background quality improvements when creating animations
- [x] Added panel for training Tacotron2 neural network model (training result in .wunjo/user_trained_voice)
- [x] Added panel for training Waveglow neural network model (training result in .wunjo/user_trained_voice)

<!-- UPDATE -->
## Update 1.0.0

- [x] Adding Open AI API key.
- [x] Dialog generation for txt2voice
- [x] Generate txt2img image for animation

<!-- INSTALL -->
## Installation

Download to directory `.wunjo/extensions/{folder}`

Register at [Open AI](https://platform.openai.com/account/api-keys), create a key and follow the steps to activate it (you need to set up paid account to activate an OpenAI key).

<!-- FORMAT -->
## Extension format

To create your own extension, you will need to create a run.py file with a run method that takes the media_folder, extension_folder, app directory as input, where media_folder is the media file directory for saving the code, extension_folder is the directory of the extension itself, app is the Flask application, where you can add new pages or options.

To add new elements to the front of the project, you need to create a templates/index.html directory in your extension, where you can add new elements, js, css.

An example of creating an extension structure in this project.

<!-- VIDEO -->
## Video

[![Watch the video](https://cdn1.tenchat.ru/static/vbc-gostinder/2023-05-22/f9fa5fb8-4e0f-4861-831f-03243633cef6.jpeg)](https://kinescope.io/204183724/original)

<!-- CONTACT -->
## Контакт

Author: [Wladislav Radchenko](https://github.com/wladradchenko/)

Email: [i@wladradchenko.ru](i@wladradchenko.ru)

Project: [https://github.com/wladradchenko/wunjo.wladradchenko.ru](https://github.com/wladradchenko/wunjo.wladradchenko.ru)

Web site: [wladradchenko.ru/voice](https://wladradchenko.ru/wunjo)

<!-- CREDITS -->
## Credits

* Tacatron 2 - https://github.com/NVIDIA/tacotron2
* Waveglow - https://github.com/NVIDIA/waveglow
* Apex - https://github.com/NVIDIA/apex

<p align="right">(<a href="#top">to top</a>)</p>
