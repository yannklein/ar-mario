import Level from './Level.js';
import Timer from './Timer.js';
import {createLevelLoader} from './loaders/level.js';
import {loadFont} from './loaders/font.js';
import {loadEntities} from './entities.js';
import {makePlayer, createPlayerEnv, findPlayers} from './player.js';
import {setupKeyboard} from './input.js';
import {createColorLayer} from './layers/color.js';
import {createTextLayer} from './layers/text.js';
import {createCollisionLayer} from './layers/collision.js';
import {createDashboardLayer} from './layers/dashboard.js';
import { createPlayerProgressLayer } from './layers/player-progress.js';
import SceneRunner from './SceneRunner.js';
import Scene from './Scene.js';
import TimedScene from './TimedScene.js';

async function main(videoContext) {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();

    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext),
        loadFont(),
    ]);


    const loadLevel = await createLevelLoader(entityFactory);

    const sceneRunner = new SceneRunner();

    const mario = entityFactory.mario();
    makePlayer(mario, "MARIO");
    window.mario = mario;

    const inputRouter = setupKeyboard(window);
    inputRouter.addReceiver(mario);

    async function runLevel(name) {

        // Disable loadling screen
        // const loadScreen = new Scene();
        // loadScreen.comp.layers.push(createColorLayer('#000'));
        // loadScreen.comp.layers.push(createTextLayer(font, `Loading ${name}...`));
        // sceneRunner.addScene(loadScreen);
        // sceneRunner.runNext();

        const level = await loadLevel(name);

        level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches) => {
            if (spec.type === "goto") {
                for (const _ of findPlayers(touches)) {
                    runLevel(spec.name);
                    return;
                }
            }
        });

        // const playerProgressLayer = createPlayerProgressLayer(font, level);
        // const dashboardLayer = createDashboardLayer(font, level);

        mario.pos.set(0, 0);
        level.entities.add(mario);

        const playerEnv = createPlayerEnv(mario);
        level.entities.add(playerEnv);

        // Disable start screen
        // const waitScreen = new TimedScene();
        // waitScreen.countDown = 2;
        // // waitScreen.comp.layers.push(createColorLayer('#000'));
        // waitScreen.comp.layers.push(dashboardLayer);
        // waitScreen.comp.layers.push(playerProgressLayer);
        // sceneRunner.addScene(waitScreen);

        // Don't display collision bounding boxes
        // level.comp.layers.push(createCollisionLayer(level));
        // level.comp.layers.push(dashboardLayer);
        sceneRunner.addScene(level);

        sceneRunner.runNext();
    }

    const gameContext = {
        audioContext,
        videoContext,
        entityFactory,
        deltaTime: null,
    };

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        gameContext.deltaTime = deltaTime;
        sceneRunner.update(gameContext);
    }

    timer.start();

    runLevel('1-1');
}

const startMario = (canvas) => {
  document.querySelector("canvas").addEventListener('click', () => {
    main(canvas);
  });
}

export { startMario };
