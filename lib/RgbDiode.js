var Pgpio = require("pigpio").Gpio;

/**
 * @typedef {{ r: number, g: number, b: number }} Pins
 */

class RgbDiode {
    /**
     * @type {Leds}
     */
    #leds;

    /**
     * 
     * @returns {Leds}
     */
    #getLeds = (pins) => {
        const obj = {};

        for(const [k, v] of Object.entries(pins)) {
            obj[k] = new Pgpio(v, { mode: Pgpio.OUTPUT});
        }

        return obj;
    }

    #sleep = async (ms) => {
        return await new Promise((res) => setTimeout(() => res(), ms))
    }

    /**
     * 
     * @param {{ r: number, g: number, b: number }} pins 
     */
    constructor(pins) {
        this.#leds = this.#getLeds(pins);
    }

    /**
     * Sets color of the diode in rgb formats
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     */
    setRGB(r, g, b) {
        this.#leds.r.analogWrite(r);
        this.#leds.g.analogWrite(g);
        this.#leds.b.analogWrite(b);
    }

    /**
     * Disabled the diode (sends 0, 0, 0 signal)
     */
    off() {
        this.setRGB(0, 0, 0);
    }

    /**
     * Animates the provided colors with selected timeout
     * @param {{ r: number, g: number, b: number }[]} rgbs 
     * @param {number} timeout in ms
     */
    async animateRGB(rgbs, timeout = 10) {
        for(const rgb of rgbs) {
            this.setRGB(rgb.r, rgb.g, rgb.b);

            await this.#sleep(timeout);
        }
    }

    /**
     * Animates the provided colors in loop with selected timeout
     * @param {{ r: number, g: number, b: number }[]} rgbs 
     * @param {number} timeout in ms
     */
    async loop(rgbs, timeout = 10) {
        for(let i = 0; i < rgbs.length; i++) {
            const rgb = rgbs[i];

            this.setRGB(rgb.r, rgb.g, rgb.b);

            await this.#sleep(timeout);

            if(i + 1 === rgbs.length) {
                this.loop(rgbs, timeout);
            }
        }
    }
}

module.exports = RgbDiode;