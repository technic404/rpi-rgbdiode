const RgbDiode = require("./lib/RgbDiode");

const diode = new RgbDiode({
    r: 5,
    g: 6,
    b: 16
});

(() => {
    diode.setRGB(255, 0, 0);

    setTimeout(() => {
        diode.off();
    }, 1000)
})();