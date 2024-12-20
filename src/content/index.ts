import { findBasicInputFields } from './detectFields';
import { openFieldConfigurator } from './configurator';
import { validateField } from './validation';
import { generatePlaywrightTests } from './playwrightGenerator';

function updateFieldCountOverlay(count: number) {
    let overlay = document.getElementById('field-count-overlay') as HTMLElement;

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'field-count-overlay';
        overlay.style.position = 'fixed';
        overlay.style.bottom = '10px';
        overlay.style.right = '10px';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.color = 'white';
        overlay.style.padding = '10px';
        overlay.style.borderRadius = '5px';
        overlay.style.zIndex = '10000';
        overlay.style.fontSize = '14px';
        document.body.appendChild(overlay);
    }

    overlay.innerText = `Erkannte Felder: ${count}`;
}

function addTestOutputBox() {
    const outputContainer = document.createElement('div');
    outputContainer.id = 'test-output-container';
    outputContainer.style.position = 'fixed';
    outputContainer.style.bottom = '10px';
    outputContainer.style.left = '10px';
    outputContainer.style.width = '300px';
    outputContainer.style.height = '250px';
    outputContainer.style.backgroundColor = 'white';
    outputContainer.style.border = '1px solid #ddd';
    outputContainer.style.borderRadius = '10px';
    outputContainer.style.padding = '10px';
    outputContainer.style.overflowY = 'auto';
    outputContainer.style.zIndex = '10001';
    outputContainer.style.fontFamily = 'monospace';

    // Box für generierte Tests
    const outputBox = document.createElement('div');
    outputBox.id = 'test-output';
    outputBox.style.height = '200px';
    outputBox.style.overflowY = 'auto';
    outputBox.style.whiteSpace = 'pre-wrap';
    outputBox.style.marginBottom = '10px';
    outputContainer.appendChild(outputBox);

    const copyButton = document.createElement('button');
    copyButton.innerText = 'Tests kopieren';
    copyButton.style.display = 'block';
    copyButton.style.width = '100%';
    copyButton.style.padding = '10px';
    copyButton.style.fontSize = '14px';
    copyButton.style.color = 'white';
    copyButton.style.backgroundColor = '#4CAF50';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '5px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.textAlign = 'center';

    copyButton.addEventListener('click', () => {
        const outputContent = document.getElementById('test-output')?.textContent || '';
        if (outputContent.trim() === '') {
            alert('Keine Tests vorhanden, um sie zu kopieren.');
            return;
        }
        navigator.clipboard.writeText(outputContent)
            .then(() => {
                alert('Tests erfolgreich in die Zwischenablage kopiert!');
            })
            .catch((err) => {
                console.error('Fehler beim Kopieren:', err);
                alert('Fehler beim Kopieren der Tests.');
            });
    });

    outputContainer.appendChild(copyButton);
    document.body.appendChild(outputContainer);
}

window.addEventListener('load', () => {
    const fields = findBasicInputFields();
    fields.forEach((field, index) => {
        field.style.border = "2px solid red";
        const label = document.createElement('span');
        label.innerText = `Feld ${index + 1}`;
        label.style.position = 'absolute';
        label.style.backgroundColor = 'yellow';
        label.style.color = 'black';
        label.style.fontSize = '12px';
        label.style.padding = '2px';
        label.style.border = '1px solid black';
        label.style.borderRadius = '3px';
        label.style.zIndex = '1000';

        const rect = field.getBoundingClientRect();
        label.style.top = `${window.scrollY + rect.top - 20}px`;
        label.style.left = `${window.scrollX + rect.left}px`;

        document.body.appendChild(label);

        field.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            openFieldConfigurator(field);
        });

        field.addEventListener('input', () => validateField(field));
    });

    updateFieldCountOverlay(fields.length);
    addTestOutputBox();  // Testausgabe-Fenster hinzufügen
});
