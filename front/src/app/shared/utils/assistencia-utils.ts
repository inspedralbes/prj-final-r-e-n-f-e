export function getSimbolAssistencia(estat: string, justificat: boolean) {
  switch (estat) {
    case 'Assistit':
      return '.';
    case 'Retart':
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
