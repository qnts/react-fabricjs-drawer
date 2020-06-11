import React from 'react';
import { fabric } from 'fabric';

interface getPaper {
  (): any;
}

function Toolbar({ getPaper }: { getPaper: getPaper }) {

  const addRect = () => {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: '#eeeeee',
      width: 100,
      height: 100,
      strokeWidth: 1,
      stroke: '#bbbbbb',
    });
    getPaper().add(rect);
  };
  const addCircle = () => {
    const circle = new fabric.Circle({
      left: 50,
      top: 50,
      fill: '#d697ea',
      radius: 40,
      strokeWidth: 1,
      stroke: '#a63bc7',
    });
    getPaper().add(circle);
  };
  const addTriangle = () => {
    const circle = new fabric.Triangle({
      left: 70,
      top: 70,
      fill: '#ffe8b4',
      strokeWidth: 1,
      stroke: '#daa01b',
    });
    getPaper().add(circle);
  };
  const addLine = () => {
    const line = new fabric.Line([ 50, 100, 200, 200], {
      left: 25,
      top: 25,
      stroke: '#000000',
    });
    getPaper().add(line);
  }

  const addText = () => {
    const text = new fabric.Textbox('textbox', {
      fontSize: 20,
      left: 100,
      top: 100,
      fill: '#000000',
      width: 100,
    });
    getPaper().add(text);
  };

  const clearAll = () => {
    const paper = getPaper();
    const objects = paper.getObjects();
    if (objects.length) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm('Are you sure?')) {
        objects.forEach((object: any) => {
          paper.remove(object);
        });
        paper.renderAll();
      }
    }
  }

  return (
    <div className="rfd-toolbar">
      <button onClick={addRect} className="rfd-btn squared" type="button">
        <i className="icon-square" />
      </button>
      <button onClick={addCircle} className="rfd-btn squared" type="button">
        <i className="icon-circle" />
      </button>
      <button onClick={addTriangle} className="rfd-btn squared" type="button">
        <i className="icon-triangle" />
      </button>
      <button onClick={addLine} className="rfd-btn squared" type="button">
        <i className="icon-minus" />
      </button>
      <button onClick={addText} className="rfd-btn squared" type="button">
        <i className="icon-type" />
      </button>
      <button onClick={clearAll} className="rfd-btn" type="button">
        <i className="icon-eraser" /> Clear
      </button>
      <button onClick={() => console.log(getPaper().toJSON())} className="rfd-btn" type="button">
        <i className="icon-save" /> Save
      </button>
    </div>
  );
}

export default Toolbar;
