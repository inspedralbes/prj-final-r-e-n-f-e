export function getSimbolAssistencia(estat: string, justificat: boolean) {
  switch (estat) {
    case 'Assistit':
      return '.';
    case 'Retard':
      return 'R';
    case 'Falta':
      if (justificat) {
        return 'FJ';
      } else {
        return 'F';
      }
    default:
      return '';
  }
}
