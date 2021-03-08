import Keyboard from './KeyboardState.js';
import InputRouter from './InputRouter.js';
import Jump from './traits/Jump.js';
import PipeTraveller from './traits/PipeTraveller.js';
import Go from './traits/Go.js';

const KEYMAP = {
    UP: 'KeyW',
    DOWN: 'KeyS',
    LEFT: 'KeyA',
    RIGHT: 'KeyD',
    A: "KeyP",
    B: "KeyO",
};

export function setupKeyboard(window) {
    const input = new Keyboard();
    const router = new InputRouter();

    input.listenTo(window);

    document.querySelector("#btn-jump").addEventListener('click', event => {
      router.route(entity => entity.traits.get(Jump).start());
    });
    document.querySelector("#btn-left").addEventListener('mousedown', event => {
      router.route(entity => {
        entity.traits.get(Go).dir += -1;
        entity.traits.get(PipeTraveller).direction.x += -1;
      });
    });
    document.querySelector("#btn-left").addEventListener('mouseup', event => {
      router.route(entity => {
        entity.traits.get(Go).dir += 1;
        entity.traits.get(PipeTraveller).direction.x += 1;
      });
    });
    document.querySelector("#btn-right").addEventListener('mousedown', event => {
      router.route(entity => {
        entity.traits.get(Go).dir += 1;
        entity.traits.get(PipeTraveller).direction.x += 1;
      });
    });
    document.querySelector("#btn-right").addEventListener('mouseup', event => {
      router.route(entity => {
        entity.traits.get(Go).dir += -1;
        entity.traits.get(PipeTraveller).direction.x += -1;
      });
    });

    input.addMapping(KEYMAP.A, keyState => {
        if (keyState) {
            router.route(entity => entity.traits.get(Jump).start());
        } else {
            router.route(entity => entity.traits.get(Jump).cancel());
        }
    });

    input.addMapping(KEYMAP.B, keyState => {
        router.route(entity => entity.turbo(keyState));
    });

    input.addMapping(KEYMAP.UP, keyState => {
        router.route(entity => {
            entity.traits.get(PipeTraveller).direction.y += keyState ? -1 : 1;
        });
    });

    input.addMapping(KEYMAP.DOWN, keyState => {
        router.route(entity => {
            entity.traits.get(PipeTraveller).direction.y += keyState ? 1 : -1;
        });
    });

    input.addMapping(KEYMAP.RIGHT, keyState => {
        router.route(entity => {
            entity.traits.get(Go).dir += keyState ? 1 : -1;
            entity.traits.get(PipeTraveller).direction.x += keyState ? 1 : -1;
        });
    });

    input.addMapping(KEYMAP.LEFT, keyState => {
        router.route(entity => {
            entity.traits.get(Go).dir += keyState ? -1 : 1;
            entity.traits.get(PipeTraveller).direction.x += keyState ? -1 : 1;
        });
    });

    return router;
}
