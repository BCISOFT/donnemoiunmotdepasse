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

function generate() {
    const withNumeric = ($("#with_numeric").prop("checked"));
    const withUppercase = ($("#with_uppercase").prop("checked"));
    const withLowercase = ($("#with_lowercase").prop("checked"));
    const withSpecialCharacters = ($("#with_special_characters").prop("checked"));
    const withoutSimilarCharacters = ($("#without_similar_characters").prop("checked"));
    const qwertyCompliance = ($("#qwerty_compliance").prop("checked"));
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

    let password = ""
    for (let i = 0; i < passLength; i++) {
        password += map.charAt(Math.floor(Math.random() * map.length));
    }

    $("#password").val(password);
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
        console.log({"message": "Fallback: Could not copy text", "error": err});
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
    setTimeout(generate,500);

    $("#qwerty_compliance").change(() => {
        if ($("#qwerty_compliance").prop("checked") === true) {
            $("#with_special_characters").prop( "checked", false );
        }
    });

    $("#with_special_characters").change(() => {
        if ($("#with_special_characters").prop("checked") === true) {
            $("#qwerty_compliance").prop( "checked", false );
        }
    });

    $("#generate").click(() => {
        generate()
    })

    $("#cpy-password").click(() => {
        copyToClipboard($("#password").val());
    });
});