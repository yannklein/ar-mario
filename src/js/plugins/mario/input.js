import Keyboard from './KeyboardState.js';
import InputRouter from './InputRouter.js';
import Jump from './traits/Jump.js';
import Go from './traits/Go.js';

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
        // entity.traits.get(PipeTraveller).direction.x += -1;
      });
    });
    document.querySelector("#btn-left").addEventListener('mouseup', event => {
      router.route(entity => {
        entity.traits.get(Go).dir += 1;
        // entity.traits.get(PipeTraveller).direction.x += 1;
      });
    });
    document.querySelector("#btn-right").addEventListener('mousedown', event => {
      router.route(entity => {
        entity.traits.get(Go).dir += 1;
        // entity.traits.get(PipeTraveller).direction.x += 1;
      });
    });
    document.querySelector("#btn-right").addEventListener('mouseup', event => {
      router.route(entity => {
        entity.traits.get(Go).dir += -1;
        // entity.traits.get(PipeTraveller).direction.x += -1;
      });
    });

    input.addMapping('KeyP', keyState => {
        if (keyState) {
            router.route(entity => entity.traits.get(Jump).start());
        } else {
            router.route(entity => entity.traits.get(Jump).cancel());
        }
    });

    input.addMapping('KeyO', keyState => {
        router.route(entity => entity.turbo(keyState));
    });

    input.addMapping('KeyD', keyState => {
        router.route(entity => entity.traits.get(Go).dir += keyState ? 1 : -1);
    });

    input.addMapping('KeyA', keyState => {
        router.route(entity => entity.traits.get(Go).dir += keyState ? -1 : 1);
    });

    return router;
}
