export const FVCriteriaComparisonMain = {
    name: 'FVCritereaComparisonMain',
    type: 'response',
    match: ({ trace }) => trace.type === 'ext_criteriaComparisonMain' || trace.payload === 'ext_criteriaComparisonMain',

    render: ({ trace, element }) => {
        try {
            const { VFapiKey } = trace.payload;

            if (!VFapiKey) {
                throw new Error("Missing required input variables: VFapiKey");
            }

            const container = document.createElement('div');
            container.className = 'distress-selection';

            container.innerHTML = `
                <h4 class="header-text" style="font-size: 14px; color: #333333;">Compare the Relative Importance of the Criteria:</h4>
                <div id="comparison-container" style="font-size: 14px; color: #333333;">
                    <div id="criteria-display" style="font-size: 14px; color: #333333;">
                        <span id="criteria1-label" class="criteria-label" style="font-size: 14px; color: #333333;">Criteria 1</span>
                        <span id="vs-label" class="vs-text" style="font-size: 14px; color: #2196F3;">vs</span>
                        <span id="criteria2-label" class="criteria-label" style="font-size: 14px; color: #333333;">Criteria 2</span>
                    </div>
                    <div class="slider-container" style="font-size: 14px; color: #333333;">
                        <input type="range" min="-8" max="8" value="0" step="1" id="comparison-slider" style="font-size: 14px;">
                        <div id="scale-labels" style="font-size: 14px; color: #333333;">
                            <div class="scale-label-container" style="font-size: 14px; color: #333333;">
                                <span class="scale-value" style="font-size: 14px; color: #2196F3;">9</span>
                                <span class="scale-description" style="font-size: 14px; color: #333333;">Absolute preference for Criteria 1</span>
                            </div>
                            <div class="scale-label-container" style="font-size: 14px; color: #333333;">
                                <span class="scale-value" style="font-size: 14px; color: #2196F3;">5</span>
                                <span class="scale-description" style="font-size: 14px; color: #333333;">Strong preference for Criteria 1</span>
                            </div>
                            <div class="scale-label-container" style="font-size: 14px; color: #333333;">
                                <span class="scale-value" style="font-size: 14px; color: #2196F3;">1</span>
                                <span class="scale-description" style="font-size: 14px; color: #333333;">Equal preference</span>
                            </div>
                            <div class="scale-label-container" style="font-size: 14px; color: #333333;">
                                <span class="scale-value" style="font-size: 14px; color: #2196F3;">5</span>
                                <span class="scale-description" style="font-size: 14px; color: #333333;">Strong preference for Criteria 2</span>
                            </div>
                            <div class="scale-label-container" style="font-size: 14px; color: #333333;">
                                <span class="scale-value" style="font-size: 14px; color: #2196F3;">9</span>
                                <span class="scale-description" style="font-size: 14px; color: #333333;">Absolute preference for Criteria 2</span>
                            </div>
                        </div>
                    </div>
                    <div id="current-description" style="font-size: 14px; color: #333333;"></div>
                    <div class="button-container" style="font-size: 14px; color: #333333;">
                        <button id="prev-button" style="font-size: 14px; color: white; background-color: #2196F3;" disabled>Previous</button>
                        <button id="next-button" style="font-size: 14px; color: white; background-color: #2196F3;">Next</button>
                    </div>
                    <div id="progress-indicator" style="font-size: 14px; color: #333333;">Question 1 of 10</div>
                </div>
            `;


            const style = document.createElement('style');
            style.textContent = `
              /* Define CSS variables for consistent styling */
              :root {
                  --primary-color: #2196F3;
                  --primary-hover: #1976D2;
                  --disabled-color: #E0E0E0;
                  --text-color: #333333;
                  --border-color: #ddd;
                  --font-family: 'UCity Pro', sans-serif;
                  --border-radius: 4px;
                  --font-size: 14px;
              }

              /* Apply font size to all elements */
              .distress-selection,
              .distress-selection *,
              .header-text,
              #comparison-container,
              #criteria-display,
              .criteria-label,
              .vs-text,
              .slider-container,
              #scale-labels,
              .scale-label-container,
              .scale-value,
              .scale-description,
              #current-description,
              .button-container,
              #next-button,
              #prev-button,
              #progress-indicator {
                  font-size: var(--font-size) !important;
                  font-family: var(--font-family);
              }

              /* Override for buttons to maintain white text */
              #next-button,
              #prev-button {
                  color: white !important;
              }

              .distress-selection {
                  max-width: 90%;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f8f9fa;
                  border-radius: 10px;
                  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                  font-family: 'UCity Pro', sans-serif;
              }

              .header-text {
                  font-family: 'UCity Pro', sans-serif;
                  text-align: center;
                  font-weight: bold;
                  margin-bottom: 15px;
                  color: var(--text-color);
              }

              #comparison-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 15px;
                  color: var(--text-color);
              }

              #criteria-display {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  gap: 10px;
                  font-weight: bold;
              }

              .criteria-label {
                  display: inline-block;
                  writing-mode: horizontal-tb;
                  white-space: wrap;
                  word-wrap: normal;
                  overflow-wrap: normal;
                  text-align: center;
                  font-weight: bold;
                  color: var(--text-color);
                  transition: opacity 0.3s ease;
                  font-family: 'UCity Pro', sans-serif;
              }

              .vs-text {
                  font-weight: bold;
                  color: var(--primary-color);
                  white-space: nowrap;
              }

              .slider-container {
                  width: 80%;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
              }

              #comparison-slider {
                  width: 100%;
                  margin: 15px 0;
              }

              #scale-labels {
                  display: flex;
                  justify-content: space-between;
                  width: 100%;
                  position: relative;
              }

              .scale-label-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  text-align: center;
                  position: relative;
                  cursor: pointer;
              }

              .scale-value {
                  font-weight: bold;
                  color: var(--primary-color);
              }

              .scale-description {
                  display: inline-block;
                  writing-mode: horizontal-tb !important;
                  position: absolute;
                  top: 100%;
                  left: 50%;
                  transform: translateX(-50%);
                  background-color: white;
                  border: 1px solid #ccc;
                  padding: 5px 10px;
                  border-radius: 5px;
                  opacity: 0;
                  transition: opacity 0.3s ease;
                  pointer-events: none;
                  z-index: 10;
                  color: var(--text-color);
              }

              .scale-label-container:hover .scale-description {
                  opacity: 1;
              }

              #current-description {
                  text-align: center;
                  min-height: 20px;
                  margin: 10px 0;
                  color: var(--text-color);
              }

              .button-container {
                  display: flex;
                  gap: 15px;
                  margin-top: 15px;
              }

              /* Navigation buttons layout */
              .button-container {
                  display: flex;
                  justify-content: space-between;
                  width: 100%;
                  max-width: 300px;
                  margin-top: 15px;
              }

              #next-button, #prev-button {
                  padding: 10px 18px;
                  background-color: var(--primary-color);
                  color: white;
                  border: none;
                  border-radius: var(--border-radius);
                  cursor: pointer;
                  transition: background-color 0.3s ease;
                  flex: 1;
              }

              #next-button:hover, #prev-button:hover {
                  background-color: var(--primary-hover);
              }

              #next-button:disabled, #prev-button:disabled {
                  background-color: var(--disabled-color);
                  opacity: 0.5;
                  cursor: not-allowed;
                  color: white;
                  display: block;
              }

              #progress-indicator {
                  margin-top: 10px;
                  color: var(--text-color);
              }
          `;
            container.appendChild(style);
            element.appendChild(container);

            const criteriaPairs = [
                ["Rideability", "User costs"],
                ["Rideability", "Safety"],
                ["Rideability", "Deterioration rate"],
                ["Rideability", "Environmental impact"],
                ["User costs", "Safety"],
                ["User costs", "Deterioration rate"],
                ["User costs", "Environmental impact"],
                ["Safety", "Deterioration rate"],
                ["Safety", "Environmental impact"],
                ["Deterioration rate", "Environmental impact"]
            ];

            let currentComparisonIndex = 0;
            const slider = container.querySelector("#comparison-slider");
            const criteria1Label = container.querySelector("#criteria1-label");
            const criteria2Label = container.querySelector("#criteria2-label");
            const nextButton = container.querySelector("#next-button");
            const prevButton = container.querySelector("#prev-button");
            const currentDescription = container.querySelector("#current-description");
            const progressIndicator = container.querySelector("#progress-indicator");
            const comparisonResults = {};

            // Convert internal value (-8 to 8) to display value (1-9)
            const getDisplayValue = (value) => {
                const absValue = Math.abs(value);
                if (absValue === 0) return 1;
                return absValue + 1;
            };

            function updateProgress() {
                progressIndicator.textContent = `Question ${currentComparisonIndex + 1} of ${criteriaPairs.length}`;
                prevButton.disabled = currentComparisonIndex === 0;
                nextButton.textContent = currentComparisonIndex === criteriaPairs.length - 1 ? "Submit" : "Next";
            }
          
            function displayCurrentComparison() {
                if (currentComparisonIndex < criteriaPairs.length) {
                    const [criteria1, criteria2] = criteriaPairs[currentComparisonIndex];
                    criteria1Label.textContent = criteria1;
                    criteria2Label.textContent = criteria2;
                    
                    // Restore previous value if it exists
                    const savedValue = comparisonResults[`${criteria1}-${criteria2}`];
                    if (savedValue !== undefined) {
                        // Convert display value (1-9) back to internal value (-8 to 8)
                        const internalValue = savedValue === 1 ? 0 : (savedValue - 1) * (slider.value < 0 ? -1 : 1);
                        slider.value = internalValue;
                        currentDescription.textContent = getDescription(internalValue.toString(), criteria1, criteria2);
                    } else {
                        slider.value = 0;
                        currentDescription.textContent = getDescription("0", criteria1, criteria2);
                    }
                    
                    updateProgress();
                }
            }

            const scaleDescriptions = {
                "-8": "Absolute preference (9) for Criteria 1",
                "-7": "Very strong to absolute preference (8) for Criteria 1",
                "-6": "Very strong preference (7) for Criteria 1",
                "-5": "Strong to very strong preference (6) for Criteria 1",
                "-4": "Strong preference (5) for Criteria 1",
                "-3": "Moderate to strong preference (4) for Criteria 1",
                "-2": "Moderate preference (3) for Criteria 1",
                "-1": "Equal to moderate preference (2) for Criteria 1",
                "0": "Equal preference (1)",
                "1": "Equal to moderate preference (2) for Criteria 2",
                "2": "Moderate preference (3) for Criteria 2",
                "3": "Moderate to strong preference (4) for Criteria 2",
                "4": "Strong preference (5) for Criteria 2",
                "5": "Strong to very strong preference (6) for Criteria 2",
                "6": "Very strong preference (7) for Criteria 2",
                "7": "Very strong to absolute preference (8) for Criteria 2",
                "8": "Absolute preference (9) for Criteria 2"
            };

            const getDescription = (value, criteria1, criteria2) => {
                const description = scaleDescriptions[value];
                if (value < 0) {
                    return description.replace('Criteria 1', criteria1);
                } else if (value > 0) {
                    return description.replace('Criteria 2', criteria2);
                }
                return description;
            };

            slider.addEventListener("input", () => {
                const value = slider.value;
                const [criteria1, criteria2] = criteriaPairs[currentComparisonIndex];
                currentDescription.textContent = getDescription(String(value), criteria1, criteria2);

                const scaleLabels = container.querySelectorAll('.scale-value');
                scaleLabels.forEach((label, index) => {
                    if (index === 2) {
                        label.textContent = '1';
                    } else {
                        const position = index < 2 ? -(8 - index * 4) : (index - 2) * 4;
                        label.textContent = getDisplayValue(position);
                    }
                });
            });

            prevButton.addEventListener("click", () => {
                const [criteria1, criteria2] = criteriaPairs[currentComparisonIndex];
                 // convert -8 to 8 range to 1 to 9, while preserving direction.
                comparisonResults[`${criteria1}-${criteria2}`] = parseInt(slider.value) + (slider.value >= 0 ? 1 : -1);
              
                currentComparisonIndex--;
                displayCurrentComparison();
            });

            nextButton.addEventListener("click", () => {
                const [criteria1, criteria2] = criteriaPairs[currentComparisonIndex];
                // convert -8 to 8 range to 1 to 9, while preserving direction.
                comparisonResults[`${criteria1}-${criteria2}`] = parseInt(slider.value) + (slider.value >= 0 ? 1 : -1);
              
                if (currentComparisonIndex === criteriaPairs.length - 1) {
                    console.log("Results:", comparisonResults);
                    window.voiceflow.chat.interact({
                        type: 'complete_critereaComparisonMain',
                        payload: {
                            comparisons: comparisonResults,
                            confirmation: 'Comparisons submitted successfully'
                        }
                    });
                  
                    
                    // Disable the slider and buttons after submit
                    slider.disabled = true;
                    nextButton.disabled = true;
                    prevButton.disabled = true;

                    // Optionally, change the Next button to "Submitted" or similar
                    nextButton.textContent = "Submitted";
                    nextButton.style.backgroundColor = "#E0E0E0";
                  
                  
                } else {
                    currentComparisonIndex++;
                    displayCurrentComparison();
                }
            });
          
            displayCurrentComparison();

            return () => {
                container.remove();
            };

        } catch (error) {
            console.error("Extension Error:", error.message);
        }
    }
};