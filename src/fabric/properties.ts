export const PROPERTY_TYPES: any = {
  fill: {
    type: 'input',
  },
  strokeWidth: {
    type: 'input',
    formatValue: (value: string) => parseInt(value),
  },
  fontSize: {
    type: 'input',
    formatValue: (value: string) => parseInt(value),
  },
  stroke: {
    type: 'input',
  },
  left: {
    type: 'readonly',
    display: 'fixed',
  },
  top: {
    type: 'readonly',
    display: 'fixed',
  },
  angle: {
    type: 'readonly',
    display: 'fixed',
  },
  width: {
    type: 'readonly',
    display: (v: any, o: any) => o.getScaledWidth().toFixed(2),
  },
  height: {
    type: 'readonly',
    display: (v: any, o: any) => o.getScaledHeight().toFixed(2),
  },
};

export const OBJECT_PROPERTIES: any = {
  rect: ['fill', 'strokeWidth', 'stroke', 'left', 'top', 'angle', 'width', 'height'],
  circle: ['fill', 'strokeWidth', 'stroke', 'left', 'top', 'angle', 'width', 'height'],
  triangle: ['fill', 'strokeWidth', 'stroke', 'left', 'top', 'angle', 'width', 'height'],
  line: ['strokeWidth', 'stroke', 'left', 'top', 'angle', 'width', 'height'],
  textbox: ['fill', 'fontSize', 'left', 'top', 'angle', 'width', 'height'],
};

export function toProps(object: any) {
  const result: any = {};
  const properties = OBJECT_PROPERTIES[object.type];
  if (properties) {
    properties.forEach((fieldName: string) => {
      let field = PROPERTY_TYPES[fieldName];
      if (typeof field.unavailable === 'undefined' || !field.unavailable.includes(object.type)) {
        let val = object[fieldName];
        if (field.display === 'fixed') {
          val = Number(val).toFixed(2);
        } else if ( typeof field.display === 'function') {
          val = field.display(object[fieldName], object);
        }
        result[fieldName] = val;
      }
    });
  }

  return result;
}

export function getPanelPosition(object: any): { left: number, top: number } {
  return {
    left: object.left + object.getScaledWidth() + 10,
    top: object.top,
  };
}

export function formatValue(fieldName: string, value: any) {
  const field = PROPERTY_TYPES[fieldName];
  let newValue;
  if (field && typeof field.formatValue === 'function') {
    newValue = field.formatValue(value);
  } else {
    newValue = value;
  }
  return newValue;
}
