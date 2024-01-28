type Sound = 'hit' | 'death' | 'shoot';

export default class SoundEffects {
  private sounds: Record<Sound, string>;
  private audioContext: AudioContext;
  private soundBuffers: Record<string, AudioBuffer>;

  constructor(audioContext: AudioContext) {
    this.sounds = {
      death: 'death.mp3',
      hit: 'hit.mp3',
      shoot: 'shoot.mp3',
    };

    this.audioContext = audioContext;
    this.soundBuffers = {};
  }

  async load() {
    const buffers = await Promise.all(
      Object.values(this.sounds).map(async (sound) => {
        const response = await fetch(`./sounds/${sound}`);
        const buffer = await response.arrayBuffer();
        return this.audioContext.decodeAudioData(buffer);
      }),
    );

    this.soundBuffers = {
      death: buffers[0],
      hit: buffers[1],
      shoot: buffers[2],
    };
  }

  play(sound: Sound) {
    const source = this.audioContext.createBufferSource();
    const gainNode = new GainNode(this.audioContext, { gain: 0.5 });

    source.buffer = this.soundBuffers[sound];
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    source.start();
  }
}
