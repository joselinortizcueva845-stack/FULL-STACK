function badRequest(message) {
  throw Object.assign(new Error(message), { statusCode: 400 });
}

function validateFields(values, fields, required, { partial = false } = {}) {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    badRequest('El cuerpo debe ser un objeto JSON.');
  }

  const unknownFields = Object.keys(values).filter((field) => !fields.includes(field));
  if (unknownFields.length) {
    badRequest(`Campos no permitidos: ${unknownFields.join(', ')}`);
  }

  if (!partial) {
    const missingFields = required.filter((field) => values[field] === undefined);
    if (missingFields.length) {
      badRequest(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
    }
  }

  return values;
}

function validateTextFields(values, fields) {
  for (const field of fields) {
    if (values[field] !== undefined && values[field] !== null && typeof values[field] !== 'string') {
      badRequest(`${field} debe ser texto.`);
    }
  }
}

function validateIds(values, fields) {
  for (const field of fields) {
    if (values[field] !== undefined && (!Number.isInteger(values[field]) || values[field] < 1)) {
      badRequest(`${field} debe ser un entero positivo.`);
    }
  }
}

module.exports = { badRequest, validateFields, validateTextFields, validateIds };