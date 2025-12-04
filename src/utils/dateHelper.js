export const formatChileDate = (dateString) => {
  if (!dateString) return "-";

  // Truco: Le agregamos "T12:00:00" para que al convertirla no se atrase un día
  // por la diferencia horaria. Así aseguramos que el día se mantenga igual.
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
