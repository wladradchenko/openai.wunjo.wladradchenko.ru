window.addEventListener("DOMContentLoaded", (event) => {
    const voiceNamesJinja = getVoiceNamesJinja();

    const linkOpenAI = document.getElementById('a-openai');

    linkOpenAI.addEventListener('click', (event) => {
       var openAIPanel = introJs();
       openAIPanel.setOptions({
         steps: [
            {
                element: linkOpenAI,
                title: 'Панель Open AI',
                position: 'right',
                intro: `<div style="width: 250pt;">
                            <div style="margin-bottom: 15pt;display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
                                <input placeholder="" type="text" id="openai-api-key" style="border-width: 2px;border-style: groove;border-color: rgb(192, 192, 192);background-color: #fff;width: 100%;padding: 0.5rem 1rem;">
                                <button class="introjs-button" onclick="sendOpenAIKey(this.parentElement);">Добавить ключ</button>
                            </div>
                            <div>
                                <button class="introjs-button" onclick="document.getElementById('openai-dialog-generator').style.display = (document.getElementById('openai-dialog-generator').style.display == 'none') ? 'block' : 'none'; document.getElementById('openai-image-generator').style.display = (document.getElementById('openai-image-generator').style.display == 'none') ? 'block' : 'none';this.innerText = (this.innerText == 'Переключить на генератор диалога') ? 'Переключить на генератор изображения' : 'Переключить на генератор диалога';" style="display: flex; right: 0;left: 0;justify-content: center;width: 100%;padding-left: 0;padding-right: 0;">Переключить на генератор диалога</button>
                            </div>
                            <div style="display: none" id="openai-dialog-generator">
                                <fieldset style="padding: 5pt;margin-top: 10pt;column-count: 3;">
                                    <legend>Голоса для диалога</legend>
                                    ${voiceNamesJinja}
                                </fieldset>
                                <div style="margin-top: 15pt;margin-bottom: 15pt;display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
                                    <input placeholder="О чём диалог?" type="text" id="openai-dialog-prompt" style="border-width: 2px;border-style: groove;border-color: rgb(192, 192, 192);background-color: #fff;width: 100%;padding: 0.5rem 1rem;">
                                    <button class="introjs-button" onclick="generateOpenAIDialog(this.parentElement.parentElement);">Сгенерировать</button>
                                </div>
                                <div>
                                    <textarea id="openai-dialog-result" title="Результат генерации" style="padding: 10pt;font-size: 12pt;min-width: 100%;max-width: 100%;" readonly></textarea>
                                    <button id="openai-dialog-result-button" class="introjs-button" onclick="addOpenAIDialog();" style="right: 0;left: 0;justify-content: center;width: 100%;padding-left: 0;padding-right: 0;">Добавить диалог</button>
                                </div>
                            </div>
                            <div id="openai-image-generator">
                                <div style="margin-top: 15pt;margin-bottom: 15pt;display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
                                    <input placeholder="Что сгенерировать?" type="text" id="openai-image-prompt" style="border-width: 2px;border-style: groove;border-color: rgb(192, 192, 192);background-color: #fff;width: 100%;padding: 0.5rem 1rem;">
                                    <button class="introjs-button" onclick="generateOpenAIImage(this.parentElement);">Сгенерировать</button>
                                </div>
                                <div>
                                    <img style="width: 100%;color: #999;border: 2px dashed #000;object-fit: cover;" id="openai-image-result"></img>
                                    <p id="openai-image-result-prompt" style="text-align: center;"></p>
                                </div>
                            </div>
                        </div>`,
            },
        ],
          showButtons: false,
          showStepNumbers: false,
          showBullets: false,
          nextLabel: 'Продолжить',
          prevLabel: 'Вернуться',
          doneLabel: 'Закрыть'
       });
       openAIPanel.start();

       getOpenAIKey();
       getOpenAIImage();
       getOpenAIDialog();
    });
});


