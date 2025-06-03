export const VFWorkScope = {
  name: 'VFWorkScope',
  type: 'response',
  match: ({ trace }) => trace.type === 'ext_workScope' || trace.payload === 'ext_workScope',
  
  render: ({ trace, element }) => {
    try {
      const { VFapiKey } = trace.payload;

      if (!VFapiKey) {
        throw new Error("Missing required input variables: VFapiKey");
      }

      const container = document.createElement('div');
      container.className = 'work-selection';

      container.innerHTML = `
        <h4 style="font-size: 14px;">Select Work Scope:</h4>
        <form id="work-form" style="font-size: 14px;">
          <div id="work-options" style="font-size: 14px;"></div>
          <div id="other-input-container" style="display: none; font-size: 14px;">
            <input type="text" id="other-work" placeholder="Specify other work" style="font-size: 14px;">
          </div>
          <button type="submit" id="submit-btn" style="font-size: 14px;">Submit</button>
        </form>
      `;

      const style = document.createElement('style');
      style.textContent = `
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
          
          .work-selection h4,
          .work-selection button,
          .work-selection input,
          .work-selection span,
          .work-selection div,
          .work-selection label {
              font-size: 14px !important;
          }

          .work-selection {
              max-width: 100%;
              margin: 0 auto;
              padding: 20px;
              text-align: left;
              font-family: var(--font-family);
              color: var(--text-color);
          }

          #work-options {
              display: flex;
              flex-direction: column;
              gap: 10px;
          }

          .work-option {
              display: flex;
              align-items: center;
              gap: 10px;
              font-family: var(--font-family);
          }

          #other-input-container {
              margin-top: 10px;
          }

          #other-work {
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
              background: #E0E0E0;
              color: #757575;
              cursor: not-allowed;
          }
      `;
      container.appendChild(style);

      element.appendChild(container);

      const form = container.querySelector('#work-form');
      const workOptions = container.querySelector('#work-options');
      const otherInputContainer = container.querySelector('#other-input-container');
      const otherWorkInput = container.querySelector('#other-work');

      const workScopes = [
        "Pavement condition assessment", "Maintenance planning", "Structural analysis",
        "Material testing", "Data collection", "Project management", "Other"
      ];

      workScopes.forEach(work => {
        const label = document.createElement('label');
        label.className = 'work-option';
        label.innerHTML = `
          <input type="checkbox" name="work" value="${work}" style="font-size: 14px;">
          <span>${work}</span>
        `;
        workOptions.appendChild(label);
      });

      const otherCheckbox = form.querySelector('input[value="Other"]');
      otherCheckbox.addEventListener('change', () => {
        otherInputContainer.style.display = otherCheckbox.checked ? 'block' : 'none';
      });

      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const selectedWorks = Array.from(form.querySelectorAll('input[name="work"]:checked'))
          .map(cb => cb.value);
        
        if (selectedWorks.includes("Other")) {
          const otherValue = otherWorkInput.value.trim();
          if (!otherValue) {
              alert('Please specify the other work scope.');
              otherWorkInput.focus();
              return;
          } else {
              selectedWorks.push(otherValue);
          }
        }

        if (selectedWorks.length === 0) {
          alert('Please select at least one work scope.');
          return;
        }

        form.querySelectorAll('input[type="checkbox"]').forEach(input => {
          input.disabled = true;
        });

        if (otherWorkInput) {
          otherWorkInput.disabled = true;
        }

        const submitButton = form.querySelector('#submit-btn');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitted';
        submitButton.style.cursor = 'not-allowed';

        window.voiceflow.chat.interact({
          type: 'complete_workScope',
          payload: {
            selectedWorks: selectedWorks,
            confirmation: 'Work scope submitted successfully'
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
