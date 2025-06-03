export const FVDistressCompare = {
    name: 'FVDistressCompare',
    type: 'response',
    match: ({ trace }) => trace.type === 'ext_distressCompare' || trace.payload === 'ext_distressCompare',

    render: ({ trace, element }) => {
        try {
            const { VFapiKey } = trace.payload;

            if (!VFapiKey) {
                throw new Error("Missing required input variables: VFapiKey");
            }

            const container = document.createElement('div');
            container.className = 'distress-selection';

            container.innerHTML = `
                <h4 style="text-align: center; font-size: 14px; color: #333333; margin-bottom: 15px;">Compare the Relative Importance of Surface and Subsurface Distresses</h4>
                <div id="comparison-container" style="font-size: 14px; color: #333333;">
                    <div id="criteria-display" style="font-size: 14px; color: #333333; margin-bottom: 20px;">
                        <span id="criteria1-label" style="text-align: center; font-size: 14px; color: #333333; font-weight: bold;">Surface Distresses</span>
                        <span id="vs-label" style="text-align: center; font-size: 14px; color: #2196F3; font-weight: bold;">VS</span>
                        <span id="criteria2-label" style="text-align: center; font-size: 14px; color: #333333; font-weight: bold;">Sub-Surface Distresses</span>
                    </div>
                    <div class="slider-container" style="font-size: 14px; color: #333333;">
                        <input type="range" min="-5" max="5" value="0" step="1" id="comparison-slider" style="font-size: 14px;">
                        <div id="scale-labels" style="font-size: 14px; color: #333333;">
                            <div class="scale-label-container" style="font-size: 14px; color: #333333;">
                                <span class="scale-value" style="font-size: 14px; color: #2196F3;">5</span>
                                <span class="scale-description" style="font-size: 14px; color: #333333;">Absolute preference for Surface Distresses</span>
                            </div>
                            <div class="scale-label-container" style="font-size: 14px; color: #333333;">
                                <span class="scale-value" style="font-size: 14px; color: #2196F3;">3</span>
                                <span class="scale-description" style="font-size: 14px; color: #333333;">Strong preference for Surface Distresses</span>
                            </div>
                            <div class="scale-label-container" style="font-size: 14px; color: #333333;">
                                <span class="scale-value" style="font-size: 14px; color: #2196F3;">1</span>
                                <span class="scale-description" style="font-size: 14px; color: #333333;">Equal preference</span>
                            </div>
                            <div class="scale-label-container" style="font-size: 14px; color: #333333;">
                                <span class="scale-value" style="font-size: 14px; color: #2196F3;">3</span>
                                <span class="scale-description" style="font-size: 14px; color: #333333;">Strong preference for Sub-Surface Distresses</span>
                            </div>
                            <div class="scale-label-container" style="font-size: 14px; color: #333333;">
                                <span class="scale-value" style="font-size: 14px; color: #2196F3;">5</span>
                                <span class="scale-description" style="font-size: 14px; color: #333333;">Absolute preference for Sub-Surface Distresses</span>
                            </div>
                        </div>
                    </div>
                    <div id="current-description" style="font-size: 14px; color: #333333;"></div>
                    <button id="submit-button" style="font-size: 14px; color: white; background-color: #2196F3;">Submit Comparison</button>
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
                .distress-selection h4,
                .distress-selection button,
                .distress-selection input,
                .distress-selection span,
                .distress-selection div {
                    font-size: var(--font-size) !important;
                    font-family: var(--font-family);
                }

                /* Button-specific overrides */
                #submit-button {
                    color: white !important;
                }

                .distress-selection {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    font-family: var(--font-family);
                    color: var(--text-color);
                }

                h4 {
                    color: var(--text-color);
                    text-align: center;
                    margin-bottom: 20px;
                    font-weight: 600;
                    font-family: var(--font-family);
                }

                #comparison-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }

                #criteria-display {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    margin-bottom: 15px;
                    font-weight: 600;
                    color: var(--text-color);
                }

                #vs-label {
                    color: var(--primary-color);
                    font-weight: 500;
                    white-space: nowrap;
                }

                .slider-container {
                    width: 100%;
                    position: relative;
                    padding: 0 15px;
                }

                #comparison-slider {
                    width: 100%;
                    margin: 20px 0;
                    height: 8px;
                    -webkit-appearance: none;
                    appearance: none;
                    background: #e0e0e0;
                    border-radius: 4px;
                    outline: none;
                }

                #comparison-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 22px;
                    height: 22px;
                    background: #2196F3;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: background 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    border: 2px solid white;
                }

                #comparison-slider::-moz-range-thumb {
                    width: 22px;
                    height: 22px;
                    background: #2196F3;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: background 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    border: 2px solid white;
                }
                
                #comparison-slider:disabled::-webkit-slider-thumb {
                    background: #E0E0E0;
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                #comparison-slider:disabled::-moz-range-thumb {
                    background: #E0E0E0;
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                #scale-labels {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    position: relative;
                    padding: 10px 0;
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
                    font-weight: 600;
                    color: var(--primary-color);
                    margin-bottom: 5px;
                }

                .scale-description {
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #fff;
                    border: 1px solid #e0e0e0;
                    padding: 8px 12px;
                    border-radius: 6px;
                    white-space: nowrap;
                    opacity: 0;
                    transition: all 0.3s ease;
                    pointer-events: none;
                    z-index: 10;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    color: var(--text-color);
                }

                .scale-label-container:hover .scale-description {
                    opacity: 1;
                    transform: translateX(-50%) translateY(5px);
                }

                #current-description {
                    text-align: center;
                    min-height: 24px;
                    margin: 15px 0;
                    color: var(--text-color);
                    padding: 0 15px;
                }

                #submit-button {
                    padding: 10px 20px;
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    margin-top: 15px;
                    width: 100%;
                    max-width: 300px;
                    border-radius: 4px;
                }

                #submit-button:hover {
                    background-color: var(--primary-hover);
                }

                #submit-button:disabled {
                    background-color: var(--disabled-color);
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `;
            container.appendChild(style);
            element.appendChild(container);

            const slider = container.querySelector("#comparison-slider");
            const currentDescription = container.querySelector("#current-description");
            const submitButton = container.querySelector("#submit-button");
            
            // Set the initial appearance of the slider track to show a visible indicator
            const setSliderIndicator = () => {
                // Add a value indicator beneath the slider
                const scaleValues = container.querySelectorAll('.scale-value');
                scaleValues.forEach(value => {
                    value.style.fontWeight = 'bold';
                    value.style.fontSize = '14px';
                    value.style.color = '#2196F3';
                });
            };
            
            setSliderIndicator();

            const scaleDescriptionsConfig = {
                "-5": "Absolute preference (100%) for Surface Distresses",
                "-4": "Very strong preference (90%) for Surface Distresses",
                "-3": "Strong preference (80%) for Surface Distresses",
                "-2": "Moderate preference (70%) for Surface Distresses",
                "-1": "Slight preference (60%) for Surface Distresses",
                "0": "Equal Preference (50%/50%)",
                "1": "Slight preference (60%) for Sub-Surface Distresses",
                "2": "Moderate preference (70%) for Sub-Surface Distresses",
                "3": "Strong preference (80%) for Sub-Surface Distresses",
                "4": "Very strong preference (90%) for Sub-Surface Distresses",
                "5": "Absolute preference (100%) for Sub-Surface Distresses"
            };

            const getDisplayValue = (internalValue) => {
                const absValue = Math.abs(internalValue);
                return absValue === 0 ? 1 : absValue + 1;
            };

            const updateScaleLabels = () => {
                const scaleLabels = container.querySelectorAll('.scale-value');
                scaleLabels.forEach((label, index) => {
                    const position = index === 2 ? 0 : (index < 2 ? (-(index - 1) * 2 + 2) : (index *2) -4);
                    label.textContent = getDisplayValue(position);
                });
            };

            currentDescription.textContent = scaleDescriptionsConfig[slider.value];
            updateScaleLabels();

            slider.addEventListener("input", () => {
                currentDescription.textContent = scaleDescriptionsConfig[slider.value];
                updateScaleLabels();
            });

            submitButton.addEventListener("click", () => {
                window.voiceflow.chat.interact({
                    type: 'complete_distressCompare',
                    payload: {
                        comparison: slider.value,
                        confirmation: 'Comparison submitted successfully'
                    }
                });
              
                // Disable the submit button and slider after submission
                submitButton.disabled = true;
                slider.disabled = true;

                // Change the submit button text and style
                submitButton.textContent = "Submitted";
                submitButton.style.backgroundColor = "#E0E0E0";
                
                // Change the slider thumb color to match the disabled button
                const sliderThumb = document.styleSheets[0].cssRules;
                for (let i = 0; i < sliderThumb.length; i++) {
                    if (sliderThumb[i].selectorText === '#comparison-slider::-webkit-slider-thumb') {
                        sliderThumb[i].style.backgroundColor = '#E0E0E0';
                    }
                    if (sliderThumb[i].selectorText === '#comparison-slider::-moz-range-thumb') {
                        sliderThumb[i].style.backgroundColor = '#E0E0E0';
                    }
                }
            });

            return () => {
                container.remove();
            };

        } catch (error) {
            console.error("Extension Error:", error.message);
        }
    }
};