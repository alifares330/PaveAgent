export const FVRateDistress = {
    name: 'FVRateDistress',
    type: 'response',
    match: ({ trace }) => trace.type === 'ext_rateDistress' || trace.payload === 'ext_rateDistress',

    render: ({ trace, element }) => {
        const CRITERIA = [
            "Rideability", "User costs", "Safety", "Deterioration rate", "Environmental impact"
        ];

        const RATING_LABELS = [
            "[1] Negligible", "[2] Marginal", "[3] Minor", "[4] Moderate", "[5] Notable",
            "[6] Substantial", "[7] High", "[8] Severe", "[9] Critical", "[10] Absolute"
        ];

        const state = {
            currentPage: 0,
            itemsPerPage: 3,
            currentCriterionIndex: 0,
            ratings: {},
        };

        try {
            const { VFapiKey, IDdistress } = trace.payload;

            if (!VFapiKey || !IDdistress) {
                throw new Error("Missing required input variables: VFapiKey or IDdistress");
            }

            const container = document.createElement('div');
            container.className = 'distress-selection';
            container.style.fontSize = '14px';
            container.style.color = '#333333';

            container.innerHTML = `
                <h4 style="font-size: 14px; color: #333333;">Rate the Impact of ${IDdistress} on:</h4>
                <div class="carousel-container" style="font-size: 14px; color: #333333;">
                    <div id="criteria-carousel" class="carousel" style="font-size: 14px; color: #333333;">
                        <div class="carousel-track" style="font-size: 14px; color: #333333;"></div>
                    </div>
                    <div class="carousel-navigation" style="font-size: 14px; color: #333333;">
                        <div class="nav-container" style="font-size: 14px; color: #333333;">
                            <div class="button-group" style="font-size: 14px; color: #333333; display: flex; flex-direction: column; width: 100%;">
                                <div class="nav-buttons" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <button id="prev-btn" style="font-size: 14px; color: white; flex: 1; margin-right: 5px;" disabled>&#8592; Previous</button>
                                    <button id="next-btn" style="font-size: 14px; color: white; flex: 1; margin-left: 5px;">Next &#8594;</button>
                                </div>
                                <button id="submit-btn" style="font-size: 14px; color: white;">Submit</button>
                            </div>
                        </div>
                        <div class="page-indicator" style="font-size: 14px; color: #333333; text-align: center; margin-top: 5px;">
                          Criterion <span id="current-page" style="font-size: 14px; color: #333333;">1</span> of <span id="total-pages" style="font-size: 14px; color: #333333;">5</span>
                        </div>
                    </div>
                </div>
            `;

            // Add styles with CSS variables for consistency
            const style = document.createElement('style');
            style.textContent = `
                /* Define CSS variables for consistent styling */
                :root {
                    --primary-color: #2196F3;
                    --primary-hover: #1976D2;
                    --disabled-color: #E0E0E0;
                    --text-color: #333333;
                    --border-color: #ccc;
                    --bg-color: #fff;
                    --selected-bg: #007bff;
                    --selected-text: #fff;
                    --font-family: 'UCity Pro', sans-serif;
                    --border-radius: 4px;
                    --box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    --font-size: 14px;
                }

                /* Apply font size to all elements using a more aggressive approach */
                .distress-selection *,
                .distress-selection h4,
                .distress-selection button,
                .distress-selection input,
                .distress-selection span,
                .distress-selection div,
                .distress-selection label,
                .carousel-container,
                .carousel,
                .carousel-track,
                .carousel-item,
                .carousel-navigation,
                .nav-container,
                .button-group,
                .page-indicator,
                .rating-buttons,
                .item-title,
                .error-message {
                    font-size: 14px !important;
                    color: var(--text-color) !important;
                }

                /* Override for navigation buttons to maintain white text */
                .button-group button,
                #prev-btn,
                #next-btn,
                #submit-btn {
                    color: white !important;
                    background-color: #2196F3 !important;
                }
                
                /* Override for selected rating buttons */
                .rating-buttons button.selected {
                    background-color: #007bff !important;
                    color: white !important;
                }
                
                /* Hover styles for buttons */
                .button-group button:hover:not(:disabled),
                #prev-btn:hover:not(:disabled),
                #next-btn:hover:not(:disabled),
                #submit-btn:hover:not(:disabled) {
                    background-color: #1976D2 !important;
                }
                
                /* Normal state for rating buttons */
                .rating-buttons button {
                    background-color: white !important;
                    color: #333333 !important;
                }
                
                /* Hover state for rating buttons */
                .rating-buttons button:hover:not(.selected) {
                    background-color: #f0f0f0 !important;
                }

                .distress-selection {
                    max-width: 100%;
                    margin: 0 auto;
                    padding: 5px;
                    text-align: left;
                    color: var(--text-color);
                    font-family: var(--font-family);
                    font-size: 14px;
                }

                h4 {
                    font-family: var(--font-family);
                    font-weight: 600;
                    color: var(--text-color);
                    margin-bottom: 15px;
                    font-size: 14px;
                }

                .carousel-container {
                    display: flex;
                    flex-direction: column;
                    max-width: 100%;
                    overflow: hidden;
                    font-size: 14px;
                }

                .carousel {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    font-size: 14px;
                }

                .carousel-track {
                    display: grid;
                    gap: 20px;
                    transition: transform 0.3s ease-in-out;
                    font-size: 14px;
                }

                .carousel-item {
                    width: 100%;
                    min-width: 150px;
                    display: flex;
                    flex-direction: column;
                    padding: 5px;
                    margin: 0;
                    background: var(--bg-color);
                    color: var(--text-color);
                    font-size: 14px;
                }

                .carousel-navigation {
                    width: 100%;
                    margin-top: 15px;
                    padding: 10px 0;
                    font-size: 14px;
                }

                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 100%;
                    margin: 0 auto;
                    font-size: 14px;
                }

                .button-group {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    width: 100%;
                    flex-wrap: wrap;
                    font-size: 14px;
                }

                .page-indicator {
                    width: 100%;
                    text-align: center;
                    color: var(--text-color);
                    margin-top: 5px;
                    font-family: var(--font-family);
                    font-size: 14px;
                }

                .button-group button {
                    flex: 1;
                    min-width: 100px;
                    padding: 8px 16px;
                    border: none;
                    border-radius: var(--border-radius);
                    background: var(--primary-color);
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-family: var(--font-family);
                    font-size: 14px;
                }

                .button-group button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    background-color: var(--disabled-color) !important;
                    display: inline-block !important; /* Ensure disabled buttons still display */
                }

                .button-group button:hover:not(:disabled) {
                    background: var(--primary-hover);
                    font-size: 14px;
                }

                #submit-btn {
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    font-size: 14px;
                }

                #submit-btn:hover:not(:disabled) {
                    background: var(--primary-hover);
                    font-size: 14px;
                }
                
                /* Navigation buttons layout */
                .nav-buttons {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    margin-bottom: 10px;
                }
                
                .nav-buttons button {
                    flex: 1;
                }
                
                .nav-buttons button:first-child {
                    margin-right: 5px;
                }
                
                .nav-buttons button:last-child {
                    margin-left: 5px;
                }

                /* Ensure disabled state is properly styled but still visible */
                .button-group button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    color: white !important;
                    display: block !important; /* Ensure disabled buttons still display */
                }

                .rating-buttons {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 5px;
                    font-size: 14px;
                    width: 100%;
                }

                .rating-buttons button {
                    padding: 8px;
                    text-align: left;
                    border: 1px solid #e0e0e0;
                    border-radius: var(--border-radius);
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: var(--text-color);
                    font-family: var(--font-family);
                    font-size: 14px;
                }

                .rating-buttons button:hover {
                    background-color: #f5f5f5;
                }
                
                .rating-buttons button.selected {
                    background-color: #2196F3;
                    color: white;
                    border-color: #2196F3;
                }

                .item-title {
                    margin-top: 5px;
                    margin-bottom: 5px;
                    font-weight: bold;
                    text-align: center;
                    color: var(--text-color);
                    font-family: var(--font-family);
                    font-size: 14px;
                }

                .error-message {
                    background-color: #fee2e2;
                    border: 1px solid #ef4444;
                    color: #991b1b;
                    padding: 12px;
                    border-radius: var(--border-radius);
                    margin-bottom: 16px;
                    display: none;
                    font-family: var(--font-family);
                    font-size: 14px;
                }
            `;

            container.appendChild(style);
            element.appendChild(container);

            const carouselTrack = container.querySelector('.carousel-track');
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.style.fontSize = '14px';
            errorMessage.style.color = '#991b1b';
            container.insertBefore(errorMessage, container.firstChild);

            function createCarouselItems() {
                carouselTrack.innerHTML = '';
                CRITERIA.forEach((criterion) => {
                    const item = document.createElement('div');
                    item.className = 'carousel-item';
                    item.style.display = 'none';
                    item.style.fontSize = '14px';
                    item.style.color = '#333333';

                    item.innerHTML = `
                         <h4 class="item-title" style="font-size: 14px; color: #333333; text-align: center;">${criterion}</h4>
                        <div class="rating-buttons" style="font-size: 14px; color: #333333;">
                            ${RATING_LABELS.map((label, i) => `
                                <button data-criterion="${criterion}" data-value="${i + 1}" style="font-size: 14px;">
                                    <span style="color: #007bff; font-weight: bold;">[${i + 1}]</span> ${label.split("]")[1]}
                                </button>
                            `).join('')}
                        </div>
                    `;
                    carouselTrack.appendChild(item);
                });
            }

            function updateLayout() {
                const containerWidth = container.clientWidth;
                const minItemWidth = 150;
                const gap = 20;
                const maxItemsThatFit = Math.floor((containerWidth + gap) / (minItemWidth + gap));
                state.itemsPerPage = 1;
                carouselTrack.style.gridTemplateColumns = `repeat(${state.itemsPerPage}, 1fr)`;
                const totalPages = Math.ceil(CRITERIA.length / state.itemsPerPage);
                state.currentPage = Math.min(state.currentPage, totalPages - 1);
                return totalPages;
            }

            function updateCarousel() {
                const totalPages = updateLayout();
                const items = carouselTrack.querySelectorAll('.carousel-item');
                const startIndex = state.currentPage * state.itemsPerPage;
                const endIndex = startIndex + state.itemsPerPage;

                items.forEach((item, index) => {
                    item.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
                });

                const prevBtn = container.querySelector('#prev-btn');
                const nextBtn = container.querySelector('#next-btn');
                const currentPageSpan = container.querySelector('#current-page');
                const totalPagesSpan = container.querySelector('#total-pages');

                prevBtn.disabled = state.currentPage === 0;
                nextBtn.disabled = state.currentPage >= totalPages - 1;
                currentPageSpan.textContent = state.currentPage + 1;
                totalPagesSpan.textContent = totalPages;
            }

            function handleRatingClick(event) {
                if (event.target.tagName === 'BUTTON' && event.target.dataset.criterion) {
                    const criterion = event.target.dataset.criterion;
                    const value = parseInt(event.target.dataset.value);
                    state.ratings[criterion] = value;

                    const buttons = event.target.parentNode.querySelectorAll('button');
                    buttons.forEach(btn => {
                        btn.classList.remove('selected');
                    });
                    event.target.classList.add('selected');
                    errorMessage.style.display = 'none';
                  
                    console.log("Current Ratings:", state.ratings);
                }
            }

            function handleSubmit() {
                if (Object.keys(state.ratings).length !== CRITERIA.length) {
                    errorMessage.textContent = 'Please rate all criteria before submitting.';
                    errorMessage.style.display = 'block';
                    return;
                }

                window.voiceflow.chat.interact({
                    type: `complete_${IDdistress}`,
                    payload: {
                        ratings: state.ratings,
                        confirmation: 'Ratings submitted successfully',
                    }
                });
              
                // Disable all buttons after successful submission
                const allButtons = container.querySelectorAll('button');
                allButtons.forEach(button => {
                    button.disabled = true;
                    if (button.id === 'submit-btn') {
                        button.textContent = "Submitted";
                        button.style.backgroundColor = "var(--disabled-color)";
                    }
                });

                // Hide error message if submission is successful
                errorMessage.style.display = 'none';

                state.currentCriterionIndex;

                if (state.currentCriterionIndex < CRITERIA.length) {
                    const nextCriterion = CRITERIA[state.currentCriterionIndex];
                    const nextCriterionItemIndex = CRITERIA.indexOf(nextCriterion);
                    state.currentPage = Math.floor(nextCriterionItemIndex / state.itemsPerPage);

                    updateCarousel();
                }
            }

            carouselTrack.addEventListener('click', handleRatingClick);

            container.querySelector('#prev-btn').addEventListener('click', () => {
                if (state.currentPage > 0) {
                    state.currentPage--;
                    updateCarousel();
                }
            });

            container.querySelector('#next-btn').addEventListener('click', () => {
                const totalPages = Math.ceil(CRITERIA.length / state.itemsPerPage);
                if (state.currentPage < totalPages - 1) {
                    state.currentPage++;
                    updateCarousel();
                }
            });

            container.querySelector('#submit-btn').addEventListener('click', handleSubmit);

            createCarouselItems();
            updateCarousel();

            const resizeObserver = new ResizeObserver(() => {
                updateCarousel();
            });
            resizeObserver.observe(container);

            return () => {
                resizeObserver.disconnect();
                container.remove();
            };

        } catch (error) {
            console.error("Extension Error:", error.message);
            return () => element.remove();
        }
    }
};