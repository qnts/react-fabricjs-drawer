import React, { useState } from 'react';
import { toProps, getPanelPosition } from '../fabric/properties';

interface onChange {
  (name: string, value: any): void;
}
interface remove {
  (): void;
}

function Property({ name, value, onChange }: { name: string, value: any, onChange: onChange }) {
  const [realValue, setValue] = useState<any>(value);
  const change = (e: any) => {
    setValue(e.target.value);
    onChange(name, e.target.value);
  }
  const input = (() => {
    switch (name) {
      case 'fill':
      case 'stroke':
        return (
          <input type="color" value={realValue} onChange={change} />
        );
      case 'strokeWidth':
        return (
          <div className="input-group">
            <input type="range" value={realValue} min={0} max={10} onChange={change} />
            <span>{realValue}</span>
          </div>
        );
      case 'fontSize':
        return (
          <div className="input-group">
            <input type="range" value={realValue} min={10} max={72} onChange={change} />
            <span>{realValue}</span>
          </div>
        );
      // readonly properties
      case 'left':
      case 'top':
      case 'width':
      case 'height':
      case 'angle':
        return (
          <span>{realValue}</span>
        );
      default:
        return null;
    }
  })();
  if (input) {
    return (
      <div className="rfd-property">
        <label>{name}</label>
        {input}
      </div>
    )
  }
  return null;
}

function PropertyPanel({ object, onChange, getPaper }: {
  object: fabric.Object,
  onChange: onChange,
  getPaper: () => FabricCanvas,
}) {
  const properties = toProps(object);
  const position = getPanelPosition(object);
  return (
    <div className="rfd-property-panel" style={position}>
      <div className="rfd-header">
        <h4 className="rfd-name">{object.type}</h4>
      </div>
      {Object.keys(properties).map((field, index) => (
        <Property name={field} value={properties[field]} onChange={onChange} key={index} />
      ))}
      <div className="actions">
        <div className="rfd-row">
          <button type="button" onClick={() => object.sendToBack()} className="rfd-btn squared">
            <i className="icon-chevrons-left" />
          </button>
          <button type="button" onClick={() => object.sendBackwards()} className="rfd-btn squared">
            <i className="icon-chevron-left" />
          </button>
          <button type="button" onClick={() => object.bringForward()} className="rfd-btn squared">
            <i className="icon-chevron-right" />
          </button>
          <button type="button" onClick={() => object.bringToFront()} className="rfd-btn squared">
            <i className="icon-chevrons-right" />
          </button>
          <button type="button" onClick={() => getPaper().quickClone()} className="rfd-btn squared">
            <i className="icon-copy" />
          </button>
        </div>
        <div className="rfd-row between">
          <button type="button" onClick={() => getPaper().removeActiveObject()} className="rfd-btn">
            <i className="icon-x" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyPanel;
