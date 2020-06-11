// declare module 'fabric';
interface FabricCanvas extends fabric.Canvas {
  /**
   * Copy object to clipboard
   */
  copy: () => void;
  /**
   * Paste object from clipboard
   */
  paste: () => void;
  /**
   * Remove active object
   */
  removeActiveObject: () => void;
  /**
   * Quick clone a selected object
   */
  quickClone: () => void;
  /**
   * Un-group active object
   */
  ungroupActiveObject: () => void;
  /**
   * Group active object
   */
  groupActiveObject: () => void;
  /**
   * Toggle group/ungroup
   */
  toggleGrouping: () => void;
}