// Send image prompt
    function generateOpenAIDialog(elem) {
        const voiceOpenAICheckboxes = elem.querySelectorAll(".openai-voice-checkboxes");
        const promptOpenAIDialog = elem.querySelector("#openai-dialog-prompt").value;
        const checkedValues = []; // List to store checked values

        voiceOpenAICheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
              checkedValues.push(checkbox.value); // Add the checked value to the list
            }
        });

        document.getElementById('status-message').innerHTML += "<p style='margin-top: 5pt;'>Подождите... Происходит генерация диалога</p>";

        // Make a POST request to update the OpenAI prompt
        fetch("/get_openai_dialog/", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"thematic": promptOpenAIDialog, "voices": checkedValues})
          })
          .then(response => response.json())
          .then(data => {
            // Update dialog
            let dialogText = "";
            data.forEach((item) => {
              const [key, value] = Object.entries(item)[0];
              if (value.length > 0) {
                dialogText += `${key}: ${value}\n\n`;
              }
            });

            if (dialogText.length > 0) {
                document.getElementById("openai-dialog-result").style.display = 'flex';
                document.getElementById("openai-dialog-result-button").style.display = 'flex';
            } else {
                document.getElementById("openai-dialog-result").style.display = 'none';
                document.getElementById("openai-dialog-result-button").style.display = 'none';
            }

            document.getElementById("openai-dialog-result").value = dialogText;
          })
          .catch(error => {
            console.error("Error:", error);
          });
    }

    async function addOpenAIDialog() {
      try {
        const generateDialogResultDict = await getOpenAIDialog();

        const voiceCardContainers = document.querySelectorAll('.voice-card-container');
        const firstPlusButton = document.querySelector('.voice-card-container .a-button.voice-card-container-plus');

        const numKeys = generateDialogResultDict.length;
        const numVoiceCardContainers = voiceCardContainers.length;

        if (numKeys > numVoiceCardContainers) {
          const numClicks = numKeys - numVoiceCardContainers;
          for (let i = 0; i < numClicks; i++) {
            firstPlusButton.click();
          }
        } else if (numKeys < numVoiceCardContainers) {
          const numClicks = numVoiceCardContainers - numKeys;
          for (let i = 0; i < numClicks; i++) {
            const removeButton = document.querySelector('.a-button.voice-card-container-remove:last-child');
            if (removeButton) {
              removeButton.click();
            }
          }
        }

        const voiceCardContainersUpdate = document.querySelectorAll('.voice-card-container');

        generateDialogResultDict.forEach((item, index) => {
          const [key, value] = Object.entries(item)[0];
          const textInput = voiceCardContainersUpdate[index].querySelector('.text-input');
          textInput.value = value;

          const modelCheckboxValueVoices = voiceCardContainersUpdate[index].querySelectorAll('.model-checkbox-value');

          for (let i = 0; i < modelCheckboxValueVoices.length; i++) {
            const checkbox = modelCheckboxValueVoices[i];

            if (checkbox.value === key) {
              if (!checkbox.checked) {
                checkbox.click();
              }
            } else {
              if (checkbox.checked) {
                checkbox.click();
              }
            }
          }
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }


    // Get dialog generation
    async function getOpenAIDialog() {
      try {
        const response = await fetch("/get_openai_dialog/", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        let dialogText = "";

        if (!data) {
            return null
        }

        data.forEach((item) => {
          const [key, value] = Object.entries(item)[0];
          if (value.length > 0) {
            dialogText += `${key}: ${value}\n\n`;
          }
        });

        if (dialogText.length > 0) {
            document.getElementById("openai-dialog-result").style.display = 'flex';
            document.getElementById("openai-dialog-result-button").style.display = 'flex';
        } else {
            document.getElementById("openai-dialog-result").style.display = 'none';
            document.getElementById("openai-dialog-result-button").style.display = 'none';
        }

        document.getElementById("openai-dialog-result").value = dialogText;
        return data;
      } catch (error) {
        console.error("Error:", error);
        return null;
      }
    }


    // Function to handle the form submission and update the OpenAI API key
    function sendOpenAIKey(elem) {
      // Get the OpenAI API key from the input field
      var openai_api_key = elem.querySelector('#openai-api-key').value;

      // Make a POST request to update the OpenAI API key on the backend
      fetch("/set_openai_key/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"openai_api_key": openai_api_key})
      })
      .then(response => response.json())
      .then(data => {
        // Clear the input field after successful submission
        elem.querySelector('#openai-api-key').value = "";

        const openaiApiKey = data.openai_api_key;
        const inputElement = document.getElementById("openai-api-key");
        inputElement.placeholder = openaiApiKey;
      })
      .catch(error => {
        console.error("Error:", error);
      });
    };

    // Function to retrieve the OpenAI API key and set it as the placeholder value
    function getOpenAIKey() {
      // Make a GET request to retrieve the OpenAI API key from the backend
      fetch("/set_openai_key/", {
        method: "GET",
      })
      .then(response => response.json())
      .then(data => {
        const openaiApiKey = data.openai_api_key;
        const inputElement = document.getElementById("openai-api-key");
        inputElement.placeholder = openaiApiKey;
      })
      .catch(error => {
        console.error("Error:", error);
      });
    };

    // Send image prompt
    function generateOpenAIImage(elem) {
      // Get the image prompt
      var prompt = elem.querySelector('#openai-image-prompt').value;
      document.getElementById('status-message').innerHTML += "<p style='margin-top: 5pt;'>Подождите... Происходит генерация изображения</p>";

      // Make a POST request to update the OpenAI prompt
      fetch("/get_openai_image/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"prompt": prompt})
      })
      .then(response => response.json())
      .then(data => {
        // Update image
        const openaiImage = data.image;
        const openaiPrompt = data.prompt;

        // Set the base64 image as the src of the img tag
        const imgElement = document.getElementById("openai-image-result");
        if (openaiImage != "") {
            imgElement.style.display = 'block';
            imgElement.src = "data:image/png;base64," + openaiImage;
        } else {
            imgElement.style.display = 'none';
        }

        // Update the prompt text
        const promptElement = document.getElementById("openai-image-result-prompt");
        promptElement.innerText = openaiPrompt;
      })
      .catch(error => {
        console.error("Error:", error);
      });
    };

    // Get image generation
    function getOpenAIImage() {
      // Make a GET request
      fetch("/get_openai_image/", {
        method: "GET",
      })
      .then(response => response.json())
      .then(data => {
        const openaiImage = data.image;
        const openaiPrompt = data.prompt;

        // Set the base64 image as the src of the img tag
        const imgElement = document.getElementById("openai-image-result");
        if (openaiImage != "") {
            imgElement.style.display = 'block';
            imgElement.src = "data:image/png;base64," + openaiImage;
        } else {
            imgElement.style.display = 'none';
        }

        // Update the prompt text
        const promptElement = document.getElementById("openai-image-result-prompt");
        promptElement.innerText = openaiPrompt;
      })
      .catch(error => {
        console.error("Error:", error);
      });
    };
    
    
    function getVoiceNamesJinja() {
        // Get the model-checkboxes element
	const modelCheckboxes = document.querySelector('.model-checkboxes');

	// Get all the model-checkbox-value inputs within the model-checkboxes element
	const modelCheckboxValues = Array.from(modelCheckboxes.querySelectorAll('.model-checkbox-value'));

	// Create a string to store the generated HTML code
	let generatedHTML = '';

	// Iterate over the modelCheckboxValues and extract the value and name attributes
	modelCheckboxValues.forEach((checkbox) => {
	  const value = checkbox.value;
	  const name = checkbox.name;
	  
	  // Create the div element
	  const div = document.createElement('div');

	  // Create the label element
	  const label = document.createElement('label');

	  // Create the input element
	  const input = document.createElement('input');
	  input.className = 'openai-voice-checkboxes';
	  input.style.marginRight = '5pt';
	  input.type = 'checkbox';
	  input.value = value;
	  input.name = name;

	  // Create the text element
	  const text = document.createElement('text');
	  text.style.marginRight = '5pt';
	  text.textContent = value;

	  // Append the input and text elements to the label element
	  div.appendChild(label);
	  label.appendChild(input);
	  label.appendChild(text);

	  // Append the label element's HTML code to the generatedHTML string
	  generatedHTML += div.outerHTML;
	});
	
	return generatedHTML
}
