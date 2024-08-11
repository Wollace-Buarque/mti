export function secondsFormatter(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = Math.floor(seconds % 60);

  const daysString = days > 0 ? `${days} dia${days !== 1 ? "s" : ""}` : "";
  const hoursString = hours > 0 ? `${hours} hora${hours !== 1 ? "s" : ""}` : "";
  const minutesString =
    minutes > 0 ? `${minutes} minuto${minutes !== 1 ? "s" : ""}` : "";
  const secondsString =
    secondsLeft > 0
      ? `${secondsLeft} segundo${secondsLeft !== 1 ? "s" : ""}`
      : "";

  return `${daysString} ${hoursString} ${minutesString} ${secondsString}`;
}
