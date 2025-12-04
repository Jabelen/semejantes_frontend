export const formatChileDate = (dateString) => {
  if (!dateString) return "-";

  const dateToProcess = dateString.includes("T")
    ? dateString
    : `${dateString}T12:00:00`;

  const date = new Date(dateToProcess);

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};
