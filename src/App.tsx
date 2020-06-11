import React, { useRef, useEffect, useState, JSXElementConstructor } from 'react';
import { fabric } from 'fabric';
import PropertyPanel from './components/PropertyPanel';
import Toolbar from './components/Toolbar';
import { formatValue } from './fabric/properties';

function App() {
  const wrapper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const paper = useRef<any>(null);
  const [clipboard, setClipboard] = useState<any>(null);
  const [dirty, setDirty] = useState(false);
  const [activeObject, setActiveObject] = useState<any>(null);

  const onSelect = (e: any) => {
    if (paper.current.getActiveObjects().length === 1) {
      setActiveObject(e.target);
    } else {
      setActiveObject(null);
    }
  };
  const onMove = (e: any) => {
    if (paper.current.getActiveObjects().length === 1) {
      setActiveObject(null);
      setDirty(true);
    }
  };
  const onMoved = (e: any) => {
    if (paper.current.getActiveObjects().length === 1) {
      setActiveObject(e.target);
      setDirty(true);
    }
  }
  const onChange = (name: string, value: any) => {
    try {
      activeObject.set(name, formatValue(name, value));
      paper.current.requestRenderAll();
    } catch (err) {
      console.log(err);
    }
  };
  const removeActiveObject = () => {
    paper.current.getActiveObjects().forEach((obj: any) => {
      paper.current.remove(obj);
    });
    paper.current.discardActiveObject();
    paper.current.requestRenderAll();
    setDirty(true);
  }
  const groupActiveObject = () => {
    if (!paper.current.getActiveObject()) {
      return;
    }
    if (paper.current.getActiveObject().type !== 'activeSelection') {
      return;
    }
    paper.current.getActiveObject().toGroup();
    paper.current.requestRenderAll();
  };
  const ungroupActiveObject = () => {
    if (!paper.current.getActiveObject()) {
      return;
    }
    if (paper.current.getActiveObject().type !== 'group') {
      return;
    }
    paper.current.getActiveObject().toActiveSelection();
    paper.current.requestRenderAll();
  };
  const toggleGrouping = () => {
    if (!paper.current.getActiveObject()) {
      return;
    }
    if (paper.current.getActiveObject().type === 'group') {
      paper.current.getActiveObject().toActiveSelection();
    } else if (paper.current.getActiveObject().type === 'activeSelection') {
      paper.current.getActiveObject().toGroup();
    }
    paper.current.requestRenderAll();
  };
  const copy = () => {
    const activeObject = paper.current.getActiveObject();
    if (activeObject) {
      activeObject.clone((cloned: any) => {
        setClipboard(cloned);
      });
    }
  };
  const paste = () => {
    // clone again, so you can do multiple copies.
    if (clipboard) {
      clipboard.clone((clonedObj: any) => {
        paper.current.discardActiveObject();
        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,
          evented: true,
        });
        if (clonedObj.type === 'activeSelection') {
          // active selection needs a reference to the canvas.
          clonedObj.canvas = paper.current;
          clonedObj.forEachObject((obj: any) => {
            paper.current.add(obj);
          });
          // this should solve the unselectability
          clonedObj.setCoords();
        } else {
          paper.current.add(clonedObj);
        }
        // store another clipboard
        clipboard.clone((cloned: any) => {
          cloned.top += 10;
          cloned.left += 10;
          setClipboard(cloned);
        });
        // render
        paper.current.setActiveObject(clonedObj);
        paper.current.requestRenderAll();
      });
    }
  };
  /**
   * Quick clone an active object without clipboard
   */
  const quickClone = () => {
    const activeObject = paper.current.getActiveObject();
    if (activeObject) {
      activeObject.clone((cloned: any) => {
        cloned.left += 15;
        cloned.top += 15;
        paper.current.add(cloned);
        paper.current.discardActiveObject();
        paper.current.setActiveObject(cloned);
        paper.current.requestRenderAll();
      });
    }
  }
  // keyboard events
  const press = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(e.keyCode);
    switch (e.keyCode) {
      case 46:
        // delete
        removeActiveObject();
      break;
      case 67:
        // c
        if (e.ctrlKey) {
          copy();
        }
      break;
      case 86:
        // v
        if (e.ctrlKey) {
          paste();
        }
      break;
      case 66:
        // b -> toggle group/ungroup
        if (e.ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          toggleGrouping();
        }
      break;
    }
  };

  useEffect(() => {
    paper.current = new fabric.Canvas('rfd-canvas');
    paper.current.on('selection:cleared', () => setActiveObject(null));
    paper.current.on('selection:updated', onSelect);
    paper.current.on('selection:created', onSelect);
    // panel
    paper.current.on('object:moving', onMove);
    paper.current.on('object:scaling', onMove);
    paper.current.on('object:rotating', onMove);
    paper.current.on('object:moved', onMoved);
    paper.current.on('object:scaled', onMoved);
    paper.current.on('object:rotated', onMoved);
    paper.current.removeActiveObject = removeActiveObject;
    paper.current.groupActiveObject = groupActiveObject;
    paper.current.ungroupActiveObject = ungroupActiveObject;
    paper.current.toggleGrouping = toggleGrouping;
    paper.current.quickClone = quickClone;
  }, []);

  return (
    <div className="rfd">
      <Toolbar getPaper={() => paper.current} />
      <div className="rfd-wrapper" ref={wrapper} tabIndex={1000} onKeyUp={press}>
        <canvas ref={canvas} id="rfd-canvas" width="1000" height="500" />
      </div>
      {activeObject && (
        <PropertyPanel
          object={activeObject}
          onChange={onChange}
          getPaper={() => paper.current}
        />
      )}
    </div>
  );
}

export default App;
