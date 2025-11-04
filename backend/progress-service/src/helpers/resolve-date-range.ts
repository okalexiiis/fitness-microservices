/**
 * Recibe la fecha de hoy y agrega una cantidad de dias
 * @param today La fecha inicial a la que se sumarán los días.
 * @param days La cantidad de días a sumar.
 * @returns Una nueva fecha con los días sumados.
*/
function addDays(today: Date, days: number): Date {
  // 1. Crear una copia de la fecha original para evitar modificarla directamente.
  const newDate = new Date(today.getTime());

  // 2. Usar el método setDate() para modificar el día del mes.
  //    setDate() maneja automáticamente los cambios de mes y año.
  newDate.setDate(today.getDate() + days);

  return newDate;
}

/**
 * Función auxiliar para obtener el inicio del año actual (1 de enero a las 00:00:00).
 * @param date La fecha base.
 * @returns El 1 de enero de ese mismo año.
 */
function startOfYear(date: Date): Date {
  const newDate = new Date(date.getTime());
  newDate.setMonth(0); // Enero
  newDate.setDate(1); // Día 1
  newDate.setHours(0, 0, 0, 0); // Limpiar la hora
  return newDate;
}

/**
 * Convierte un filtro de rango semántico (4weeks, 6month, lastYear)
 * en un par de fechas ISO (YYYY-MM-DD).
 * @param range El rango semántico (e.g., "4weeks", "6month", "thisYear").
 * @returns Un arreglo con [fecha_inicio_ISO, fecha_fin_ISO].
 */
function resolveDateRange(range: string): [string, string] {
  // 1. Definir la fecha de hoy como la fecha de fin
  const today = new Date();
  let start: Date;

  // 2. Lógica de selección del rango
  switch (range) {
    case "4weeks":
      // 4 semanas = 28 días. Se usa la función auxiliar addDays con valor negativo.
      start = addDays(today, -28);
      break;

    case "6month":
      // **CORRECCIÓN CLAVE:** Retroceder 6 meses de forma precisa usando setMonth().
      start = new Date(today.getTime());
      start.setMonth(start.getMonth() - 6);
      start.setHours(0, 0, 0, 0); // Opcional: limpiar la hora
      break;

    case "thisYear": // Renombrado para que coincida con startOfYear
    case "lastYear": // Manteniendo el nombre original, asumiendo "Inicio del Año Actual"
      // Usa la función auxiliar startOfYear
      start = startOfYear(today);
      break;

    default:
      // Filtro genérico: Últimos 30 días
      start = addDays(today, -30);
  }

  // 3. Formatear las fechas a ISO (YYYY-MM-DD)
  // Nota: Si quieres la fecha de hoy con la hora actual, usa today.toISOString().
  // Si quieres que el rango termine exactamente al inicio de hoy, podrías usar:
  // const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Asumiendo que quieres hoy (hora actual) como la fecha de fin
  const endISO = today.toISOString().split("T")[0];

  // Asumiendo que la fecha de inicio debe tener la hora limpiada para evitar sorpresas en el rango
  // (Aunque la lógica de setMonth() y startOfYear() ya lo hacen)
  const startISO = start.toISOString().split("T")[0];

  return [startISO, endISO];
}
