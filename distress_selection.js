export const VFDistressSelectionExtension = {
    name: 'VFDistressSelectionExtension',
    type: 'response',
    match: ({ trace }) => trace.type === 'ext_distressSelection' || trace.payload === 'ext_distressSelection',
    
    render: ({ trace, element }) => {
      try {
        const { VFapiKey } = trace.payload;

        if (!VFapiKey) {
          throw new Error("Missing required input variables: VFapiKey");
        }

        const container = document.createElement('div');
        container.className = 'distress-selection';

        container.innerHTML = `
          <h4 style="font-size: 14px;">Select Pavement Distresses:</h4>
          <form id="distress-form" style="font-size: 14px;">
            <div id="distress-options" style="font-size: 14px;"></div>
            <div id="other-input-container" style="display: none; font-size: 14px;">
              <input type="text" id="other-distress" placeholder="Specify other distress" style="font-size: 14px;">
            </div>
            <button type="submit" id="submit-btn" style="font-size: 14px;">Submit</button>
          </form>
        `;

        const style = document.createElement('style');
        style.textContent = `
            /* Define CSS variables for consistent styling */
            :root {
                --primary-color: #007bff;
                --primary-hover: #0056b3;
                --disabled-color: #808080;
                --text-color: #333;
                --border-color: #ccc;
                --bg-color: #fff;
                --font-family: 'UCity Pro', sans-serif;
                --border-radius: 4px;
                --box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                --font-size: 14px;
            }
            
            /* Apply font size to all elements using a more aggressive approach */
            .distress-selection h4,
            .distress-selection button,
            .distress-selection input,
            .distress-selection span,
            .distress-selection div,
            .distress-selection label,
            #distress-form,
            #distress-options,
            #other-input-container,
            #other-distress,
            #submit-btn,
            .distress-option,
            .distress-option span,
            .distress-option input {
                font-size: 14px !important;
            }

            .distress-selection {
                max-width: 100%;
                margin: 0 auto;
                padding: 20px;
                text-align: left;
                font-family: var(--font-family);
                color: var(--text-color);
            }

            h4 {
                font-family: var(--font-family);
                font-weight: 600;
                color: var(--text-color);
                margin-bottom: 15px;
            }

            #distress-options {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .distress-option {
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: var(--font-family);
            }

            .distress-option input {
                cursor: pointer;
            }

            .distress-option span {
                font-family: var(--font-family);
            }

            #other-input-container {
                margin-top: 10px;
            }

            #other-distress {
                width: 100%;
                padding: 8px;
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                font-family: var(--font-family);
            }

            #submit-btn {
                margin-top: 15px;
                padding: 10px 15px;
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-family: 'UCity Pro', sans-serif;
                text-transform: uppercase;
                font-weight: 500;
                letter-spacing: 0.5px;
                transition: background 0.2s;
                display: block;
                margin-left: auto;
                margin-right: auto;
              }

              #submit-btn:hover {
                  background: #1976D2;
              }

              #submit-btn:disabled {
                  background: #E0E0E0; /* Light gray */
                  color: #757575; /* Darker gray text */
                  cursor: not-allowed;
              }
              
        `;
        container.appendChild(style);

        element.appendChild(container);

        const form = container.querySelector('#distress-form');
        const distressOptions = container.querySelector('#distress-options');
        const otherInputContainer = container.querySelector('#other-input-container');
        const otherDistressInput = container.querySelector('#other-distress');

        const distresses = [
          "Roughness", "Rutting", "Raveling", "Thickness deficiency",
          "Surface cracks", "Subsurface cracks", "Potholes",
          "Skid resistance", "Bleeding", "Other"
        ];

        // Create the checkbox options dynamically
        distresses.forEach(distress => {
          const label = document.createElement('label');
          label.className = 'distress-option';
          label.style.fontSize = '10px';
          label.innerHTML = `
            <input type="checkbox" name="distress" value="${distress}" style="font-size: 14px;">
            <span style="font-size: 14px;">${distress}</span>
          `;
          distressOptions.appendChild(label);
        });

        // Add event listener for 'Other' checkbox
        const otherCheckbox = form.querySelector('input[value="Other"]');
        otherCheckbox.addEventListener('change', () => {
          otherInputContainer.style.display = otherCheckbox.checked ? 'block' : 'none';
        });

        // Submit handler
        form.addEventListener('submit', (event) => {
          event.preventDefault();

          const selectedDistresses = Array.from(form.querySelectorAll('input[name="distress"]:checked'))
            .map(cb => cb.value);
          
          if (selectedDistresses.includes("Other")) {
            const otherValue = otherDistressInput.value.trim();
            if (!otherValue) { // Check for empty or whitespace-only input
                alert('Please specify the other distress.');
                otherDistressInput.focus(); // Set focus back to the input field
                return; // Stop submission
            } else {
                selectedDistresses.push(otherValue); // Add to selected if it's not empty
            }
          }

          if (selectedDistresses.length === 0) {
            alert('Please select at least one distress.');
            return;
          }

          // Disable all checkboxes
          form.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.disabled = true;
          });

          // Disable text input for "Other"
          if (otherDistressInput) {
            otherDistressInput.disabled = true;
          }

          // Disable submit button
          const submitButton = form.querySelector('#submit-btn');
          submitButton.disabled = true;
          submitButton.textContent = 'Submitted';
          submitButton.style.cursor = 'not-allowed';

          // Send data
          window.voiceflow.chat.interact({
            type: 'complete_distressSelection',
            payload: {
              selectedDistresses: selectedDistresses,
              confirmation: 'Work description submitted successfully'
            }
          });
        });

        return () => {
          container.remove();
        };

      } catch (error) {
        console.error("Extension Error:", error.message);
      }
    }
};