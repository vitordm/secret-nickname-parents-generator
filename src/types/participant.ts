export interface Participant {
  id: string;
  displayName: string;
  aliases: string[];
  words: string[];
  nickname: string;
  participantImage: string;
  generatedImage: string;
  resultMessage: string;
  finalMessage: string;
  showUltrasound?: boolean;
}

export interface ParticipantsCatalog {
  participants: Participant[];
}
