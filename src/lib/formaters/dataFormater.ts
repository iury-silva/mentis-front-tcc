function DataFormater(data: string) {
  const date = new Date(data);
  const dateFormated = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return dateFormated;
}

function DatetimeFormater(data: string) {
  const date = new Date(data);
  const dateFormated = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeFormated = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateFormated} às ${timeFormated}`;
}
export { DataFormater, DatetimeFormater };
