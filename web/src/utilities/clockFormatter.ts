export function clockFormatter(time: string) {
  if (!time.includes(":")) {
    return Number(time);
  }

  const timeArray = time.split(":");

  if (timeArray.length === 2) {
    return Number(timeArray[0]) * 60 + Number(timeArray[1]);
  }

  if (timeArray.length === 3) {
    return (
      Number(timeArray[0]) * 3600 +
      Number(timeArray[1]) * 60 +
      Number(timeArray[2])
    );
  }

  return 0;
}
