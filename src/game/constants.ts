export const canvas = {
  width: 800,
  height: 600
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