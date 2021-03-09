import AudioBoard from '../AudioBoard.js';
import {loadJSON} from '../loaders.js';

export function loadAudioBoard(name, audioContext) {
    const loadAudio = createAudioLoader(audioContext);
    return loadJSON(`./assets/sounds/${name}.json`)
        .then(audioSheet => {
            const audioBoard = new AudioBoard();
            const fx = audioSheet.fx;
            return Promise.all(Object.keys(fx).map(name => {

                return loadAudio(fx[name].url)
                    .then(buffer => {
                        audioBoard.addAudio(name, buffer);
                    });
            }))
            .then(() => {
                return audioBoard;
            });
        });
}

export function createAudioLoader(context) {
    return function loadAudio(url) {
        return fetch(url)
           .then(response => {
                return response.arrayBuffer();
            })
            .then(arrayBuffer => {
                console.log({arrayBuffer}, context)
                return context.decodeAudioData(arrayBuffer, (buffer) => {
                                // resolve(buffer);
                       }, (e) => {
                        // console.log(e);
                      });
            });
    }
}
