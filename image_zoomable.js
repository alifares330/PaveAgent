export const VFZoomableImage = {
    name: 'VFZoomableImage',
    type: 'response',
    match: ({ trace }) => trace.type === 'ext_zoomableImage' || trace.payload === 'ext_zoomableImage',
    render: ({ trace, element }) => {
        try {
            // Get image URL from payload or use a default
            const imageUrl = trace.payload?.imageUrl || 
                "https://i.imgur.com/placeholder.jpg"; // Replace with actual default image URL if needed
            
            const imageAlt = trace.payload?.imageAlt || "Pavement Distresses";
            const imageTitle = trace.payload?.imageTitle || "Common Pavement Distresses";

            // Create container
            const container = document.createElement('div');
            container.className = 'vf-zoomable-image-container';

            // Add title if provided
            if (imageTitle) {
                const titleElement = document.createElement('h3');
                titleElement.textContent = imageTitle;
                titleElement.className = 'vf-image-title';
                container.appendChild(titleElement);
            }

            // Create image container 
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'vf-image-wrapper';
            
            // Zoom hint
            const zoomHint = document.createElement('div');
            zoomHint.className = 'vf-zoom-hint';
            zoomHint.innerHTML = '<span>Scroll to zoom • Drag to pan</span>';
            
            // Main image
            const image = document.createElement('img');
            image.src = imageUrl;
            image.alt = imageAlt;
            image.className = 'vf-zoomable-image';
            
            // Zoom controls
            const zoomControls = document.createElement('div');
            zoomControls.className = 'vf-zoom-controls';
            
            const zoomInButton = document.createElement('button');
            zoomInButton.className = 'vf-zoom-in';
            zoomInButton.innerHTML = '+';
            
            const zoomOutButton = document.createElement('button');
            zoomOutButton.className = 'vf-zoom-out';
            zoomOutButton.innerHTML = '-';
            
            const zoomResetButton = document.createElement('button');
            zoomResetButton.className = 'vf-zoom-reset';
            zoomResetButton.innerHTML = 'Reset';
            
            // Zoom percentage display
            const zoomPercentage = document.createElement('div');
            zoomPercentage.className = 'vf-zoom-percentage';
            zoomPercentage.textContent = '100%';
            
            zoomControls.appendChild(zoomInButton);
            zoomControls.appendChild(zoomOutButton);
            zoomControls.appendChild(zoomResetButton);
            zoomControls.appendChild(zoomPercentage);
            
            // Assemble the components
            imageWrapper.appendChild(image);
            imageWrapper.appendChild(zoomHint);
            imageWrapper.appendChild(zoomControls);
            
            container.appendChild(imageWrapper);

            // Continue button
            const continueButton = document.createElement('button');
            continueButton.className = 'vf-continue-button';
            continueButton.textContent = 'Continue';
            container.appendChild(continueButton);

            // CSS Styles
            const style = document.createElement('style');
            style.textContent = `
                .vf-zoomable-image-container {
                    position: relative;
                    width: 100%;
                    text-align: center;
                    margin: 15px 0;
                }
                
                .vf-image-title {
                    margin-bottom: 10px;
                    font-size: 1.2rem;
                    color: #333;
                    font-family: 'UCity Pro', sans-serif;
                }
                
                .vf-image-wrapper {
                    position: relative;
                    display: inline-block;
                    margin: 0 auto;
                    width: 100%;
                    max-width: 90%;
                    height: 40vh;  /* <-- Reduced height */
                    overflow: hidden;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    background: #f8f8f8;
                }
                
                .vf-zoom-hint {
                    position: absolute;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.6);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    opacity: 0.8;
                    transition: opacity 0.3s;
                    z-index: 10;
                    pointer-events: none;
                    font-family: 'UCity Pro', sans-serif;
                }
                
                .vf-image-wrapper:hover .vf-zoom-hint {
                    opacity: 1;
                }
                
                .vf-zoom-hint.fade-out {
                    opacity: 0;
                }
                
                .vf-zoomable-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    transform-origin: 0 0;
                    cursor: grab;
                    user-select: none;
                }
                
                .vf-zoomable-image:active {
                    cursor: grabbing;
                }
                
                .vf-zoom-controls {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 8px;
                    background: rgba(0, 0, 0, 0.6);
                    padding: 6px 10px;
                    border-radius: 20px;
                    z-index: 10;
                    align-items: center;
                }
                
                .vf-zoom-controls button {
                    background: white;
                    border: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                    font-family: 'UCity Pro', sans-serif;
                }
                
                .vf-zoom-controls button:hover {
                    background: #e0e0e0;
                }
                
                .vf-zoom-reset {
                    width: auto !important;
                    padding: 0 8px !important;
                    border-radius: 12px !important;
                    font-size: 12px !important;
                }
                
                .vf-zoom-percentage {
                    color: white;
                    font-size: 12px;
                    margin-left: 5px;
                    min-width: 40px;
                    text-align: center;
                    font-family: 'UCity Pro', sans-serif;
                }
                
                .vf-continue-button {
                    margin-top: 15px;
                    padding: 8px 20px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.3s;
                    font-family: 'UCity Pro', sans-serif;
                }
                
                .vf-continue-button:hover {
                    background-color: #0056b3;
                }
                
                /* For a cleaner look on mobile */
                @media (max-width: 768px) {
                    .vf-image-wrapper {
                        height: 50vh;
                    }
                    
                    .vf-zoom-controls {
                        bottom: 5px;
                        padding: 4px 8px;
                    }
                    
                    .vf-zoom-controls button {
                        width: 20px;
                        height: 20px;
                        font-size: 12px;
                        font-family: 'UCity Pro', sans-serif;
                    }
                }
            `;
            
            container.appendChild(style);
            element.appendChild(container);

            // Zoom functionality
            let scale = 1;
            let panning = false;
            let startPoint = { x: 0, y: 0 };
            let currentPoint = { x: 0, y: 0 };
            const MAX_ZOOM = 8;
            const MIN_ZOOM = 0.8;

            // Hide zoom hint after 4 seconds
            setTimeout(() => {
                zoomHint.classList.add('fade-out');
            }, 4000);

            // Update transform
            const setTransform = () => {
                image.style.transform = `translate(${currentPoint.x}px, ${currentPoint.y}px) scale(${scale})`;
            };
            
            // Update zoom percentage display
            const updateZoomPercentage = () => {
                zoomPercentage.textContent = `${Math.round(scale * 100)}%`;
            };

            // Reset zoom function
            const resetZoom = () => {
                scale = 1;
                currentPoint = { x: 0, y: 0 };
                updateZoomPercentage();
                setTransform();
            };

            // Constrain panning to keep image visible
            const constrainPan = () => {
                const wrapper = imageWrapper.getBoundingClientRect();
                const img = image.getBoundingClientRect();
                
                // Calculate the scaled size
                const scaledWidth = wrapper.width * scale;
                const scaledHeight = wrapper.height * scale;
                
                // Constrain X movement
                if (scaledWidth <= wrapper.width) {
                    // If image is smaller than wrapper, center it
                    currentPoint.x = (wrapper.width - scaledWidth) / 2;
                } else {
                    // Otherwise, constrain so at least some image is visible
                    const minX = wrapper.width - scaledWidth;
                    const maxX = 0;
                    currentPoint.x = Math.max(minX, Math.min(maxX, currentPoint.x));
                }
                
                // Constrain Y movement
                if (scaledHeight <= wrapper.height) {
                    // If image is smaller than wrapper, center it
                    currentPoint.y = (wrapper.height - scaledHeight) / 2;
                } else {
                    // Otherwise, constrain so at least some image is visible
                    const minY = wrapper.height - scaledHeight;
                    const maxY = 0;
                    currentPoint.y = Math.max(minY, Math.min(maxY, currentPoint.y));
                }
            };

            // Zoom in button
            zoomInButton.addEventListener('click', () => {
                // Get wrapper dimensions
                const wrapper = imageWrapper.getBoundingClientRect();
                const centerX = wrapper.width / 2;
                const centerY = wrapper.height / 2;
                
                // Calculate current center point
                const currentCenterX = (centerX - currentPoint.x) / scale;
                const currentCenterY = (centerY - currentPoint.y) / scale;
                
                // Change scale
                const prevScale = scale;
                scale = Math.min(scale * 1.2, MAX_ZOOM);
                
                // Adjust position to maintain center
                currentPoint.x = centerX - currentCenterX * scale;
                currentPoint.y = centerY - currentCenterY * scale;
                
                constrainPan();
                updateZoomPercentage();
                setTransform();
            });
            
            // Zoom out button
            zoomOutButton.addEventListener('click', () => {
                // Get wrapper dimensions
                const wrapper = imageWrapper.getBoundingClientRect();
                const centerX = wrapper.width / 2;
                const centerY = wrapper.height / 2;
                
                // Calculate current center point
                const currentCenterX = (centerX - currentPoint.x) / scale;
                const currentCenterY = (centerY - currentPoint.y) / scale;
                
                // Change scale
                const prevScale = scale;
                scale = Math.max(scale / 1.2, MIN_ZOOM);
                
                // Adjust position to maintain center
                currentPoint.x = centerX - currentCenterX * scale;
                currentPoint.y = centerY - currentCenterY * scale;
                
                constrainPan();
                updateZoomPercentage();
                setTransform();
            });
            
            // Reset zoom button
            zoomResetButton.addEventListener('click', resetZoom);

            // Mouse events for panning
            image.addEventListener('mousedown', (e) => {
                e.preventDefault();
                panning = true;
                startPoint = { 
                    x: e.clientX - currentPoint.x, 
                    y: e.clientY - currentPoint.y 
                };
                image.style.cursor = 'grabbing';
            });

            window.addEventListener('mouseup', () => {
                panning = false;
                image.style.cursor = 'grab';
            });

            window.addEventListener('mousemove', (e) => {
                if (!panning) return;
                e.preventDefault();
                
                currentPoint.x = e.clientX - startPoint.x;
                currentPoint.y = e.clientY - startPoint.y;
                
                constrainPan();
                setTransform();
            });

            // Wheel zoom - focused on cursor position
            imageWrapper.addEventListener('wheel', (e) => {
                e.preventDefault();
                
                // Get mouse position relative to wrapper
                const rect = imageWrapper.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                // Calculate point on image under mouse before scaling
                const zoomPosX = (mouseX - currentPoint.x) / scale;
                const zoomPosY = (mouseY - currentPoint.y) / scale;
                
                // Adjust scale with smooth sensitivity
                const wheelSensitivity = 0.1;
                const delta = e.deltaY < 0 ? 1 + wheelSensitivity : 1 / (1 + wheelSensitivity);
                
                // Apply new scale with limits
                const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale * delta));
                
                // Only process if scale changed
                if (newScale !== scale) {
                    scale = newScale;
                    
                    // Adjust position to zoom toward mouse position
                    currentPoint.x = mouseX - zoomPosX * scale;
                    currentPoint.y = mouseY - zoomPosY * scale;
                    
                    constrainPan();
                    updateZoomPercentage();
                    setTransform();
                }
            });

            // Double click to reset zoom
            imageWrapper.addEventListener('dblclick', (e) => {
                e.preventDefault();
                resetZoom();
            });

            // Continue button functionality
            continueButton.addEventListener('click', () => {
                if (window.voiceflow && window.voiceflow.chat && window.voiceflow.chat.interact) {
                    window.voiceflow.chat.interact({
                        type: 'complete',
                        payload: {
                            imageViewed: true
                        }
                    });
                } else {
                    console.error("Voiceflow chat object not available");
                }
            });

            // Touch events for mobile support
            let touchStartScale = 1;
            let initialTouchDistance = 0;
            
            image.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) {
                    initialTouchDistance = getTouchDistance(e.touches);
                    touchStartScale = scale;
                    e.preventDefault(); // Prevent page zoom
                } else if (e.touches.length === 1) {
                    startPoint = { 
                        x: e.touches[0].clientX - currentPoint.x, 
                        y: e.touches[0].clientY - currentPoint.y 
                    };
                    panning = true;
                }
            });

            image.addEventListener('touchmove', (e) => {
                e.preventDefault(); // Prevent page scroll/zoom
                
                if (e.touches.length === 2) {
                    // Pinch zoom
                    const currentDistance = getTouchDistance(e.touches);
                    const pinchRatio = currentDistance / initialTouchDistance;
                    
                    // Get center of pinch
                    const rect = imageWrapper.getBoundingClientRect();
                    const touch1 = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
                    const touch2 = { x: e.touches[1].clientX - rect.left, y: e.touches[1].clientY - rect.top };
                    const pinchCenter = {
                        x: (touch1.x + touch2.x) / 2,
                        y: (touch1.y + touch2.y) / 2
                    };
                    
                    // Calculate point on image under pinch center before scaling
                    const zoomPosX = (pinchCenter.x - currentPoint.x) / scale;
                    const zoomPosY = (pinchCenter.y - currentPoint.y) / scale;
                    
                    // Apply new scale with limits
                    scale = Math.min(Math.max(touchStartScale * pinchRatio, MIN_ZOOM), MAX_ZOOM);
                    
                    // Adjust position to zoom toward pinch center
                    currentPoint.x = pinchCenter.x - zoomPosX * scale;
                    currentPoint.y = pinchCenter.y - zoomPosY * scale;
                    
                    constrainPan();
                    updateZoomPercentage();
                    setTransform();
                    
                } else if (e.touches.length === 1 && panning) {
                    // Pan with one finger
                    currentPoint.x = e.touches[0].clientX - startPoint.x;
                    currentPoint.y = e.touches[0].clientY - startPoint.y;
                    
                    constrainPan();
                    setTransform();
                }
            });

            image.addEventListener('touchend', () => {
                panning = false;
            });

            function getTouchDistance(touches) {
                return Math.hypot(
                    touches[0].clientX - touches[1].clientX,
                    touches[0].clientY - touches[1].clientY
                );
            }

            // Window resize handler
            window.addEventListener('resize', () => {
                constrainPan();
                setTransform();
            });

            // Clean up function
            return () => {
                // Remove event listeners
                zoomInButton.removeEventListener('click', zoomInButton.onclick);
                zoomOutButton.removeEventListener('click', zoomOutButton.onclick);
                zoomResetButton.removeEventListener('click', zoomResetButton.onclick);
                image.removeEventListener('mousedown', image.onmousedown);
                window.removeEventListener('mouseup', window.onmouseup);
                window.removeEventListener('mousemove', window.onmousemove);
                imageWrapper.removeEventListener('wheel', imageWrapper.onwheel);
                imageWrapper.removeEventListener('dblclick', imageWrapper.ondblclick);
                continueButton.removeEventListener('click', continueButton.onclick);
                window.removeEventListener('resize', window.onresize);
                
                // Mobile event listeners
                image.removeEventListener('touchstart', image.ontouchstart);
                image.removeEventListener('touchmove', image.ontouchmove);
                image.removeEventListener('touchend', image.ontouchend);
                
                // Clean up DOM
                container.remove();
            };
        } catch (error) {
            console.error("VFZoomableImage Extension Error:", error.message);
            return () => {};
        }
    }
};