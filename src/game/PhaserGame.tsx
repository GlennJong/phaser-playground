import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';

export interface IRefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps
{
    currentActiveScene?: (scene_instance: Phaser.Scene) => void
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene }, ref)
{
    const game = useRef<Phaser.Game | null>(null!);

    const [ configData, setConfigData ] = useState();
    
    useEffect(() => {
        handleGetGameConfig();
    }, []);

    const handleGetGameConfig = async() => {
        const data = await fetchGetGameData()
        setConfigData(data);
        // console.log({data});
    }

    const fetchGetGameData = () => {
        return new Promise(resolve => {
            fetch('/configs/battle_character.json')
            .then(function (response) {
                resolve(response.json());
              })
              .then(function (myJson) {
                console.log(myJson);
              });
        })
    }
    
    
    useLayoutEffect(() =>
    {
        if (game.current === null && typeof configData !== 'undefined')
        {

            game.current = StartGame("game-container", configData);

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: null });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: null };
            }

        }

        return () =>
        {
            if (game.current)
            {
                game.current.destroy(true);
                if (game.current !== null)
                {
                    game.current = null;
                }
            }
        }
    }, [ref, configData]);

    useEffect(() =>
    {
        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) =>
        {
            if (currentActiveScene && typeof currentActiveScene === 'function')
            {

                currentActiveScene(scene_instance);

            }

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: scene_instance });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: scene_instance };
            }
            
        });
        return () =>
        {
            EventBus.removeListener('current-scene-ready');
        }
    }, [currentActiveScene, ref]);

    return (
        <div id="game-container"></div>
    );

});
