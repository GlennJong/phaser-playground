export const originalWidth = 160;
export const originalHeight = 160;

export const canvas = {
  width: 160,
  height: 144
}

export const tamagochi = {
  character: {
    width: 32,
    height: 32
  }
}

export type scene_tamagochi = {
  main: ['Room'],
  shop: ['Food', 'Toy'],
}
export type scene_combat = {
  main: ['Battle']
}
// combat: ['Battle', 'Win', 'Lose']