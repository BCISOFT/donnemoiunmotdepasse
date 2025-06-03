function getMaps() {
    return {
        "numeric": "0123456789",
        "uppercase": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "lowercase": "abcdefghijklmnopqrstuvwxyz",
        "specialCharacters": "!@$%^&()_-=+,|~",
        "similarCharacters": "ilI1Oo0",
        "qwertyCompliance": "eErRtTyYuUiIoOpPsSdDfFgGhHjJkKlLxXcCvVbBnN1234567890"
    };
}

function getRandomChar(str) {
    return str.charAt(Math.floor(Math.random() * str.length));
}

function isSwitchOn(id) {
    const button = document.getElementById(id);
    return button.getAttribute('data-state') === 'on';
}

function generate() {
    const withNumeric = isSwitchOn('with_numeric');
    const withUppercase = isSwitchOn('with_uppercase');
    const withLowercase = isSwitchOn('with_lowercase');
    const withSpecialCharacters = isSwitchOn('with_special_characters');
    const withoutSimilarCharacters = isSwitchOn('without_similar_characters');
    const qwertyCompliance = isSwitchOn('qwerty_compliance');
    const passLength = $("#pass_length").val();

    const maps = getMaps();
    let map = "";
    if (withNumeric) map += maps['numeric'];
    if (withUppercase) map += maps['uppercase'];
    if (withLowercase) map += maps['lowercase'];
    if (withSpecialCharacters) map += maps['specialCharacters'];
    if (qwertyCompliance) map = maps['qwertyCompliance'];
    if (withoutSimilarCharacters) {
        for (var i = 0; i < maps['similarCharacters'].length; i++) {
            map = map.replace(maps['similarCharacters'].charAt(i), '');
        }
    }

    let password = "";
    let coloredPassword = "";
    
    // Calculer le nombre minimum de chaque type de caractère
    const minNumeric = withNumeric ? Math.max(2, Math.floor(passLength * 0.25)) : 0;
    const minUppercase = withUppercase ? Math.max(1, Math.floor(passLength * 0.25)) : 0;
    const minLowercase = withLowercase ? Math.max(1, Math.floor(passLength * 0.25)) : 0;
    const minSpecial = withSpecialCharacters ? Math.max(1, Math.floor(passLength * 0.25)) : 0;

    // Ajouter les caractères minimum requis
    for (let i = 0; i < minNumeric; i++) {
        const char = getRandomChar(maps['numeric']);
        password += char;
        coloredPassword += `<span style="color: rgb(255 94 61);">${char}</span>`;
    }
    for (let i = 0; i < minUppercase; i++) {
        const char = getRandomChar(maps['uppercase']);
        password += char;
        coloredPassword += `<span style="color: #000000;">${char}</span>`;
    }
    for (let i = 0; i < minLowercase; i++) {
        const char = getRandomChar(maps['lowercase']);
        password += char;
        coloredPassword += `<span style="color: #000000;">${char}</span>`;
    }
    for (let i = 0; i < minSpecial; i++) {
        const char = getRandomChar(maps['specialCharacters']);
        password += char;
        coloredPassword += `<span style="color: rgb(59 102 188);">${char}</span>`;
    }

    // Compléter le reste du mot de passe
    while (password.length < passLength) {
        const char = getRandomChar(map);
        password += char;
        
        if (maps['numeric'].includes(char)) {
            coloredPassword += `<span style="color: rgb(255 94 61);">${char}</span>`;
        } else if (maps['uppercase'].includes(char) || maps['lowercase'].includes(char)) {
            coloredPassword += `<span style="color: #000000;">${char}</span>`;
        } else if (maps['specialCharacters'].includes(char)) {
            coloredPassword += `<span style="color: rgb(59 102 188);">${char}</span>`;
        } else {
            coloredPassword += char;
        }
    }

    // Mélanger le mot de passe
    const passwordArray = password.split('');
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }
    password = passwordArray.join('');

    // Reconstruire le mot de passe coloré avec les caractères mélangés
    coloredPassword = "";
    for (let i = 0; i < password.length; i++) {
        const char = password[i];
        if (maps['numeric'].includes(char)) {
            coloredPassword += `<span style="color: rgb(255 94 61);">${char}</span>`;
        } else if (maps['uppercase'].includes(char) || maps['lowercase'].includes(char)) {
            coloredPassword += `<span style="color: #000000;">${char}</span>`;
        } else if (maps['specialCharacters'].includes(char)) {
            coloredPassword += `<span style="color: rgb(59 102 188);">${char}</span>`;
        } else {
            coloredPassword += char;
        }
    }

    $("#password").html(coloredPassword);
    $("#password").attr("data-password", password);
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
    } catch (err) {
        console.log({ "message": "Fallback: Could not copy text", "error": err });
    }

    document.body.removeChild(textArea);
}

function copyToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text);
}

$(document).ready(() => {
    // Générer un mot de passe initial
    generate();

    // Gestion du slider de longueur
    const lengthSlider = document.getElementById('pass_length');
    const sliderValue = document.querySelector('.slider-value');

    lengthSlider.addEventListener('input', function() {
        sliderValue.textContent = this.value;
        generate();
    });

    // Gestion des switches
    document.querySelectorAll('.switch-btn').forEach(button => {
        const label = document.querySelector(`label[for="${button.id}"]`);
        
        button.addEventListener('click', function() {
            if (this.classList.contains('disabled')) {
                return;
            }

            const currentState = this.getAttribute('data-state');
            const newState = currentState === 'on' ? 'off' : 'on';
            this.setAttribute('data-state', newState);

            // Gestion des dépendances entre switches
            if (this.id === 'qwerty_compliance') {
                const specialCharsSwitch = document.getElementById('with_special_characters');
                const specialCharsLabel = document.querySelector(`label[for="with_special_characters"]`);
                if (newState === 'on') {
                    specialCharsSwitch.setAttribute('data-state', 'off');
                    specialCharsSwitch.classList.add('disabled');
                    specialCharsLabel.classList.add('disabled');
                } else {
                    specialCharsSwitch.classList.remove('disabled');
                    specialCharsLabel.classList.remove('disabled');
                }
            }

            if (this.id === 'with_special_characters') {
                const qwertySwitch = document.getElementById('qwerty_compliance');
                const qwertyLabel = document.querySelector(`label[for="qwerty_compliance"]`);
                if (newState === 'on') {
                    qwertySwitch.setAttribute('data-state', 'off');
                    qwertySwitch.classList.add('disabled');
                    qwertyLabel.classList.add('disabled');
                } else {
                    qwertySwitch.classList.remove('disabled');
                    qwertyLabel.classList.remove('disabled');
                }
            }

            generate();
        });
    });

    $("#cpy-password").click(() => {
        copyToClipboard($("#password").attr("data-password"));
        $('#password-copied').show().fadeOut(5000);
    });

    // Gestionnaire pour le bouton de génération
    document.getElementById('generate-password').addEventListener('click', function() {
        generate();
    });
});