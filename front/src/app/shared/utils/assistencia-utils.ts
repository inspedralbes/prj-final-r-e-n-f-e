export function getSimbolAssistencia(estat: string, justificat: boolean) {
  switch (estat) {
    case 'Assistit':
      return '.';
    case 'Retard':
      return 'R';
    case 'Falta':
      return 'F';
    case 'Justificada':
      return 'FJ';
    default:
      return '';
  }
}
