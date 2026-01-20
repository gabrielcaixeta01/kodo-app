/**
 * Converte uma data em formato YYYY-MM-DD para timestamp considerando o timezone local
 * Evita problemas onde o timestamp é interpretado em UTC
 */
export function dateStringToTimestamp(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  // Cria uma data no timezone local, não em UTC
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  return date.getTime();
}

/**
 * Converte um timestamp para string de data YYYY-MM-DD considerando timezone local
 */
export function timestampToDateString(timestamp: number): string {
  const date = new Date(timestamp);
  // Cria a string sem conversão para UTC
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
