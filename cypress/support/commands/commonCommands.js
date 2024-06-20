import 'cypress-file-upload';

Cypress.Commands.add('selectDropdownOption', (dropdownName, optionText) => {
    cy.get(`input[placeholder="${dropdownName}"]`).click();
    cy.get('.MuiAutocomplete-listbox li').contains(optionText).click();
});


function base64ToBlob(base64, type) {
    const binary = atob(base64);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type });
}

Cypress.Commands.add('uploadAndSavePhoto', (fileName) => {
    // Убедитесь, что элемент input[type="file"] существует
    cy.get('input#button-file-service').should('exist');

    // Использование команды для загрузки файла
    cy.readFile(`cypress/fixtures/${fileName}`, 'base64').then(fileContent => {
        const mimeType = `image/${fileName.split('.').pop()}`;
        const blob = base64ToBlob(fileContent, mimeType);
        const file = new File([blob], fileName, { type: mimeType });
        cy.wait(2000);
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        cy.wait(2000);
        cy.window().then(win => {
            const input = win.document.getElementById('button-file-service');
            if (input) {
                const fileList = [file];
                const changeEvent = new Event('change', { bubbles: true });

                Object.defineProperty(input, 'files', {
                    value: fileList,
                    writable: false,
                });
                cy.wait(2000);
                input.dispatchEvent(changeEvent);
                cy.wait(2000);
                // Проверка, что файл был успешно загружен в элемент input
                const files = input.files;
                cy.log(`Number of files after upload: ${files.length}`);
                if (files.length > 0) {
                    cy.log(`Uploaded file name: ${files[0].name}`);
                    cy.log(`Uploaded file type: ${files[0].type}`);
                    cy.log(`Uploaded file size: ${files[0].size}`);
                    cy.log(`Uploaded file: files[0]`, JSON.stringify(files[0]));
                    expect(files[0].name).to.equal(fileName);
                    expect(files[0].type).to.equal(mimeType);
                } else {
                    cy.log('No files were uploaded.');
                }
            } else {
                throw new Error('Input element not found');
            }
        });
    });

    // Ожидание появления загруженного изображения перед сохранением
    cy.get('.reactEasyCrop_Image')
        .should('have.attr', 'src')
    cy.get('button').contains('Зберегти зміни').click({force: true});
    // Использование cy.window() для обращения к кнопке и выполнения клика
    cy.window().then(win => {
        const saveButton = Array.from(win.document.querySelectorAll('button'))
            .find(button => button.textContent.includes('Зберегти зміни'));
        if (saveButton) {
            cy.log('Found save button');
            saveButton.click();
            cy.log('Clicked save button through DOM');
        } else {
            throw new Error('Save button not found');
        }
    });

    // Дополнительная проверка после сохранения
    cy.window().then(win => {
        const input = win.document.getElementById('button-file-service');
        if (input) {
            const files = input.files;
            cy.log(`Number of files after save: ${files.length}`);
            if (files.length > 0) {
                cy.log(`File name after save: ${files[0].name}`);
                cy.log(`File type after save: ${files[0].type}`);
                cy.log(`File size after save: ${files[0].size}`);
            } else {
                cy.log('No files were saved.');
            }
        }
    });
});
